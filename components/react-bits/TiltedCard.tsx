"use client"

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

interface TiltedCardProps {
    imageSrc: string;
    altText?: string;
    captionText?: string;
    containerHeight?: string;
    containerWidth?: string;
    imageHeight?: string;
    imageWidth?: string;
    scaleOnHover?: number;
    rotateAmplitude?: number;
    showMobileWarning?: boolean;
    showTooltip?: boolean;
    overlayContent?: React.ReactNode;
    displayOverlayContent?: boolean;
}

export function TiltedCard({
    imageSrc,
    altText = 'Tilted card image',
    captionText = '',
    containerHeight = '300px',
    containerWidth = '100%',
    imageHeight = '300px',
    imageWidth = '300px',
    scaleOnHover = 1.05,
    rotateAmplitude = 12,
    showMobileWarning = false,
    showTooltip = true,
    overlayContent = null,
    displayOverlayContent = false
}: TiltedCardProps) {
    const ref = useRef<HTMLElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);
    const rotateFigcaption = useSpring(0, springValues);

    function handleMouse(e: React.MouseEvent<HTMLElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const inputX = (offsetX / rect.width) * 2 - 1;
        const inputY = (offsetY / rect.height) * 2 - 1;

        rotateX.set(inputY * -rotateAmplitude);
        rotateY.set(inputX * rotateAmplitude);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }

    return (
        <div
            className="relative w-full h-full flex flex-col items-center justify-center"
            style={{
                height: containerHeight,
                width: containerWidth,
                perspective: "800px"
            }}
        >
            <figure
                ref={ref}
                className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
                onMouseMove={handleMouse}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {showMobileWarning && (
                    <div className="absolute top-4 text-center text-sm hidden sm:block">
                        This effect is not optimized for mobile. Check on desktop.
                    </div>
                )}

                <motion.div
                    className="relative"
                    style={{
                        width: imageWidth,
                        height: imageHeight,
                        rotateX,
                        rotateY,
                        scale,
                        transformStyle: "preserve-3d"
                    }}
                >
                    <motion.img
                        src={imageSrc}
                        alt={altText}
                        className="block object-cover rounded-sm shadow-2xl border border-[#27272a]"
                        style={{
                            width: imageWidth,
                            height: imageHeight
                        }}
                    />

                    {displayOverlayContent && overlayContent && (
                        <motion.div className="absolute top-0 left-0 w-full h-full z-10 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-sm" style={{ transform: "translateZ(30px)" }}>
                            {overlayContent}
                        </motion.div>
                    )}
                </motion.div>

                {showTooltip && (
                    <motion.figcaption
                        className="absolute px-4 py-2 bg-white text-black text-sm font-bold tracking-wider rounded-sm z-20 pointer-events-none whitespace-nowrap shadow-xl uppercase border-b-2 border-[#d97706]"
                        style={{
                            x,
                            y,
                            opacity,
                            rotate: rotateFigcaption,
                            top: 0,
                            left: 0,
                            transform: "translate(-50%, -150%)"
                        }}
                    >
                        {captionText}
                    </motion.figcaption>
                )}
            </figure>
        </div>
    );
}
