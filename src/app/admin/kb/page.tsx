'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Eye, Code, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DocumentTree, KBDocument } from '@/components/kb-document-tree';
import { MarkdownEditor } from '@/components/markdown-editor';
import { MarkdownPreview } from '@/components/markdown-preview';

const categories = ['VAT', 'Income Tax', 'WHT', 'CGT', 'General'];

interface EditorState {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'draft' | 'published';
  version: number;
  updatedAt: string;
}

export default function KBEditorPage() {
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedProgress, setEmbedProgress] = useState({ current: 0, total: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadDocumentsList = async () => {
    const res = await fetch('/api/v1/kb');
    const data = await res.json();
    return data.documents || [];
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const docs = await loadDocumentsList();
        setDocuments(docs);
        if (docs.length > 0) {
          const firstDoc = docs[0];
          setSelectedId(firstDoc.id);
          if (firstDoc.content !== undefined) {
            setEditor({
              id: firstDoc.id,
              title: firstDoc.title,
              category: firstDoc.category,
              content: firstDoc.content,
              status: firstDoc.status,
              version: firstDoc.version,
              updatedAt: firstDoc.updated_at,
            });
          } else {
            const detailRes = await fetch(`/api/v1/kb?id=${firstDoc.id}`);
            const detailData = await detailRes.json();
            if (detailData.document) {
              setEditor({
                id: detailData.document.id,
                title: detailData.document.title,
                category: detailData.document.category,
                content: detailData.document.content || '',
                status: detailData.document.status,
                version: detailData.document.version,
                updatedAt: detailData.document.updated_at,
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const selectDocument = async (id: string) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/v1/kb?id=${id}`);
      const data = await res.json();
      if (data.document) {
        setEditor({
          id: data.document.id,
          title: data.document.title,
          category: data.document.category,
          content: data.document.content || '',
          status: data.document.status,
          version: data.document.version,
          updatedAt: data.document.updated_at,
        });
      }
    } catch (error) {
      console.error('Failed to fetch document:', error);
    }
  };

  const handleCreateNew = () => {
    const newDoc: EditorState = {
      id: 'new',
      title: 'Untitled Document',
      category: 'General',
      content: '',
      status: 'draft',
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    setEditor(newDoc);
    setSelectedId(null);
    setViewMode('edit');
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const url = editor.id === 'new'
        ? '/api/v1/kb'
        : `/api/v1/kb?id=${editor.id}`;
      const method = editor.id === 'new' ? 'POST' : 'PUT';

      const payload: Record<string, string> = {
        title: editor.title,
        category: editor.category,
        content: editor.content,
      };
      if (status) payload.status = status;
      else if (editor.id !== 'new') payload.status = editor.status;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.document) {
        setEditor({
          ...editor,
          id: data.document.id,
          status: data.document.status,
          version: data.document.version,
          updatedAt: data.document.updated_at,
        });
        const docs = await loadDocumentsList();
        setDocuments(docs);
        if (data.document.id !== editor.id) {
          setSelectedId(data.document.id);
        }
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmbed = async () => {
    if (!editor || editor.id === 'new') return;

    setIsEmbedding(true);
    setEmbedProgress({ current: 0, total: 120 });

    const interval = setInterval(() => {
      setEmbedProgress((prev) => {
        if (prev.current >= prev.total) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, current: Math.min(prev.current + Math.floor(Math.random() * 5) + 1, prev.total) };
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setEmbedProgress({ current: 120, total: 120 });
      setTimeout(() => {
        setIsEmbedding(false);
        setEmbedProgress({ current: 0, total: 0 });
      }, 1000);
    }, 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/kb?id=${id}`, { method: 'DELETE' });
      setShowDeleteConfirm(null);
      if (selectedId === id) {
        setSelectedId(null);
        setEditor(null);
      }
      const docs = await loadDocumentsList();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleDuplicate = async () => {
    if (!editor || editor.id === 'new') return;

    try {
      const res = await fetch('/api/v1/kb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${editor.title} (Copy)`,
          category: editor.category,
          content: editor.content,
        }),
      });
      const data = await res.json();
      if (data.document) {
        const docs = await loadDocumentsList();
        setDocuments(docs);
        selectDocument(data.document.id);
      }
    } catch (error) {
      console.error('Failed to duplicate document:', error);
    }
  };

  const lastEdited = editor?.updatedAt
    ? new Date(editor.updatedAt).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Knowledge Base</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage tax documents and RAG knowledge base
          </p>
        </div>
        <Button onClick={handleCreateNew} variant="primary" size="sm">
          <Plus className="w-4 h-4" />
          New Doc
        </Button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <Card className="w-64 flex-shrink-0 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
            </div>
          ) : (
            <DocumentTree
              documents={documents.map((d) => ({
                ...d,
                status: d.status as 'draft' | 'published',
              }))}
              selectedId={selectedId || undefined}
              onSelect={selectDocument}
            />
          )}
        </Card>

        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {editor ? (
            <>
              <div className="p-4 border-b border-border-default space-y-3">
                <Input
                  value={editor.title}
                  onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                  placeholder="Document title"
                  className="text-lg font-semibold"
                />

                <div className="flex items-center gap-3">
                  <select
                    value={editor.category}
                    onChange={(e) => setEditor({ ...editor, category: e.target.value })}
                    className="h-10 px-3 rounded-input bg-surface-base border border-border-strong text-text-primary text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant={viewMode === 'edit' ? 'brand' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('edit')}
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'preview' ? 'brand' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                {viewMode === 'edit' ? (
                  <MarkdownEditor
                    value={editor.content}
                    onChange={(content) => setEditor({ ...editor, content })}
                    className="h-full rounded-none border-0"
                  />
                ) : (
                  <MarkdownPreview
                    content={editor.content}
                    className="h-full"
                  />
                )}
              </div>

              <div className="p-4 border-t border-border-default">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Status:</span>
                    <Badge
                      variant={editor.status === 'published' ? 'success' : 'warning'}
                    >
                      {editor.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <span className="text-xs text-text-muted">|</span>
                  <span className="text-xs text-text-muted">Version: {editor.version}</span>
                  {lastEdited && (
                    <>
                      <span className="text-xs text-text-muted">|</span>
                      <span className="text-xs text-text-muted">
                        Last edited: {lastEdited} by Admin
                      </span>
                    </>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(editor.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDuplicate}
                      disabled={editor.id === 'new'}
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEmbed()}
                      disabled={editor.id === 'new' || editor.status === 'draft' || isEmbedding}
                    >
                      {isEmbedding ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Embedding... {embedProgress.current}/{embedProgress.total}
                        </>
                      ) : (
                        'Re-embed'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave()}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Draft'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave('published')}
                      disabled={isSaving}
                    >
                      {editor.status === 'published' ? 'Update' : 'Publish'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary-bg border border-brand-primary-border grid place-items-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">
                  Select a document
                </h2>
                <p className="text-text-muted text-sm max-w-xs">
                  Choose a document from the sidebar to edit, or create a new one
                </p>
                <Button onClick={handleCreateNew} variant="primary" size="sm" className="mt-4">
                  <Plus className="w-4 h-4" />
                  Create New Document
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-surface-raised rounded-card border border-border-default shadow-modal p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-text-primary mb-2">Delete Document</h2>
              <p className="text-text-secondary text-sm mb-6">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => handleDelete(showDeleteConfirm)}>
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}