import { useEffect } from 'react';

export const useIframeHeight = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!ref.current) return;

    const sendHeight = () => {
      const height = ref.current!.scrollHeight;
      window.parent.postMessage({ type: 'iframe-height', height }, '*');
    };

    sendHeight();

    const observer = new ResizeObserver(() => {
      sendHeight();
    });

    observer.observe(ref.current);

    window.addEventListener('resize', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, [ref]);
};
