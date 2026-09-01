/**
 * TIYATROTIST — CustomCursor
 * Özel nokta/halka imleç bileşeni.
 * (Custom dot/ring cursor component)
 *
 * - Masaüstünde tarayıcı imlecini gizler.
 * - Fareyi takip eden küçük beyaz nokta çizer.
 * - Etkileşimli elemanların üzerinde halkaya dönüşür.
 * - Dokunmatik cihazlarda tamamen devre dışı kalır.
 */

'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const subscribeToInputChanges = () => () => undefined;

function getIsTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isTouch = useSyncExternalStore(
    subscribeToInputChanges,
    getIsTouchDevice,
    () => false,
  );
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Dokunmatik cihaz tespiti
  useEffect(() => {
    if (isTouch) {
      console.debug('[CustomCursor] Touch device detected — cursor disabled');
      return;
    }

    // Masaüstünde tarayıcı imlecini gizle
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    console.debug('[CustomCursor] Desktop mode — custom cursor enabled');

    return () => {
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
    };
  }, [isTouch]);

  // Fare takibi ve animasyon döngüsü
  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Etkileşimli elemanları izle
    const isInteractive = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      if (
        tag === 'A' ||
        tag === 'BUTTON' ||
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        el.getAttribute('role') === 'button' ||
        el.dataset?.cursor === 'expand' ||
        el.closest('a') ||
        el.closest('button') ||
        el.closest('[role="button"]') ||
        el.closest('[data-cursor="expand"]')
      ) {
        return true;
      }
      return false;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isInteractive(target)) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!isInteractive(e.relatedTarget as HTMLElement)) {
        setIsHovering(false);
      }
    };

    // Yumuşak takip animasyonu (lerp)
    const animate = () => {
      const lerp = 0.15;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, isVisible]);

  // Dokunmatik cihazda render etme
  if (isTouch) return null;

  return (
    <>
      {/* İç nokta (Inner dot) */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? '6px' : '8px',
          height: isHovering ? '6px' : '8px',
        }}
      />
      {/* Dış halka (Outer ring) */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          opacity: isVisible ? (isHovering ? 0.8 : 0) : 0,
          width: isHovering ? '40px' : '20px',
          height: isHovering ? '40px' : '20px',
        }}
      />
    </>
  );
}
