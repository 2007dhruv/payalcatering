"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getMenuItemsAndCategoriesAction, deleteMenuItemAction, saveMenuItemAction } from "@/app/actions"

type MenuItem = any
type MenuCategory = any

export default function AdminMenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null)
  const [formState, setFormState] = useState({
    category_id: "",
    name_en: "",
    name_gu: "",
    description_en: "",
    description_gu: "",
    image_url: "",
    is_vegetarian: true,
    is_available: true,
    sort_order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.HTMLImageElement();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 1200;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { itemsData, categoriesData } = await getMenuItemsAndCategoriesAction()
      if (itemsData) setMenuItems(itemsData)
      if (categoriesData) setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setIsLoading(false)
  }

  const handleNewMenuItem = () => {
    setCurrentMenuItem(null)
    setFormState({
      category_id: categories.length > 0 ? categories[0].id : "",
      name_en: "",
      name_gu: "",
      description_en: "",
      description_gu: "",
      image_url: "",
      is_vegetarian: true,
      is_available: true,
      sort_order: menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.sort_order || 0)) + 1 : 1,
    })
    setIsDialogOpen(true)
  }

  const handleEditMenuItem = (item: MenuItem) => {
    setCurrentMenuItem(item)
    setFormState({
      category_id: item.category_id || "",
      name_en: item.name_en,
      name_gu: item.name_gu,
      description_en: item.description_en || "",
      description_gu: item.description_gu || "",
      image_url: item.image_url || "",
      is_vegetarian: Boolean(item.is_vegetarian),
      is_available: Boolean(item.is_available),
      sort_order: item.sort_order || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      const { error } = await deleteMenuItemAction(id)
      if (error) {
        console.error("Error deleting menu item:", error)
        alert("Error deleting menu item: " + error)
      } else {
        fetchData()
      }
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      category_id: formState.category_id || null,
      name_en: formState.name_en,
      name_gu: formState.name_gu,
      description_en: formState.description_en || null,
      description_gu: formState.description_gu || null,
      image_url: (formState.image_url || "").trim() || null,
      is_vegetarian: formState.is_vegetarian,
      is_available: formState.is_available,
      sort_order: formState.sort_order,
    }

    const { error } = await saveMenuItemAction(payload, currentMenuItem ? currentMenuItem.id : undefined)

    if (error) {
      console.error("Error saving menu item:", error)
      alert("Error saving menu item: " + error)
    } else {
      setIsDialogOpen(false)
      fetchData()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200">
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
                <h1 className="text-2xl font-serif font-bold text-white">Manage Menu Items</h1>
                <p className="text-sm text-gray-400">Add, edit, and delete individual food items</p>
              </div>
            </div>
            <Button onClick={handleNewMenuItem} className="bg-[#d97706] hover:bg-[#b45309] text-black">
              <Plus className="mr-2 h-4 w-4" />
              New Menu Item
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-[#18181b] border-[#27272a]">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#d97706]"></div>
              </div>
            ) : menuItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No menu items found. Click "New Menu Item" to add one.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#27272a] hover:bg-[#27272a]/30">
                    <TableHead className="text-gray-400">Image</TableHead>
                    <TableHead className="text-gray-400">Name (EN)</TableHead>
                    <TableHead className="text-gray-400">Category</TableHead>
                    <TableHead className="text-gray-400">Veg</TableHead>
                    <TableHead className="text-gray-400">Available</TableHead>
                    <TableHead className="text-gray-400">Order</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id} className="border-[#27272a] hover:bg-[#27272a]/30">
                      <TableCell>
                        <Image
                          src={(item.image_url || "").trim() || "/placeholder.svg?height=50&width=50"}
                          alt={item.name_en}
                          width={50}
                          height={50}
                          className="rounded-md object-cover border border-[#27272a]"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">{item.name_en}</TableCell>
                      <TableCell className="text-gray-300">{item.menu_categories?.name_en || "N/A"}</TableCell>
                      <TableCell>
                        {item.is_vegetarian ? (
                          <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/30">Yes</Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50 hover:bg-gray-500/30">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.is_available ? (
                          <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/30">Yes</Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">{item.sort_order}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMenuItem(item)} className="text-gray-400 hover:text-white hover:bg-[#27272a]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMenuItem(item.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#18181b] border-[#27272a] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">{currentMenuItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details for the menu item including name, description, and image.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category_id" className="text-right text-gray-300">
                Category
              </Label>
              <Select
                name="category_id"
                value={formState.category_id}
                onValueChange={(value) => handleSelectChange("category_id", value)}
                required
              >
                <SelectTrigger className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706] text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="focus:bg-[#27272a] focus:text-white">
                      {category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_en" className="text-right text-gray-300">
                Name (EN)
              </Label>
              <Input
                id="name_en"
                name="name_en"
                value={formState.name_en}
                onChange={handleFormChange}
                required
                className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_gu" className="text-right text-gray-300">
                Name (GU)
              </Label>
              <Input
                id="name_gu"
                name="name_gu"
                value={formState.name_gu}
                onChange={handleFormChange}
                required
                className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description_en" className="text-right text-gray-300">
                Description (EN)
              </Label>
              <Textarea
                id="description_en"
                name="description_en"
                value={formState.description_en}
                onChange={handleFormChange}
                className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description_gu" className="text-right text-gray-300">
                Description (GU)
              </Label>
              <Textarea
                id="description_gu"
                name="description_gu"
                value={formState.description_gu}
                onChange={handleFormChange}
                className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right text-gray-300">
                Image
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formState.image_url}
                    onChange={handleFormChange}
                    className="flex-1 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                    placeholder="URL or upload an image..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#27272a] text-gray-200 border-[#404040] hover:bg-[#323232]"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={isSubmitting}
                  >
                    Browse
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const rawFile = e.target.files?.[0]
                      if (!rawFile) return

                      setIsSubmitting(true)
                      try {
                        const file = await compressImage(rawFile)
                        const formData = new FormData()
                        formData.append("files", file)
                        formData.append("names", formState.name_en || file.name)
                        formData.append("categories", "menu-items")
                        formData.append("descriptions", `Image for ${formState.name_en}`)

                        const response = await fetch("/api/upload-photos", {
                          method: "POST",
                          body: formData,
                        })

                        const result = await response.json()
                        if (result.success && result.photos?.length > 0) {
                          const uploadedUrl = result.photos[0].url
                          setFormState(prev => ({ ...prev, image_url: uploadedUrl }))
                        } else {
                          alert("Upload failed: " + (result.message || "Unknown error"))
                        }
                      } catch (error) {
                        console.error("Upload error:", error)
                        alert("Error uploading image")
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                  />
                </div>
                {formState.image_url && (
                  <div className="relative mt-2 h-20 w-20 rounded-md overflow-hidden border border-[#27272a]">
                    <Image
                      src={formState.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sort_order" className="text-right text-gray-300">
                Sort Order
              </Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                value={formState.sort_order}
                onChange={handleFormChange}
                required
                className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_vegetarian" className="text-right text-gray-300">
                Is Vegetarian
              </Label>
              <Checkbox
                id="is_vegetarian"
                name="is_vegetarian"
                checked={formState.is_vegetarian}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, is_vegetarian: !!checked }))}
                className="col-span-3 border-[#d97706] data-[state=checked]:bg-[#d97706] data-[state=checked]:text-black"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_available" className="text-right text-gray-300">
                Is Available
              </Label>
              <Checkbox
                id="is_available"
                name="is_available"
                checked={formState.is_available}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, is_available: !!checked }))}
                className="col-span-3 border-[#d97706] data-[state=checked]:bg-[#d97706] data-[state=checked]:text-black"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="bg-[#0f0f11] border-[#27272a] text-gray-300">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#d97706] hover:bg-[#b45309] text-black">
                {isSubmitting ? "Saving..." : "Save Menu Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
