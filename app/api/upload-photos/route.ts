import { type NextRequest, NextResponse } from "next/server"
import { savePhotoAction } from "@/app/actions"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { db } from "@/lib/db"
export const maxDuration = 60; // Increase max timeout for Vercel

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const names = formData.getAll("names") as string[]
    const categories = formData.getAll("categories") as string[]
    const descriptions = formData.getAll("descriptions") as string[]

    // Auto-migrate column size for live server (bypasses cPanel manual fix)
    await db.execute("ALTER TABLE photos MODIFY file_url LONGTEXT").catch(e => console.error("Migration skipped:", e))

    const uploadResults = []
    let lastError = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const name = names[i] || file.name
      const category = categories[i]
      const description = descriptions[i] || ""

      if (!file || !category) {
        continue
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split(".").pop()
      const filename = `${category}-${timestamp}-${name.replace(/[^a-zA-Z0-9]/g, "-")}.${extension}`

      // Convert to Base64 String for Database Storage
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64String = buffer.toString('base64')
      const fileUrl = `data:${file.type};base64,${base64String}`

      // Save to database
      const { data, error } = await savePhotoAction({
        filename: filename,
        original_name: file.name,
        category: category,
        description: description,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
      })

      if (error) {
        lastError = error;
        console.error("Database error:", error)
        continue
      }

      uploadResults.push({
        id: data.id,
        filename: filename,
        url: fileUrl,
        category: category,
      })
    }

    if (uploadResults.length === 0 && files.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Upload failed. Database error: ${lastError || "No files were processed"}`
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadResults.length} photos`,
      photos: uploadResults,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, message: "Failed to upload photos" }, { status: 500 })
  }
}
