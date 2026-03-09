"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Calculator,
    ArrowLeft,
    Download,
    Plus,
    Trash2,
    Edit,
    Save,
    Search,
    FileText,
    Calendar,
    Clock,
    MapPin,
    ChevronRight
} from "lucide-react"
import {
    getMaterialTemplatesAction,
    getMaterialItemsAction,
    saveMaterialTemplateAction,
    deleteMaterialTemplateAction
} from "@/app/actions"

export default function MaterialCalculatorPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
    const [items, setItems] = useState<any[]>([])
    const [guestCount, setGuestCount] = useState(100)
    const [isLoading, setIsLoading] = useState(true)
    const [isViewingCalculator, setIsViewingCalculator] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Event details for PDF
    const [eventDetails, setEventDetails] = useState({
        date: "",
        time: "",
        location: ""
    })

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        setIsLoading(true)
        const { data } = await getMaterialTemplatesAction()
        setTemplates(data || [])
        setIsLoading(false)
    }

    const handleSelectTemplate = async (template: any) => {
        setSelectedTemplate(template)
        const { data } = await getMaterialItemsAction(template.id)
        setItems(data || [])
        setIsViewingCalculator(true)
        setIsEditing(false)
    }

    const handleAddNewTemplate = () => {
        setSelectedTemplate({
            name_en: "New Template",
            name_gu: "નવી ટેમ્પલેટ",
            base_guest_count: 100
        })
        setItems([])
        setIsViewingCalculator(true)
        setIsEditing(true)
    }

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                name_en: "",
                name_gu: "",
                base_quantity: 0,
                unit_en: "kg",
                unit_gu: "કિલો",
                sort_order: items.length
            }
        ])
    }

    const handleRemoveItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSaveTemplate = async () => {
        if (!selectedTemplate.name_en || !selectedTemplate.name_gu) {
            alert("Please provide both English and Gujarati names for the template.")
            return
        }

        const payload = {
            ...selectedTemplate,
            items: items
        }

        const { error } = await saveMaterialTemplateAction(payload, selectedTemplate.id)

        if (error) {
            alert("Error saving template: " + error)
        } else {
            setIsEditing(false)
            fetchTemplates()
        }
    }

    const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this template?")) {
            const { error } = await deleteMaterialTemplateAction(id)
            if (error) {
                alert("Error deleting template: " + error)
            } else {
                fetchTemplates()
            }
        }
    }

    const downloadCalculatorPdf = () => {
        const useGujarati = true // Always include Gujarati for catering lists

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
          
          body {
            font-family: 'Noto Sans Gujarati', 'Inter', sans-serif;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #d97706;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .header h1 {
            color: #d97706;
            margin: 0;
            font-size: 24px;
          }
          
          .event-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
            background: #fff8e1;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .template-info {
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          
          th {
            background: #d97706;
            color: white;
            text-align: left;
            padding: 10px;
            font-size: 14px;
          }
          
          td {
            border-bottom: 1px solid #e2e8f0;
            padding: 8px 10px;
            font-size: 14px;
          }
          
          .quantity { font-weight: bold; }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }

          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>પાયલ કેટરિંગ - કસ્ટમ મેનુ લિસ્ટ</h1>
          <div style="font-size: 14px; color: #666; margin-top: 5px;">
            કસ્ટમ મેનુ કેલ્ક્યુલેટર • Payal Catering
          </div>
        </div>

        <div class="template-info">
          ${selectedTemplate.name_gu} (${selectedTemplate.name_en})
          <div style="font-size: 14px; font-weight: normal; margin-top: 5px;">
            કુલ મહેમાનો: <strong>${guestCount}</strong>
          </div>
        </div>

        <div class="event-info">
          <div><strong>તારીખ:</strong> ${eventDetails.date || "N/A"}</div>
          <div><strong>સમય:</strong> ${eventDetails.time || "N/A"}</div>
          <div style="grid-column: 1 / -1;"><strong>સ્થળ:</strong> ${eventDetails.location || "N/A"}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th width="10%">ક્રમ</th>
              <th width="60%">વસ્તુ (Item)</th>
              <th width="30%">જથ્થો (Quantity)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => {
            const multiplier = guestCount / (selectedTemplate.base_guest_count || 100)
            const calculatedQty = (item.base_quantity * multiplier).toFixed(2).replace(/\.00$/, "")
            return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.name_gu} <br> <span style="font-size: 10px; color: #666;">${item.name_en}</span></td>
                  <td class="quantity">${calculatedQty} ${item.unit_gu}</td>
                </tr>
              `
        }).join("")}
          </tbody>
        </table>

        <div class="footer">
          પાયલ કેટરિંગ - અસલી સ્વાદ, યાદગાર ક્ષણો | +91 98765 43210
          <br>
          Generated on ${new Date().toLocaleDateString('gu-IN')}
        </div>
      </body>
      </html>
    `

        const printWindow = window.open("", "_blank")
        if (printWindow) {
            printWindow.document.write(htmlContent)
            printWindow.document.close()
            setTimeout(() => {
                printWindow.print()
            }, 1000)
        }
    }

    return (
        <div className="min-h-screen bg-[#0f0f11] text-gray-200 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                            </Link>
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                            <Calculator className="h-8 w-8 text-[#d97706]" />
                            Material Calculator
                        </h1>
                        <p className="text-gray-400 mt-1">Calculate ingredient quantities for orders</p>
                    </div>

                    {!isViewingCalculator && (
                        <Button onClick={handleAddNewTemplate} className="bg-[#d97706] hover:bg-[#b45309] text-black font-semibold">
                            <Plus className="h-4 w-4 mr-2" /> New Template
                        </Button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {!isViewingCalculator ? (
                    /* Template List */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97706]"></div>
                            </div>
                        ) : templates.length === 0 ? (
                            <Card className="col-span-full bg-[#18181b] border-[#27272a] p-12 text-center">
                                <p className="text-gray-500 mb-4">No material templates found.</p>
                                <Button onClick={handleAddNewTemplate} variant="outline" className="border-[#27272a] text-gray-300">
                                    Create your first template
                                </Button>
                            </Card>
                        ) : (
                            templates.map((template) => (
                                <Card
                                    key={template.id}
                                    className="bg-[#18181b] border-[#27272a] hover:border-[#d97706]/50 transition-all cursor-pointer group overflow-hidden"
                                    onClick={() => handleSelectTemplate(template)}
                                >
                                    <CardHeader className="pb-3 border-b border-[#27272a]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl text-white font-serif mb-1">{template.name_gu}</CardTitle>
                                                <CardDescription className="text-gray-400">{template.name_en}</CardDescription>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={(e) => handleDeleteTemplate(template.id, e)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Base: {template.base_guest_count} guests</span>
                                        <span className="text-[#d97706] flex items-center group-hover:translate-x-1 transition-transform">
                                            Open Calculator <ChevronRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                ) : (
                    /* Calculator & Editor View */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar: Settings & Calculator */}
                        <div className="space-y-6">
                            <Card className="bg-[#18181b] border-[#27272a]">
                                <CardHeader>
                                    <CardTitle className="text-white font-serif">Calculator settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Guest Count</label>
                                        <div className="flex items-center gap-3">
                                            <Calculator className="h-5 w-5 text-[#d97706]" />
                                            <Input
                                                type="number"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                                className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] text-lg font-bold"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Calculated as: {guestCount} / {selectedTemplate.base_guest_count} = {(guestCount / (selectedTemplate.base_guest_count || 100)).toFixed(2)}x base quantity
                                        </p>
                                    </div>

                                    <hr className="border-[#27272a]" />

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-[#d97706]" /> Event Details
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500">Event Date</label>
                                            <Input
                                                type="date"
                                                value={eventDetails.date}
                                                onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                                                className="bg-[#0f0f11] border-[#27272a] text-white text-sm"
                                                style={{ colorScheme: 'dark' }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500">Event Time</label>
                                            <Input
                                                placeholder="e.g. 7 PM"
                                                value={eventDetails.time}
                                                onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
                                                className="bg-[#0f0f11] border-[#27272a] text-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500">Location</label>
                                            <Input
                                                placeholder="Venue name..."
                                                value={eventDetails.location}
                                                onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
                                                className="bg-[#0f0f11] border-[#27272a] text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col gap-2">
                                        <Button
                                            onClick={downloadCalculatorPdf}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <Download className="h-4 w-4 mr-2" /> Download PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="border-[#27272a] text-gray-300"
                                        >
                                            {isEditing ? "Finish Editing" : <><Edit className="h-4 w-4 mr-2" /> Edit Template</>}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsViewingCalculator(false)}
                                            className="text-gray-500"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content: Items List/Editor */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="bg-[#18181b] border-[#27272a] overflow-hidden">
                                <CardHeader className="bg-[#1c1c20] border-b border-[#27272a] flex flex-row items-center justify-between">
                                    <div>
                                        {isEditing ? (
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    value={selectedTemplate.name_gu}
                                                    placeholder="Template Name (Gujarati)"
                                                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name_gu: e.target.value })}
                                                    className="bg-[#0f0f11] border-[#27272a] text-white font-serif text-xl"
                                                />
                                                <Input
                                                    value={selectedTemplate.name_en}
                                                    placeholder="Template Name (English)"
                                                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name_en: e.target.value })}
                                                    className="bg-[#0f0f11] border-[#27272a] text-gray-400 text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <CardTitle className="text-2xl text-white font-serif">{selectedTemplate.name_gu}</CardTitle>
                                                <CardDescription className="text-gray-400">{selectedTemplate.name_en}</CardDescription>
                                            </>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <Button onClick={handleSaveTemplate} className="bg-emerald-600 hover:bg-emerald-700">
                                            <Save className="h-4 w-4 mr-2" /> Save Template
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-[#27272a] hover:bg-transparent">
                                                <TableHead className="w-[80px] text-gray-500">Order</TableHead>
                                                <TableHead className="text-gray-500">Item Name (Guj/Eng)</TableHead>
                                                <TableHead className="text-gray-500">Base Qty (per {selectedTemplate.base_guest_count})</TableHead>
                                                <TableHead className="text-gray-500">Unit</TableHead>
                                                <TableHead className="text-gray-500 text-right">Calculated ({guestCount} guests)</TableHead>
                                                {isEditing && <TableHead className="w-[50px]"></TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item, index) => {
                                                const multiplier = guestCount / (selectedTemplate.base_guest_count || 100)
                                                const calculatedQty = (item.base_quantity * multiplier).toFixed(2).replace(/\.00$/, "")

                                                return (
                                                    <TableRow key={index} className="border-[#27272a] hover:bg-[#27272a]/20 transition-colors">
                                                        <TableCell className="text-gray-500 font-mono text-xs">{index + 1}</TableCell>
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <div className="space-y-1">
                                                                    <Input
                                                                        value={item.name_gu}
                                                                        placeholder="નામ (Gujarati)"
                                                                        onChange={(e) => handleItemChange(index, 'name_gu', e.target.value)}
                                                                        className="h-8 bg-[#0f0f11] border-[#27272a] text-sm"
                                                                    />
                                                                    <Input
                                                                        value={item.name_en}
                                                                        placeholder="Name (English)"
                                                                        onChange={(e) => handleItemChange(index, 'name_en', e.target.value)}
                                                                        className="h-7 bg-[#0f0f11] border-[#27272a] text-xs text-gray-400"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col">
                                                                    <span className="text-white font-medium">{item.name_gu}</span>
                                                                    <span className="text-gray-500 text-xs">{item.name_en}</span>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <Input
                                                                    type="number"
                                                                    value={item.base_quantity}
                                                                    onChange={(e) => handleItemChange(index, 'base_quantity', Number(e.target.value))}
                                                                    className="h-8 bg-[#0f0f11] border-[#27272a] text-sm w-24"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400">{item.base_quantity}</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <div className="space-y-1">
                                                                    <Input
                                                                        value={item.unit_gu}
                                                                        placeholder="Unit (Guj)"
                                                                        onChange={(e) => handleItemChange(index, 'unit_gu', e.target.value)}
                                                                        className="h-8 bg-[#0f0f11] border-[#27272a] text-sm w-20"
                                                                    />
                                                                    <Input
                                                                        value={item.unit_en}
                                                                        placeholder="Unit (Eng)"
                                                                        onChange={(e) => handleItemChange(index, 'unit_en', e.target.value)}
                                                                        className="h-7 bg-[#0f0f11] border-[#27272a] text-xs text-gray-400 w-20"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col">
                                                                    <span className="text-gray-400 text-sm">{item.unit_gu}</span>
                                                                    <span className="text-gray-600 text-xs">{item.unit_en}</span>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className="text-[#d97706] text-xl font-bold">
                                                                {calculatedQty}
                                                            </span>
                                                            <span className="text-gray-600 text-xs ml-1">{item.unit_gu}</span>
                                                        </TableCell>
                                                        {isEditing && (
                                                            <TableCell>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    className="text-gray-600 hover:text-red-500"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                )
                                            })}
                                            {isEditing && (
                                                <TableRow className="border-none">
                                                    <TableCell colSpan={6} className="text-center py-6">
                                                        <Button onClick={handleAddItem} variant="outline" className="border-dashed border-[#27272a] bg-transparent text-gray-500 hover:text-[#d97706] hover:border-[#d97706]">
                                                            <Plus className="h-4 w-4 mr-2" /> Add Item Row
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
