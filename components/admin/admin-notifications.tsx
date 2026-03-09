"use client"

import { useEffect, useState, useRef } from "react"
import { getInquiries } from "@/app/actions"
import { toast } from "sonner"
import { Bell } from "lucide-react"

export function AdminNotifications() {
    const [lastCheckedId, setLastCheckedId] = useState<string | null>(null)
    const isFirstRun = useRef(true)

    useEffect(() => {
        // Initial fetch to establish the "baseline" (don't notify for old inquiries)
        const init = async () => {
            try {
                const { data } = await getInquiries("", "", 1)
                if (data && data.length > 0) {
                    setLastCheckedId(data[0].id)
                }
            } catch (e) {
                console.error("Failed to initialize notifications", e)
            }
        }

        init()

        // Polling interval (every 15 seconds)
        const interval = setInterval(async () => {
            try {
                const { data } = await getInquiries("", "", 1)

                if (data && data.length > 0) {
                    const latestInquiry = data[0]

                    if (latestInquiry.id !== lastCheckedId) {
                        // New inquiry found!
                        if (!isFirstRun.current) {
                            notify(latestInquiry)
                            window.dispatchEvent(new CustomEvent("new-inquiry", { detail: latestInquiry }))
                        }
                        setLastCheckedId(latestInquiry.id)
                    }
                }
            } catch (e) {
                console.error("Polling error", e)
            } finally {
                isFirstRun.current = false
            }
        }, 15000)

        return () => clearInterval(interval)
    }, [lastCheckedId])

    const notify = (inquiry: any) => {
        const typeLabel = inquiry.type === "custom_menu" ? "Custom Menu Request" : "General Inquiry"

        toast.success(`New ${typeLabel}`, {
            description: `From: ${inquiry.name} (${inquiry.email})`,
            duration: Infinity, // Persistent until dismissed
            icon: <Bell className="h-4 w-4" />,
            action: {
                label: "View",
                onClick: () => window.location.href = "/admin/inquiries"
            },
            cancel: {
                label: "Done",
                onClick: () => { } // Dismisses automatically when clicked
            }
        })

        // Try to play a notification sound
        try {
            const audio = new Audio("/notification.mp3")
            audio.play().catch(() => {
                // Autoplay might be blocked, ignore
            })
        } catch (e) {
            // Ignore audio errors
        }
    }

    return null // This component doesn't render anything visible
}
