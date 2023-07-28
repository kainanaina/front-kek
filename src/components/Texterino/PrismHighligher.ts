'use client';
import { useEffect } from 'react';

export default function PrismHighligher() {
  useEffect(() => {
    if (window !== undefined) {
      // @ts-ignore
      window.Prism?.highlightAll();
    }
  }, []);

  return null;
}