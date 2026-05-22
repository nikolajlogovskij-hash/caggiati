"use client";

import { useEffect, useRef } from "react";

export function SmoothCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;
      follower.style.transform = `translate3d(${followerX - 15}px, ${followerY - 15}px, 0)`;
      requestAnimationFrame(animate);
    };

    // Hide cursor on touch devices
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) {
      cursor.style.display = "none";
      follower.style.display = "none";
      return;
    }

    document.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-gold transition-transform duration-75 ease-out mix-blend-difference"
      />
      {/* Outer ring */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-[30px] w-[30px] rounded-full border border-gold/50 transition-transform duration-0 ease-out mix-blend-difference"
      />
    </>
  );
}