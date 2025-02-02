import { useState, useEffect } from 'react';

export enum Size {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

export function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<Size>(Size.MD);

  useEffect(() => {
    const handleResize = () => {
      // Update state based on the screen width
      if (window.innerWidth < 480) {
        setScreenSize(Size.XS);
      }
      if (window.innerWidth < 768 && window.innerWidth >= 480) {
        setScreenSize(Size.SM);
      }
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setScreenSize(Size.MD);
      }
      if (window.innerWidth < 1200 && window.innerWidth >= 1024) {
        setScreenSize(Size.LG);
      }
      if (window.innerWidth >= 1200) {
        setScreenSize(Size.XL);
      }
    };

    // Initial call to set the initial state
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    screenSize,
    setScreenSize
  };
}

export default useMediaQuery;
