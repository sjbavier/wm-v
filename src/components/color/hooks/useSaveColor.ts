import { useEffect } from 'react';

const useSaveColor = ({ color }: { color: string }) => {
  useEffect(() => {
    let mounted = true;
    const setLocalToken = (color: string) => {
      localStorage.setItem('customColor', color);
    };

    if (mounted) {
      setLocalToken(color || '');
    }
    return () => {
      mounted = false;
    };
  }, [color]);
};

export default useSaveColor;
