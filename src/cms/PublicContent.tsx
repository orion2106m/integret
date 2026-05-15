import { type ReactNode } from "react";
import { useAuth } from "../auth/useAuth";
import { ContentEditorModal } from "../modals/ContentEditorModal";
import { useModal } from "../modals/useModal";
import { usePublicContent } from "./usePublicContent";

export interface PublicContentProps {
  contentId: string;
  fallback?: ReactNode;
  className?: string;
  renderContent?: (body: string) => ReactNode;
}

export function PublicContent({
  contentId,
  fallback,
  className = "p-4",
  renderContent,
}: PublicContentProps) {
  const { content, loading, updateContent } = usePublicContent(contentId);
  const { role } = useAuth();
  const { alert } = useModal();

  const isSuperAdmin = role === "super_admin";

  const handleEdit = () => {
    alert({
      title: "Editar contenido público",
      body: (
        <ContentEditorModal
          initialTitle={content?.title ?? ""}
          initialBody={content?.body ?? ""}
          onSave={updateContent}
        />
      ),
      dismissible: true,
    });
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="h-20 bg-[var(--color-surface-3)] rounded animate-pulse" />
      </div>
    );
  }

  if (!content && !fallback) {
    return null;
  }

  const bodyContent = content?.body ?? (fallback as string);

  return (
    <div className={`relative group ${className}`}>
      {/* Content */}
      <div className="prose prose-invert max-w-none text-[var(--color-text)]">
        {renderContent ? renderContent(bodyContent) : <p>{bodyContent}</p>}
      </div>

      {/* Edit button for super_admin */}
      {isSuperAdmin && (
        <button
          onClick={handleEdit}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          title="Editar contenido"
          aria-label="Editar contenido"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
