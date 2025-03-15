'use client';
import { useEffect } from 'react';

function useStartPageFromTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default useStartPageFromTop;
