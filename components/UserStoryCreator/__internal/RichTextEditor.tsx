"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { RichTextEditorProps } from "@/types/userStoryComponents";

/** TipTap-based editor with bold, italic, and lists. */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Additional context or background information",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[100px] px-4 py-2 text-[15px] leading-relaxed text-[#d1d1d6] focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04] focus-within:border-[#2997ff]/45 focus-within:ring-2 focus-within:ring-[#2997ff]/20">
      <div className="flex gap-1 border-b border-white/[0.08] p-2">
        <button
          type="button"
          onClick={toggleBold}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            editor.isActive("bold")
              ? "bg-[#2997ff] text-white"
              : "bg-white/[0.06] text-[#d1d1d6] hover:bg-white/[0.1]"
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            editor.isActive("italic")
              ? "bg-[#2997ff] text-white"
              : "bg-white/[0.06] text-[#d1d1d6] hover:bg-white/[0.1]"
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={toggleBulletList}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            editor.isActive("bulletList")
              ? "bg-[#2997ff] text-white"
              : "bg-white/[0.06] text-[#d1d1d6] hover:bg-white/[0.1]"
          }`}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            editor.isActive("orderedList")
              ? "bg-[#2997ff] text-white"
              : "bg-white/[0.06] text-[#d1d1d6] hover:bg-white/[0.1]"
          }`}
          title="Numbered List"
        >
          1.
        </button>
      </div>
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[100px] max-h-[300px] overflow-y-auto"
        />
      </div>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgb(110 110 115);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror li {
          display: list-item;
          margin: 0.25rem 0;
        }
        .ProseMirror li p {
          margin: 0;
        }
        .ProseMirror strong {
          font-weight: 600;
        }
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
