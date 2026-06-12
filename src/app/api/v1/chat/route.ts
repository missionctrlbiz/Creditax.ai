import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getServiceSupabase } from '@/lib/supabase';
import { checkAndResetTokens, incrementTokens } from '@/lib/db';
import { embedText, searchVectors, generateResponse, buildContextFromResults } from '@/lib/rag';
import type { ChatApiRequest, ChatApiResponse, Source } from '@/lib/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body: ChatApiRequest = await request.json();
    const { message, conversationId } = body;
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }
    
    const userWithTokens = await checkAndResetTokens(user.id);
    
    if (!userWithTokens) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }
    
    if (userWithTokens.tokens_used_today >= userWithTokens.daily_token_limit) {
      return NextResponse.json(
        { error: 'Daily token limit reached', code: 'LIMIT_REACHED' },
        { status: 429 }
      );
    }
    
    const supabaseAdmin = getServiceSupabase();
    
    let convId = conversationId;
    if (!convId) {
      const { data: newConv } = await supabaseAdmin
        .from('conversations')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      convId = newConv?.id;
    }
    
    await supabaseAdmin.from('messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    });
    
    let conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];
    if (convId) {
      const { data: history } = await supabaseAdmin
        .from('messages')
        .select('role, content')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (history) {
        conversationHistory = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      }
    }
    
    const embedding = await embedText(message);
    const searchResults = await searchVectors(embedding, 5);
    const context = buildContextFromResults(searchResults);
    
    const { reply, tokensUsed } = await generateResponse(message, context, conversationHistory);
    
    await incrementTokens(user.id, tokensUsed);
    
    const sources: Source[] = searchResults.map((result, index) => ({
      title: result.metadata.title,
      snippet: result.content.slice(0, 200) + (result.content.length > 200 ? '...' : ''),
      url: result.metadata.url,
    }));
    
    await supabaseAdmin.from('messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: reply,
      sources,
      tokens_used: tokensUsed,
    });
    
    const remaining = Math.max(0, userWithTokens.daily_token_limit - userWithTokens.tokens_used_today - tokensUsed);
    
    const response: ChatApiResponse = {
      reply,
      sources,
      conversationId: convId || '',
      tokensUsed,
      remainingToday: remaining,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}