import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useModal } from "./useModal";

export interface ContentEditorModalProps {
  initialTitle: string;
  initialBody: string;
  onSave?: (title: string, body: string) => Promise<void>;
}

export function ContentEditorModal({
  initialTitle,
  initialBody,
  onSave,
}: ContentEditorModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { role } = useAuth();
  const modal = useModal();

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialBody,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none p-4 bg-[var(--color-bg)] text-[var(--color-text)] rounded-lg border border-[var(--color-surface-3)] focus:ring-2 focus:ring-[var(--color-focus)] min-h-64",
      },
    },
  });

  // Only super_admin can edit
  if (role !== "super_admin") {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          No tienes permisos para editar contenido.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    try {
      const body = editor?.getHTML() ?? initialBody;
      if (onSave) {
        await onSave(title, body);
      }
      modal.closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Title field */}
      <div>
        <label
          htmlFor="content-title"
          className="block text-sm font-medium text-[var(--color-text)]"
        >
          Título
        </label>
        <input
          id="content-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
          className="mt-1 w-full px-4 py-2 bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-surface-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all disabled:opacity-50"
          placeholder="Título del contenido"
        />
      </div>

      {/* Rich text editor */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Contenido
        </label>
        <div className="border border-[var(--color-surface-3)] rounded-lg overflow-hidden">
          <div className="flex gap-1 bg-[var(--color-surface-3)] p-2 border-b border-[var(--color-surface-3)]">
            {/* Toolbar buttons */}
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
              className="px-2 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-surface-3)] rounded disabled:opacity-50"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
              className="px-2 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-surface-3)] rounded disabled:opacity-50"
              title="Italic"
            >
              <em>I</em>
            </button>
            <div className="flex-1" />
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="px-2 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-surface-3)] rounded text-xs"
              title="Heading"
            >
              H1
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className="px-2 py-1 bg-[var(--color-bg)] hover:bg-[var(--color-surface-3)] rounded text-xs"
              title="Bullet List"
            >
              •
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => modal.closeModal()}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg border border-[var(--color-surface-3)] text-[var(--color-text)] hover:bg-[var(--color-surface-3)] transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </motion.div>
  );
}
