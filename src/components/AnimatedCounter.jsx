import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value, duration = 0.8 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const isPercent = typeof value === 'string' && value.includes('%');
    const end = parseFloat(value) || 0;
    
    if (start === end) {
      setCount(value);
      return;
    }
    
    const startTime = performance.now();
    const updateCount = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * (2 - progress); // easeOutQuad
      const current = start + (end - start) * easedProgress;
      
      if (isPercent) {
        setCount(current.toFixed(1) + '%');
      } else {
        setCount(Math.floor(current));
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [value, duration]);
  
  return <span>{count}</span>;
}
