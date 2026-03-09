"use client"

import { cn } from "@/lib/utils"
import React from 'react'

export function ShinyText({ text, className, speed = 3 }: { text: string, className?: string, speed?: number }) {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shine {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}} />
            <span
                className={cn("inline-block relative bg-clip-text tracking-widest uppercase font-semibold", className)}
                style={{
                    backgroundImage: "linear-gradient(120deg, rgba(217,119,6,0.6) 0%, rgba(251,191,36,1) 50%, rgba(217,119,6,0.6) 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: `shine ${speed}s infinite linear`,
                }}
            >
                {text}
            </span>
        </>
    )
}
