import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable on mobile / touchscreens
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // INSTANT 1:1 POSITIONING - ZERO LAG OR DELAY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      }
      if (ringRef.current) {
        const offset = isHovered ? 24 : 16;
        ringRef.current.style.transform = `translate3d(${x - offset}px, ${y - offset}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.glass-card') ||
        target.closest('.interactive') ||
        target.closest('.badge') ||
        target.closest('select') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isHovered]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Precision Center Electric Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: isMouseDown ? '#FF0055' : '#00F0FF',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: isMouseDown
            ? '0 0 15px #FF0055, 0 0 5px #FFFFFF'
            : '0 0 15px #00F0FF, 0 0 5px #FFFFFF',
          opacity: isHovered ? 0 : 1,
          willChange: 'transform',
        }}
      />

      {/* Synchronized 1:1 Instant Glowing Outer Ring (Solo Leveling Mana Aura) */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          border: isMouseDown
            ? '2px solid #FF0055'
            : isHovered
            ? '2px solid #00F0FF'
            : '1.5px solid rgba(0, 240, 255, 0.85)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          backgroundColor: isMouseDown
            ? 'rgba(255, 0, 85, 0.2)'
            : isHovered
            ? 'rgba(0, 240, 255, 0.15)'
            : 'rgba(157, 78, 221, 0.05)',
          boxShadow: isMouseDown
            ? '0 0 30px rgba(255, 0, 85, 0.8), inset 0 0 15px rgba(255, 0, 85, 0.4)'
            : isHovered
            ? '0 0 30px rgba(0, 240, 255, 0.7), 0 0 15px rgba(157, 78, 221, 0.5), inset 0 0 15px rgba(0, 240, 255, 0.25)'
            : '0 0 14px rgba(0, 240, 255, 0.35)',
          transition: 'width 0.12s ease-out, height 0.12s ease-out, border-color 0.12s ease-out, background-color 0.12s ease-out, box-shadow 0.12s ease-out',
          willChange: 'transform',
        }}
      />
    </>
  );
}
