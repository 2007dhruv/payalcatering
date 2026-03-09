"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getMenuCategoriesAction, deleteMenuCategoryAction, saveMenuCategoryAction } from "@/app/actions"

type MenuCategory = any

export default function AdminMenuCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<MenuCategory | null>(null)
  const [formState, setFormState] = useState({
    name_en: "",
    name_gu: "",
    description_en: "",
    description_gu: "",
    image_url: "",
    sort_order: 0,
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    const { data } = await getMenuCategoriesAction()
    if (!data) {
      console.error("Error fetching categories")
    } else {
      setCategories(data)
    }
    setIsLoading(false)
  }

  const handleNewCategory = () => {
    setCurrentCategory(null)
    setFormState({
      name_en: "",
      name_gu: "",
      description_en: "",
      description_gu: "",
      image_url: "",
      sort_order: categories.length > 0 ? Math.max(...categories.map((c) => c.sort_order || 0)) + 1 : 1,
      is_active: true,
    })
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: MenuCategory) => {
    setCurrentCategory(category)
    setFormState({
      name_en: category.name_en,
      name_gu: category.name_gu,
      description_en: category.description_en || "",
      description_gu: category.description_gu || "",
      image_url: category.image_url || "",
      sort_order: category.sort_order || 0,
      is_active: category.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? This will also delete all associated menu items.")) {
      const { error } = await deleteMenuCategoryAction(id)
      if (error) {
        console.error("Error deleting category:", error)
        alert("Error deleting category: " + error)
      } else {
        fetchCategories()
      }
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name_en: formState.name_en,
      name_gu: formState.name_gu,
      description_en: formState.description_en || null,
      description_gu: formState.description_gu || null,
      image_url: formState.image_url || null,
      sort_order: formState.sort_order,
      is_active: formState.is_active,
    }

    const { error } = await saveMenuCategoryAction(payload, currentCategory?.id)

    if (error) {
      console.error("Error saving category:", error)
      alert("Error saving category: " + error.message)
    } else {
      setIsDialogOpen(false)
      fetchCategories()
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
                <h1 className="text-2xl font-serif font-bold text-white">Manage Menu Categories</h1>
                <p className="text-sm text-gray-400">Add, edit, and delete food categories</p>
              </div>
            </div>
            <Button onClick={handleNewCategory} className="bg-[#d97706] hover:bg-[#b45309] text-black">
              <Plus className="mr-2 h-4 w-4" />
              New Category
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
            ) : categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories found. Click "New Category" to add one.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#27272a] hover:bg-[#27272a]/30">
                    <TableHead className="text-gray-400">Name (EN)</TableHead>
                    <TableHead className="text-gray-400">Name (GU)</TableHead>
                    <TableHead className="text-gray-400">Order</TableHead>
                    <TableHead className="text-gray-400">Active</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="border-[#27272a] hover:bg-[#27272a]/30">
                      <TableCell className="font-medium text-white">{category.name_en}</TableCell>
                      <TableCell className="text-gray-300">{category.name_gu}</TableCell>
                      <TableCell className="text-gray-300">{category.sort_order}</TableCell>
                      <TableCell>
                        {category.is_active ? (
                          <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/30">Yes</Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)} className="text-gray-400 hover:text-white hover:bg-[#27272a]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/50">
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
            <DialogTitle className="text-xl font-serif">{currentCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
                Image URL
              </Label>
              <Input
                id="image_url"
                name="image_url"
                value={formState.image_url}
                onChange={handleFormChange}
                className="col-span-3 bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                placeholder="e.g., /images/category.jpg"
              />
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
              <Label htmlFor="is_active" className="text-right text-gray-300">
                Is Active
              </Label>
              <Checkbox
                id="is_active"
                name="is_active"
                checked={formState.is_active}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, is_active: !!checked }))}
                className="col-span-3 border-[#d97706] data-[state=checked]:bg-[#d97706] data-[state=checked]:text-black"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="bg-[#0f0f11] border-[#27272a] text-gray-300">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#d97706] hover:bg-[#b45309] text-black">
                {isSubmitting ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
