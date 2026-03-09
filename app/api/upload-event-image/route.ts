import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const title = formData.get("title") as string

        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
        }

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            console.error("Error creating upload directory:", e)
        }

        // Generate unique filename
        const timestamp = Date.now()
        const extension = file.name.split(".").pop()
        const safeTitle = (title || 'event').replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

        const filename = `${safeTitle}-${timestamp}.${extension}`
        const filePath = path.join(uploadDir, filename)
        const fileUrl = `/uploads/events/${filename}`

        // Upload locally
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes) as any
        await writeFile(filePath, buffer)

        return NextResponse.json({
            success: true,
            message: "Successfully uploaded event memory",
            url: fileUrl,
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ success: false, message: "Failed to upload photo" }, { status: 500 })
    }
}
