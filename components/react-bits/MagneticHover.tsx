"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticHoverProps {
    children: React.ReactNode;
    className?: string;
    magneticPull?: number; // Adjusts how strongly it pulls towards the mouse (0 to 1)
}

export function MagneticHover({
    children,
    className = "",
    magneticPull = 0.3,
}: MagneticHoverProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * magneticPull, y: middleY * magneticPull });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
