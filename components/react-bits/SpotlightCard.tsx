"use client"

import { useRef, ReactNode, MouseEvent } from 'react';

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
}

export function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(217, 119, 6, 0.15)' // Subdued luxury gold by default
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty('--mouse-x', `${x}px`);
        divRef.current.style.setProperty('--mouse-y', `${y}px`);
        divRef.current.style.setProperty('--spotlight-color', spotlightColor);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        .card-spotlight {
          position: relative;
          overflow: hidden;
          --mouse-x: 50%;
          --mouse-y: 50%;
          --spotlight-color: rgba(255, 255, 255, 0.05);
        }

        .card-spotlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%);
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
          z-index: 0;
        }

        .card-spotlight:hover::before {
          opacity: 1;
        }

        /* Ensure card contents stay above the spotlight gradient */
        .card-spotlight > * {
          position: relative;
          z-index: 10;
        }
      `}} />
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                className={`card-spotlight ${className}`}
            >
                {children}
            </div>
        </>
    );
}
