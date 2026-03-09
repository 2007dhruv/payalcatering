"use client"

import type React from "react"
import { AdminNotifications } from "@/components/admin/admin-notifications"
import { Toaster } from "sonner"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <AdminNotifications />
            <Toaster position="top-right" theme="dark" richColors />
            {children}
        </>
    )
}
