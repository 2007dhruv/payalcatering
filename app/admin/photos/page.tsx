"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X, Save, ArrowLeft, FolderOpen, ImageIcon, Eye, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { getPhotosAction, deletePhotoAction } from "@/app/actions"

interface PhotoUpload {
  file: File
  preview: string
  name: string
  category: string
  description: string
}

interface StoredPhoto {
  id: string
  filename: string
  original_name: string
  category: string
  description: string | null
  file_url: string
  file_size: number | null
  created_at: string
}

export default function AdminPhotosPage() {
  const [uploads, setUploads] = useState<PhotoUpload[]>([])
  const [storedPhotos, setStoredPhotos] = useState<StoredPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: "cold-appetizers", label: "Cold Appetizers / ઠંડા એપેટાઇઝર" },
    { value: "hot-appetizers", label: "Hot Appetizers / ગરમ એપેટાઇઝર" },
    { value: "special-chaat", label: "Special Chaat / સ્પેશિયલ ચાટ" },
    { value: "welcome-biting", label: "Welcome Biting / વેલકમ બાઇટિંગ" },
    { value: "cocktail-chaat", label: "Cocktail Chaat / કોકટેલ ચાટ" },
    { value: "cold-sweets", label: "Cold Sweets / ઠંડી મિઠાઈ" },
    { value: "hot-sweets", label: "Hot Sweets / ગરમ મિઠાઈ" },
    { value: "ice-cream", label: "Ice Cream / આઈસ્ક્રીમ" },
    { value: "farsan", label: "Farsan / ફરસાણ" },
    { value: "main-course", label: "Main Course / મુખ્ય કોર્સ" },
    { value: "rice", label: "Rice / ભાત" },
    { value: "south-indian", label: "South Indian / સાઉથ ઇન્ડિયન" },
    { value: "chinese", label: "Chinese / ચાઇનીઝ" },
    { value: "sweets", label: "Sweets / મિઠાઈ" },
    { value: "beverages", label: "Beverages / પીણાં" },
    { value: "soups", label: "Soups / સૂપ" },
    { value: "other", label: "Other / અન્ય" },
  ]

  useEffect(() => {
    fetchStoredPhotos()
  }, [])

  const fetchStoredPhotos = async () => {
    setIsLoading(true)
    const { data, error } = await getPhotosAction()

    if (error) {
      console.error("Error fetching photos:", error)
    } else {
      setStoredPhotos(data || [])
    }
    setIsLoading(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          const newUpload: PhotoUpload = {
            file,
            preview,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            category: "",
            description: "",
          }
          setUploads((prev) => [...prev, newUpload])
        }
        reader.readAsDataURL(file)
      }
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          const newUpload: PhotoUpload = {
            file,
            preview,
            name: file.name.replace(/\.[^/.]+$/, ""),
            category: "",
            description: "",
          }
          setUploads((prev) => [...prev, newUpload])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const updateUpload = (index: number, field: keyof PhotoUpload, value: string) => {
    setUploads((prev) => prev.map((upload, i) => (i === index ? { ...upload, [field]: value } : upload)))
  }

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadAll = async () => {
    setIsUploading(true)

    try {
      const formData = new FormData()

      uploads.forEach((upload) => {
        formData.append("files", upload.file)
        formData.append("names", upload.name)
        formData.append("categories", upload.category)
        formData.append("descriptions", upload.description)
      })

      const response = await fetch("/api/upload-photos", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        alert(`Successfully uploaded ${result.photos.length} photos!`)
        setUploads([])
        fetchStoredPhotos() // Refresh the stored photos list
      } else {
        alert("Error uploading photos: " + result.message)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error uploading photos. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return

    const { error } = await deletePhotoAction(photoId)

    if (error) {
      alert("Error deleting photo: " + error)
    } else {
      fetchStoredPhotos()
    }
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert("Image URL copied to clipboard!")
  }

  const filteredStoredPhotos =
    selectedCategory === "all" ? storedPhotos : storedPhotos.filter((photo) => photo.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200">
      {/* Header */}
      <header className="bg-[#18181b] shadow-sm border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-[#27272a]">
                <Link href="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="ml-4">
                <h1 className="text-2xl font-serif font-bold text-white">Photo Management</h1>
                <p className="text-sm text-gray-400">Upload and organize your food photos</p>
              </div>
            </div>
            {uploads.length > 0 && (
              <Button
                onClick={handleUploadAll}
                disabled={isUploading || uploads.some((u) => !u.category)}
                className="bg-[#d97706] hover:bg-[#b45309] text-black"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Upload All ({uploads.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-[#18181b] p-1 border border-[#27272a] rounded-lg">
            <TabsTrigger value="upload" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#d97706] text-gray-400">Upload New Photos</TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#d97706] text-gray-400">Manage Existing Photos ({storedPhotos.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Area */}
            <Card className="bg-[#18181b] border-[#27272a]">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Upload className="mr-2 h-5 w-5 text-[#d97706]" />
                  Upload Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-full border-dashed border-[#27272a] bg-[#0f0f11] rounded-lg p-8 text-center hover:border-[#d97706] hover:bg-[#d97706]/5 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FolderOpen className="mx-auto h-12 w-12 text-[#d97706] mb-4" />
                  <p className="text-lg font-medium text-gray-200 mb-2">
                    Drop your food photos here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, JPEG, PNG files. You can upload multiple photos at once.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Queue */}
            {uploads.length > 0 && (
              <Card className="bg-[#18181b] border-[#27272a]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span className="flex items-center">
                      <ImageIcon className="mr-2 h-5 w-5 text-[#d97706]" />
                      Photos Ready for Upload ({uploads.length})
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setUploads([])} className="bg-[#0f0f11] border-[#27272a] text-gray-300 hover:text-white hover:border-[#d97706]">
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploads.map((upload, index) => (
                      <Card key={index} className="overflow-hidden bg-[#0f0f11] border-[#27272a]">
                        <div className="relative h-48 border-b border-[#27272a]">
                          <Image
                            src={upload.preview || "/placeholder.svg"}
                            alt={upload.name}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 bg-red-500/80 hover:bg-red-500"
                            onClick={() => removeUpload(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <Label htmlFor={`name-${index}`} className="text-gray-300">Photo Name</Label>
                            <Input
                              id={`name-${index}`}
                              value={upload.name}
                              onChange={(e) => updateUpload(index, "name", e.target.value)}
                              placeholder="Enter photo name"
                              className="bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`category-${index}`} className="text-gray-300">Category *</Label>
                            <Select
                              value={upload.category}
                              onValueChange={(value) => updateUpload(index, "category", value)}
                            >
                              <SelectTrigger className="bg-[#18181b] border-[#27272a] focus:ring-[#d97706]">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#18181b] border-[#27272a]">
                                {categories.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value} className="focus:bg-[#27272a] focus:text-white">
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`description-${index}`} className="text-gray-300">Description (Optional)</Label>
                            <Textarea
                              id={`description-${index}`}
                              value={upload.description}
                              onChange={(e) => updateUpload(index, "description", e.target.value)}
                              placeholder="Brief description of the dish"
                              rows={2}
                              className="bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                            />
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <Badge variant={upload.category ? "default" : "destructive"} className={upload.category ? "bg-[#d97706] hover:bg-[#b45309] text-black" : ""}>
                              {upload.category ? "Ready" : "Category Required"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Filter */}
            <Card className="bg-[#18181b] border-[#27272a]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Label className="text-gray-300">Filter by Category:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-64 bg-[#0f0f11] border-[#27272a] focus:ring-[#d97706]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181b] border-[#27272a]">
                      <SelectItem value="all" className="focus:bg-[#27272a] focus:text-white">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="focus:bg-[#27272a] focus:text-white">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Stored Photos */}
            <Card className="bg-[#18181b] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-white">Your Uploaded Photos</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97706]"></div>
                  </div>
                ) : filteredStoredPhotos.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {selectedCategory === "all" ? "No photos uploaded yet." : "No photos in this category."}
                  </p>
                ) : (
                  <div className="overflow-x-auto border border-[#27272a] rounded-lg">
                    <Table>
                      <TableHeader className="bg-[#0f0f11]">
                        <TableRow className="border-[#27272a]">
                          <TableHead className="text-gray-400">Preview</TableHead>
                          <TableHead className="text-gray-400">Name</TableHead>
                          <TableHead className="text-gray-400">Category</TableHead>
                          <TableHead className="text-gray-400">Size</TableHead>
                          <TableHead className="text-gray-400">Uploaded</TableHead>
                          <TableHead className="text-gray-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStoredPhotos.map((photo) => (
                          <TableRow key={photo.id} className="border-[#27272a] hover:bg-[#27272a]/30">
                            <TableCell>
                              <Image
                                src={photo.file_url || "/placeholder.svg"}
                                alt={photo.original_name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover border border-[#27272a]"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-white">{photo.original_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-[#27272a] text-[#d97706] bg-[#d97706]/10">
                                {categories.find((c) => c.value === photo.category)?.label.split(" / ")[0] ||
                                  photo.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {photo.file_size ? (photo.file_size / 1024 / 1024).toFixed(1) + " MB" : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400">{new Date(photo.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.open(photo.file_url, "_blank")}
                                  title="View full size"
                                  className="text-gray-400 hover:text-white hover:bg-[#27272a]"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyImageUrl(photo.file_url)}
                                  title="Copy URL"
                                  className="text-gray-400 hover:text-white hover:bg-[#27272a]"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  title="Delete photo"
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How to Use Instructions */}
        <Card className="mt-8 bg-[#18181b] border-[#27272a]">
          <CardHeader>
            <CardTitle className="text-white">📖 How to Use Your Uploaded Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-200">🍽️ In Menu Items</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                  <li>
                    Go to <strong className="text-gray-300">Admin → Menu Items</strong>
                  </li>
                  <li>Edit any menu item</li>
                  <li>In the "Image URL" field, copy the URL from the "Manage Photos" tab</li>
                  <li>Save the menu item</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-200">🔗 Getting Photo URLs</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                  <li>Go to "Manage Existing Photos" tab</li>
                  <li>
                    Click the <Copy className="h-3 w-3 inline text-[#d97706]" /> copy button next to any photo
                  </li>
                  <li>The URL is copied to your clipboard</li>
                  <li>Paste it in menu items or anywhere you need</li>
                </ul>
              </div>
            </div>
            <div className="bg-[#0f0f11] p-4 rounded-lg border border-[#27272a]">
              <h4 className="font-semibold text-[#d97706] mb-2">💡 Pro Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                <li>Photos are automatically organized by category</li>
                <li>All photos are stored securely and load fast</li>
                <li>You can delete photos you no longer need</li>
                <li>Use descriptive names for easy searching</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
