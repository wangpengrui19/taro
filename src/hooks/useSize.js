import { useEffect, useRef, useState } from 'react';

/**
 * 观测容器尺寸 —— 用于水晶球物理布局随视口响应。
 */
export function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const roRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    roRef.current = ro;
    return () => ro.disconnect();
  }, [ref]);

  return size;
}
