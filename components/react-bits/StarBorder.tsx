"use client"

import { cn } from "@/lib/utils"

interface StarBorderProps {
    children: React.ReactNode
    className?: string
    containerClassName?: string
    color?: string
    speed?: string
}

export function StarBorder({
    children,
    className,
    containerClassName,
    color = "#d97706",
    speed = "4s"
}: StarBorderProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-sm p-[1px] group", containerClassName)}>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes rotateStar {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}} />

            {/* Animated rotating gradient */}
            <div
                className="absolute z-0 w-[200%] h-[200%] top-1/2 left-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                    backgroundImage: `conic-gradient(from 0deg, transparent 0 320deg, ${color} 360deg)`,
                    animation: `rotateStar ${speed} linear infinite`,
                }}
            />

            {/* Dark background base layer underneath content */}
            <div className="absolute inset-[1px] bg-[#18181b] rounded-sm z-0 pointer-events-none" />

            {/* Main content */}
            <div className={cn("relative z-10 h-full w-full rounded-sm bg-[#18181b]", className)}>
                {children}
            </div>
        </div>
    )
}
