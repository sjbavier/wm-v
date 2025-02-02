import { useState, useEffect, useRef, MutableRefObject } from 'react';

const useElementHeight = (): [
  MutableRefObject<HTMLDivElement | null>,
  number
] => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateHeight = () =>
      setHeight(element.getBoundingClientRect().height);

    updateHeight(); // Get initial height

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [ref]);

  return [ref, height];
};

export default useElementHeight;
