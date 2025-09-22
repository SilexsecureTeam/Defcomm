// hooks/useAutoScroll.ts
import { useEffect, useRef, RefObject } from "react";

interface UseAutoScrollOptions {
  messages: any[];
  containerRef: RefObject<HTMLElement>;
  endRef: RefObject<HTMLElement>;
  typing?: boolean;
  threshold?: number; // px distance from bottom to still auto-scroll
}

export function useAutoScroll({
  messages,
  containerRef,
  endRef,
  typing = false,
  threshold = 100,
}: UseAutoScrollOptions) {
  const initialLoad = useRef(true);

  // Scroll to bottom on first load
  useEffect(() => {
    if (initialLoad.current && messages?.length > 0) {
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "auto" });
      });
      initialLoad.current = false;
    }
  }, [messages?.length, endRef]);

  // Scroll when new messages arrive (if user is near bottom)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !messages?.length) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    if (isNearBottom) {
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, containerRef, endRef, threshold]);

  // Scroll when typing indicator appears (but only if near bottom)
  useEffect(() => {
    if (!typing) return;
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    if (isNearBottom) {
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [typing, containerRef, endRef, threshold]);
}
