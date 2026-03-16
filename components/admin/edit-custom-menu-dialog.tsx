"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Leaf, Search, X, ChevronDown } from "lucide-react"
import { getMenuItemsAndCategoriesAction } from "@/app/actions"
import { useLanguage } from "@/contexts/language-context"

type MenuItem = any
type MenuCategory = any

interface EditCustomMenuDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  inquiry: any | null
  onSave: (inquiryId: string, newSelectedItems: any[]) => Promise<void>
}

export default function EditCustomMenuDialog({ isOpen, onOpenChange, inquiry, onSave }: EditCustomMenuDialogProps) {
  const { language, t } = useLanguage()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showVegOnly, setShowVegOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMenu, setSelectedMenu] = useState<MenuItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchMenuData()
      if (inquiry?.selected_menu_items) {
        // Ensure selected_menu_items is an array of objects with id, name_en, name_gu
        const initialSelected = (inquiry.selected_menu_items as any[]).map((item) => ({
          id: item.id,
          name_en: item.name_en,
          name_gu: item.name_gu,
          time_slot: item.time_slot || 'general'
        })) as MenuItem[]
        setSelectedMenu(initialSelected)
      } else {
        setSelectedMenu([])
      }
    }
  }, [isOpen, inquiry])

  useEffect(() => {
    filterItems()
  }, [menuItems, selectedCategory, searchTerm, showVegOnly, language])

  const fetchMenuData = async () => {
    setIsLoading(true)

    const { itemsData, categoriesData } = await getMenuItemsAndCategoriesAction()

    if (categoriesData) setCategories(categoriesData)
    // To match previous filtering
    if (itemsData) setMenuItems(itemsData.filter((i: any) => i.is_available))
    setIsLoading(false)
  }

  const filterItems = () => {
    let filtered = menuItems

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category_id === selectedCategory)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          (language === "gu" ? item.name_gu : item.name_en).toLowerCase().includes(searchLower) ||
          (language === "gu" ? item.description_gu : item.description_en)?.toLowerCase().includes(searchLower),
      )
    }

    if (showVegOnly) {
      filtered = filtered.filter((item) => item.is_vegetarian)
    }

    setFilteredItems(filtered)
  }

  const handleAddItem = (item: MenuItem) => {
    setSelectedMenu((prev) => [...prev, { ...item, time_slot: 'general' }])
  }

  const handleRemoveItem = (index: number) => {
    setSelectedMenu((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!inquiry) return
    setIsSubmitting(true)
    try {
      // Only save the necessary fields (id, name_en, name_gu) for the JSONB column
      const itemsToSave = selectedMenu.map((item) => ({
        id: item.id,
        name_en: item.name_en,
        name_gu: item.name_gu,
        time_slot: item.time_slot,
      }))
      await onSave(inquiry.id, itemsToSave)
      onOpenChange(false) // Close dialog on successful save
    } catch (error) {
      console.error("Error saving custom menu:", error)
      alert("Failed to save custom menu. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-[#18181b] border-[#27272a] text-white p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-[#27272a]">
          <DialogTitle className="text-2xl font-sans font-extrabold tracking-tight">
            {t("edit_custom_menu", "Edit Custom Menu", "કસ્ટમ મેનુ સંપાદિત કરો")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
          {/* Menu Selection Area */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden border-r border-[#27272a]">
            <div className="p-4 space-y-4 border-b border-[#27272a] bg-[#18181b]/50 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t("search_dishes_placeholder", "Search dishes...", "વાનગીઓ શોધો...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0f0f11] border-[#27272a] text-white placeholder:text-gray-500 h-10 ring-offset-[#d97706] focus-visible:ring-[#d97706]"
                  />
                </div>
                <Button
                  variant={showVegOnly ? "default" : "outline"}
                  onClick={() => setShowVegOnly(!showVegOnly)}
                  className={`rounded-lg flex items-center gap-2 font-semibold h-10 transition-all ${showVegOnly
                      ? "bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20"
                      : "bg-[#0f0f11] border-[#27272a] text-gray-400 hover:text-white hover:bg-[#27272a]"
                    }`}
                >
                  <Leaf className={`h-4 w-4 ${showVegOnly ? "text-white" : "text-green-500"}`} />
                  {t("veg_only", "Veg Only", "ફક્ત શાકાહારી")}
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97706]"></div>
              </div>
            ) : (
              <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                {categories.map((category) => {
                  const itemsInCategory = filteredItems.filter((item) => item.category_id === category.id);
                  if (itemsInCategory.length === 0 && searchTerm) return null;

                  return (
                    <Collapsible key={category.id} defaultOpen className="group">
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-[#0f0f11] border border-[#27272a] rounded-xl font-sans font-bold text-sm text-gray-200 hover:text-white hover:border-[#d97706]/50 transition-all shadow-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-4 bg-[#d97706] rounded-full opacity-0 group-data-[state=open]:opacity-100 transition-opacity" />
                          {language === "gu" ? category.name_gu : category.name_en}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 px-1">
                        {itemsInCategory.map((item) => (
                          <Card
                            key={item.id}
                            className="bg-[#0f0f11] border-[#27272a] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#d97706]/30 transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <div className="relative h-28">
                              <Image
                                src={
                                  item.image_url ||
                                  `/placeholder.svg?height=150&width=300&query=${encodeURIComponent(item.name_en) || "food"
                                  }`
                                }
                                alt={language === "gu" ? item.name_gu : item.name_en}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent opacity-60" />
                              {item.is_vegetarian && (
                                <Badge className="absolute top-2 left-2 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] backdrop-blur-md">
                                  <Leaf className="h-3 w-3 mr-1" />
                                  {t("veg", "Veg", "શાકાહારી")}
                                </Badge>
                              )}
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-bold text-white text-sm mb-3">
                                {language === "gu" ? item.name_gu : item.name_en}
                              </h4>
                              <div className="relative">
                                <Button
                                  size="sm"
                                  onClick={() => handleAddItem(item)}
                                  className="w-full font-bold rounded-lg text-xs transition-all h-9 bg-gradient-to-r from-[#d97706] to-[#ea580c] hover:from-[#f59e0b] hover:to-[#f97316] text-black shadow-lg shadow-orange-900/20"
                                >
                                  {t("add_to_menu", "Add to Menu", "મેનુમાં ઉમેરો")}
                                </Button>
                                {selectedMenu.filter(s => s.id === item.id).length > 0 && (
                                  <Badge className="absolute -top-2 -right-2 bg-white text-black border-none text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center p-0 shadow-lg">
                                    {selectedMenu.filter(s => s.id === item.id).length}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Menu Summary */}
          <div className="lg:col-span-1 flex flex-col bg-[#0f0f11]/30 overflow-hidden">
            <div className="p-6 border-b border-[#27272a] bg-[#18181b]/50 backdrop-blur-sm sticky top-0 z-20">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                {t("selected_items", "Selected Items", "પસંદ કરેલી વસ્તુઓ")}
                <Badge className="bg-[#d97706] text-black border-none font-bold">
                  {selectedMenu.length}
                </Badge>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {selectedMenu.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-40">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <X className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-400">
                    {t("no_items_selected", "No items selected yet.", "હજુ સુધી કોઈ વસ્તુઓ પસંદ કરવામાં આવી નથી.")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMenu.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between bg-[#18181b] border border-[#27272a] p-3 rounded-xl group hover:border-[#d97706]/30 transition-all"
                    >
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm text-gray-200 group-hover:text-white transition-colors">
                          {language === "gu" ? item.name_gu : item.name_en}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={item.time_slot || "general"}
                          onValueChange={(val) => {
                            const newMenu = [...selectedMenu]
                            newMenu[index] = { ...newMenu[index], time_slot: val }
                            setSelectedMenu(newMenu)
                          }}
                        >
                          <SelectTrigger className="w-[110px] h-8 text-[10px] bg-[#0f0f11] border-[#27272a] text-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#18181b] border-[#27272a] text-white">
                            <SelectItem value="general">{t("slot_general", "General", "સામાન્ય મેનુ")}</SelectItem>
                            <SelectItem value="breakfast">{t("slot_breakfast", "Breakfast", "સવારનું મેનુ")}</SelectItem>
                            <SelectItem value="lunch">{t("slot_lunch", "Lunch", "બપોરનું મેનુ")}</SelectItem>
                            <SelectItem value="dinner">{t("slot_dinner", "Dinner", "રાતનું મેનુ")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-[#27272a] bg-[#0f0f11]/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white hover:bg-[#27272a] font-bold"
          >
            {t("cancel", "Cancel", "રદ કરો")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-white text-black hover:bg-gray-200 font-extrabold px-8 shadow-xl transition-all active:scale-95"
          >
            {isSubmitting ? t("saving", "Saving...", "સાચવી રહ્યા છીએ...") : t("save_menu", "Save Menu", "મેનુ સાચવો")}
          </Button>
        </DialogFooter>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #27272a;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #3f3f46;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
