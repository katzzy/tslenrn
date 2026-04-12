import { useEffect, useRef, useState } from 'react';

interface UseSplitPaneOptions {
  initialRatio?: number;
  minRatio?: number;
  maxRatio?: number;
}

export function useSplitPane({
  initialRatio = 0.68,
  minRatio = 0.45,
  maxRatio = 0.85,
}: UseSplitPaneOptions = {}) {
  const [editorPaneRatio, setEditorPaneRatio] = useState(initialRatio);
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !layoutRef.current) return;
      const rect = layoutRef.current.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const clampedRatio = Math.min(maxRatio, Math.max(minRatio, ratio));
      setEditorPaneRatio(clampedRatio);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [maxRatio, minRatio]);

  const onResizeStart = () => {
    isDraggingRef.current = true;
  };

  return {
    layoutRef,
    editorPaneRatio,
    onResizeStart,
  };
}
