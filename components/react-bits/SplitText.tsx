"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SplitTextProps {
    text: string
    className?: string
    delay?: number
    duration?: number
    stagger?: number
}

export function SplitText({ text, className, delay = 0, duration = 0.5, stagger = 0.05 }: SplitTextProps) {
    const words = text.split(" ")

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    }

    const wordVariants = {
        hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration,
                ease: [0.2, 0.65, 0.3, 0.9] as any,
            },
        },
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={cn("flex flex-wrap justify-center", className)}
        >
            {words.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="mr-[0.3em] inline-block">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}
