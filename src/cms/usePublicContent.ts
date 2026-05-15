import { useCallback, useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabaseClient";

export interface PublicContentItem {
  id: string;
  title: string;
  body: string;
  updated_at: string;
  updated_by: string | null;
}

export function usePublicContent(contentId: string) {
  const [content, setContent] = useState<PublicContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial content
  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("public_content")
          .select("*")
          .eq("id", contentId)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // No rows found - this is expected for new content
            setContent(null);
          } else {
            setError(error.message);
          }
        } else if (mounted) {
          setContent(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchContent();

    // Subscribe to real-time changes
    const channel = supabaseClient
      .channel(`public_content:${contentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "public_content",
          filter: `id=eq.${contentId}`,
        },
        (payload: any) => {
          if (mounted) {
            if (payload.eventType === "DELETE") {
              setContent(null);
            } else {
              setContent(payload.new as PublicContentItem);
            }
          }
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabaseClient.removeChannel(channel);
    };
  }, [contentId]);

  const updateContent = useCallback(
    async (title: string, body: string) => {
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const userId = sessionData.session?.user.id;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Upsert content (create if not exists, update if exists)
        const { data, error } = await supabaseClient
          .from("public_content")
          .upsert(
            {
              id: contentId,
              title,
              body,
              updated_at: new Date().toISOString(),
              updated_by: userId,
            },
            { onConflict: "id" },
          )
          .select()
          .single();

        if (error) {
          throw error;
        }

        setContent(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update";
        setError(message);
        throw err;
      }
    },
    [contentId],
  );

  return { content, loading, error, updateContent };
}
