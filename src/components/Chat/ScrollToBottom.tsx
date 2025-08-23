// components/Chat/ScrollToBottomButton.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  containerRef: React.RefObject<HTMLElement | null>; // the scrollable element (overflow-y-auto)
  threshold?: number; // px from bottom considered "at bottom"
  className?: string;
  unreadCount?: number;
  debug?: boolean;
};

export default function ScrollToBottomButton({
  containerRef,
  threshold = 48,
  className = "",
  unreadCount = 0,
  debug = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  const compute = useCallback(() => {
    const el = containerRef?.current;
    if (!el) {
      setVisible(false);
      return;
    }
    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;
    const scrollHeight = el.scrollHeight;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (debug) {
      // helpful values while debugging
      // eslint-disable-next-line no-console
      console.debug("ScrollToBottomButton.compute", {
        scrollTop,
        clientHeight,
        scrollHeight,
        distanceFromBottom,
        threshold,
      });
    }

    setVisible(distanceFromBottom > threshold);
  }, [containerRef, threshold, debug]);

  // rAF throttle wrapper
  const scheduleCompute = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      compute();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    });
  }, [compute]);

  useEffect(() => {
    const el = containerRef?.current;
    // run one initial check
    compute();
    if (!el) return;

    const onScroll = () => scheduleCompute();
    const onResize = () => scheduleCompute();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // cleanup
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [containerRef, compute, scheduleCompute]);

  const scrollToBottom = useCallback(() => {
    const el = containerRef?.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    // optimistically hide button while scroll animates
    setVisible(false);
    // schedule a final compute shortly after to ensure accurate state
    window.setTimeout(() => {
      try {
        const distance = el.scrollHeight - (el.scrollTop + el.clientHeight);
        setVisible(distance > threshold);
      } catch {
        /* ignore */
      }
    }, 300);
  }, [containerRef, threshold]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.18 }}
          className={`fixed right-4 bottom-28 z-50 ${className}`}
        >
          <div className="flex items-center gap-2">
            {unreadCount ? (
              <div className="flex-none -mr-3">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white text-xs font-medium shadow">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              </div>
            ) : null}

            <button
              onClick={scrollToBottom}
              aria-label="Scroll to latest message"
              title="Go to latest"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-oliveDark text-white shadow-lg hover:scale-105 active:scale-95 focus:outline-none"
            >
              <FaChevronDown />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
