import { type NextRequest, NextResponse } from "next/server"
import { savePhotoAction } from "@/app/actions"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const names = formData.getAll("names") as string[]
    const categories = formData.getAll("categories") as string[]
    const descriptions = formData.getAll("descriptions") as string[]

    const uploadResults = []

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      console.error("Error creating upload directory:", e)
    }

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

      const filePath = path.join(uploadDir, filename)
      const fileUrl = `/uploads/${filename}`

      // Upload locally
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes) as any
      await writeFile(filePath, buffer)

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
