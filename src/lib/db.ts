import { getServiceSupabase } from './supabase';
import type { UserWithTokens } from './types';

export async function getUserWithTokens(userId: string): Promise<UserWithTokens | null> {
  const supabaseAdmin = getServiceSupabase();
  
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, tokens_used_today, daily_token_limit, last_token_reset')
    .eq('id', userId)
    .single();
  
  if (error || !data) return null;
  return data as UserWithTokens;
}

export async function incrementTokens(userId: string, count: number): Promise<void> {
  const supabaseAdmin = getServiceSupabase();
  
  await supabaseAdmin
    .from('users')
    .update({ tokens_used_today: supabaseAdmin.rpc('increment', { increment: count }) })
    .eq('id', userId);
}

export async function resetDailyTokens(userId: string): Promise<void> {
  const supabaseAdmin = getServiceSupabase();
  
  await supabaseAdmin
    .from('users')
    .update({
      tokens_used_today: 0,
      last_token_reset: new Date().toISOString()
    })
    .eq('id', userId);
}

export async function checkAndResetTokens(userId: string): Promise<UserWithTokens | null> {
  const user = await getUserWithTokens(userId);
  if (!user) return null;
  
  const now = new Date();
  const lastReset = new Date(user.last_token_reset);
  
  if (now.toDateString() !== lastReset.toDateString()) {
    await resetDailyTokens(userId);
    return { ...user, tokens_used_today: 0, last_token_reset: now.toISOString() };
  }
  
  return user;
}