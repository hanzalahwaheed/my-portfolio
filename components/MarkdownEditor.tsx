'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  height = 500,
  placeholder = 'Write your content here (Markdown supported)...'
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  // Fix for hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[500px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="w-full" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="edit"
        textareaProps={{
          placeholder,
        }}
        style={{
          borderRadius: '0.375rem',
          borderColor: '#e5e7eb',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
        visibleDragbar={false}
        highlightEnable={true}
      />
    </div>
  );
}
