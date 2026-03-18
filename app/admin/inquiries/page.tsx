"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    MessageSquare,
    Edit,
    Trash2,
    Download,
    Search,
    X,
    ArrowLeft,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react"
import {
    getInquiries,
    updateInquiryStatusAction,
    deleteInquiryAction,
    saveCustomMenuAction
} from "@/app/actions"
import EditCustomMenuDialog from "@/components/admin/edit-custom-menu-dialog"
import MenuInquiryCalendar from "@/components/admin/menu-inquiry-calendar"

export default function AdminInquiriesPage() {
    const searchParams = useSearchParams()
    const typeFromUrl = searchParams.get("type") || "general"

    const [inquiries, setInquiries] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState("")
    const [eventDateFilter, setEventDateFilter] = useState("") // YYYY-MM-DD format
    const [typeFilter, setTypeFilter] = useState(typeFromUrl) // general, custom_menu
    const [statusFilter, setStatusFilter] = useState("all") // all, pending, in_progress, completed
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

    // State for the new custom menu edit dialog
    const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false)
    const [editingInquiry, setEditingInquiry] = useState<any | null>(null)

    useEffect(() => {
        fetchInquiries()

        // Listen for real-time inquiry notifications
        const handleNewInquiry = () => {
            fetchInquiries()
        }

        window.addEventListener("new-inquiry", handleNewInquiry)
        return () => window.removeEventListener("new-inquiry", handleNewInquiry)
    }, [searchTerm, eventDateFilter, typeFilter, statusFilter]) // Re-fetch data when filters change

    const fetchInquiries = async () => {
        setIsLoading(true)
        const { data: inquiriesData } = await getInquiries(searchTerm, eventDateFilter, 0, typeFilter, statusFilter)
        setInquiries(inquiriesData)
        setIsLoading(false)
    }

    const updateInquiryStatus = async (id: string, status: string) => {
        const { error } = await updateInquiryStatusAction(id, status)
        if (!error) {
            fetchInquiries()
        } else {
            console.error("Error updating inquiry status:", error)
        }
    }

    const deleteInquiry = async (id: string) => {
        if (confirm("Are you sure you want to delete this inquiry?")) {
            const { error } = await deleteInquiryAction(id)
            if (!error) {
                fetchInquiries()
            } else {
                console.error("Error deleting inquiry:", error)
            }
        }
    }

    const handleEditCustomMenu = (inquiry: any) => {
        setEditingInquiry(inquiry)
        setIsEditMenuDialogOpen(true)
    }

    const handleSaveCustomMenu = async (inquiryId: string, newSelectedItems: any[]) => {
        const { error } = await saveCustomMenuAction(inquiryId, newSelectedItems)
        if (error) {
            console.error("Error updating selected menu items:", error)
            throw error
        } else {
            fetchInquiries()
        }
    }

    const handleClearFilters = () => {
        setSearchTerm("")
        setEventDateFilter("")
        setStatusFilter("all")
    }

    const downloadCustomMenuPdf = async (inquiry: any) => {
        const hasGujaratiContent = inquiry.selected_menu_items?.some((item: any) => item.name_gu)
        const useGujarati = hasGujaratiContent || inquiry.language === "gu"

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
          body { font-family: ${useGujarati ? "'Noto Sans Gujarati', sans-serif" : "'Inter', sans-serif"}; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background: white; }
          .header { text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #d97706; font-size: 28px; font-weight: 700; margin: 0; }
          .company-info { color: #6b7280; font-size: 14px; margin-top: 10px; }
          .section { margin-bottom: 25px; }
          .section-title { background: #fef3c7; color: #d97706; padding: 10px 15px; font-size: 18px; font-weight: 600; border-left: 4px solid #f59e0b; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
          .info-item { background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; }
          .info-label { font-weight: 600; color: #374151; font-size: 14px; }
          .info-value { color: #6b7280; margin-top: 4px; }
          .full-width { grid-column: 1 / -1; }
          .menu-items { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .menu-item { background: white; padding: 10px 15px; margin-bottom: 8px; border-radius: 6px; border-left: 3px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
          .inquiry-id { background: #dbeafe; color: #1e40af; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 12px; display: inline-block; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${useGujarati ? "પાયલ કેટરિંગ" : "Payal Catering"}</h1>
          <div class="company-info">📞 +91 97147 99377 | 📧 info@payalcatering.com</div>
        </div>
        <div class="inquiry-id">${useGujarati ? "પૂછપરછ ID" : "Inquiry ID"}: ${inquiry.id}</div>
        <div class="section">
          <div class="section-title">${useGujarati ? "ગ્રાહકની વિગતો" : "Customer Details"}</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">${useGujarati ? "નામ" : "Name"}</div><div class="info-value">${inquiry.name}</div></div>
            <div class="info-item"><div class="info-label">${useGujarati ? "ઈમેલ" : "Email"}</div><div class="info-value">${inquiry.email}</div></div>
            ${inquiry.phone ? `<div class="info-item"><div class="info-label">${useGujarati ? "ફોન" : "Phone"}</div><div class="info-value">${inquiry.phone}</div></div>` : ""}
          </div>
        </div>
        <div class="section">
          <div class="section-title">${useGujarati ? "ઇવેન્ટની વિગતો" : "Event Details"}</div>
          <div class="info-grid">
            ${inquiry.event_type ? `<div class="info-item"><div class="info-label">${useGujarati ? "પ્રકાર" : "Type"}</div><div class="info-value">${(() => {
    const eventTypeMap = {
      wedding: useGujarati ? "લગ્ન" : "Wedding",
      corporate: useGujarati ? "કોર્પોરેટ ઇવેન્ટ" : "Corporate Event",
      birthday: useGujarati ? "જન્મદિવસ પાર્ટી" : "Birthday Party",
      anniversary: useGujarati ? "વર્ષગાંઠ" : "Anniversary",
      festival: useGujarati ? "તહેવાર" : "Festival",
      other: useGujarati ? "અન્ય" : "Other",
    }
    return (eventTypeMap[inquiry.event_type as keyof typeof eventTypeMap] || inquiry.event_type)
  })()}</div></div>` : ""}
            ${inquiry.event_date ? `<div class="info-item"><div class="info-label">${useGujarati ? "તારીખ" : "Date"}</div><div class="info-value">${new Date(inquiry.event_date).toLocaleDateString()}</div></div>` : ""}
            ${(() => {
    const timeValue = String(inquiry.event_time || '').toLowerCase().trim();
    const isFullDay = timeValue === 'full_day' || timeValue.includes('full') || timeValue.includes('આખો દિવસ');
    let timeLabel = inquiry.event_time;
    if (timeValue === 'morning') timeLabel = useGujarati ? 'સવાર' : 'Morning';
    else if (timeValue === 'evening') timeLabel = useGujarati ? 'સાંજ' : 'Evening';
    else if (timeValue === 'night') timeLabel = useGujarati ? 'રાત' : 'Night';
    else if (isFullDay) timeLabel = useGujarati ? 'આખો દિવસ મેનુ' : 'Full Day Menu';
    else if (timeValue === 'other') timeLabel = inquiry.event_time_custom || (useGujarati ? 'અન્ય' : 'Other');

    return `<div class="info-item"><div class="info-label">${useGujarati ? "સમય" : "Time"}</div><div class="info-value" style="font-weight: 800; color: #d97706; font-size: 1.1em;">${timeLabel}</div></div>`;
  })()}
            ${(() => {
    const bCount = Number(inquiry.breakfast_count || 0);
    const lCount = Number(inquiry.lunch_count || 0);
    const dCount = Number(inquiry.dinner_count || 0);
    const gCount = Number(inquiry.guest_count || 0);
    
    // Always show slot counts if they are > 0, as they are specific.
    // This is safer than relying solely on the event_time string.
    let html = '';
    let shownSlots = false;
    
    if (bCount > 0) {
      html += `<div class="info-item"><div class="info-label">${useGujarati ? "સવારના મહેમાનો" : "Morning Guests"}</div><div class="info-value">${bCount}</div></div>`;
      shownSlots = true;
    }
    if (lCount > 0) {
      html += `<div class="info-item"><div class="info-label">${useGujarati ? "બપોરના મહેમાનો" : "Afternoon Guests"}</div><div class="info-value">${lCount}</div></div>`;
      shownSlots = true;
    }
    if (dCount > 0) {
      html += `<div class="info-item"><div class="info-label">${useGujarati ? "રાતના મહેમાનો" : "Night Guests"}</div><div class="info-value">${dCount}</div></div>`;
      shownSlots = true;
    }
    
    // Fallback to total guests if no slot counts were shown and it's not obviously a full day event
    if (!shownSlots && gCount > 0) {
      html += `<div class="info-item"><div class="info-label">${useGujarati ? "મહેમાનોની સંખ્યા" : "Total Guests"}</div><div class="info-value">${gCount}</div></div>`;
    }
    
    return html;
  })()}
          </div>
        </div>
        ${inquiry.type === 'custom_menu' ? `
        <div class="section">
          <div class="section-title">${useGujarati ? "પસંદ કરેલી મેનુ વસ્તુઓ" : "Selected Menu Items"}</div>
          <div class="menu-items">
            ${(() => {
    const items = inquiry.selected_menu_items || [];
    const slotOrder = ['breakfast', 'lunch', 'dinner', 'general'];
    const slots = [...new Set(items.map((i: any) => i.time_slot || 'general'))].sort((a, b) => {
      return slotOrder.indexOf(a as string) - slotOrder.indexOf(b as string);
    });

    return slots.map(slot => {
      const slotItems = items.filter((i: any) => (i.time_slot || 'general') === slot);
      if (slotItems.length === 0) return '';

      const guestCountForSlot = slot === 'breakfast' ? inquiry.breakfast_count : 
                               slot === 'lunch' ? inquiry.lunch_count : 
                               slot === 'dinner' ? inquiry.dinner_count : null;
      
      const countNum = Number(guestCountForSlot || 0);
      const guestCountText = (countNum > 0) ? 
        (useGujarati ? ` - ${countNum} મહેમાનો` : ` - ${countNum} Guests`) : '';

      const slotName = (slot === 'breakfast' ? (useGujarati ? 'સવારનું મેનુ (Morning)' : 'Morning Menu') :
        slot === 'lunch' ? (useGujarati ? 'બપોરનું મેનુ (Afternoon)' : 'Afternoon Menu') :
        slot === 'dinner' ? (useGujarati ? 'રાતનું મેનુ (Evening/Night)' : 'Evening / Night Menu') : 
        (useGujarati ? 'મેનુ' : 'Menu')) + guestCountText;

      return `
                <div style="margin-bottom: 25px; page-break-before: always;">
                  <div style="background: #fef3c7; color: #d97706; padding: 10px 15px; font-weight: bold; font-size: 18px; border-left: 5px solid #f59e0b; margin-bottom: 12px; border-radius: 4px;">
                    ${slotName}
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    ${slotItems.map((item: any, i: number) => `
                      <div class="menu-item" style="background: white; border: 1px solid #e5e7eb; padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid #10b981; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        <span style="font-weight: bold; color: #d97706; margin-right: 12px;">${i + 1}.</span>
                        <span style="font-weight: 600;">${useGujarati && item.name_gu ? item.name_gu : (item.name_en || item.name)}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `;
    }).join("");
  })()}
          </div>
        </div>` : ""}
        ${inquiry.message ? `<div class="section"><div class="section-title">Message</div><div class="info-item"><div class="info-value">${inquiry.message}</div></div></div>` : ""}
        <div class="footer">${new Date().toLocaleString()}</div>
      </body>
      </html>
    `;

        const printWindow = window.open("", "_blank")
        if (printWindow) {
            printWindow.document.write(htmlContent)
            printWindow.document.close()
            // Print but don't close the window automatically so user can review the content
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print();
              }, 10000);
            };
        } else {
            const blob = new Blob([htmlContent], { type: "text/html" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `Inquiry_${inquiry.name}.html`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] text-gray-200">
            {/* Header */}
            <header className="bg-[#18181b] shadow-sm border-b border-[#27272a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" asChild className="mb-1 text-gray-400 hover:text-white hover:bg-[#27272a]">
                                <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white">
                                    {typeFilter === "custom_menu" ? "Menu Requests" : "General Inquiries"}
                                </h1>
                                <p className="text-gray-400 mt-1 text-sm font-medium">
                                    {typeFilter === "custom_menu" ? "Manage custom menu builder requests" : "View and respond to customer messages"}
                                </p>
                            </div>
                        </div>

                        {typeFilter === "custom_menu" && (
                            <div className="flex bg-[#18181b] border border-[#27272a] rounded-lg p-1">
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={`h-8 px-4 rounded-md ${viewMode === "list" ? "bg-[#27272a] text-[#d97706]" : "text-gray-400 hover:text-white"}`}
                                >
                                    List
                                </Button>
                                <Button
                                    variant={viewMode === "calendar" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("calendar")}
                                    className={`h-8 px-4 rounded-md ${viewMode === "calendar" ? "bg-[#27272a] text-[#d97706]" : "text-gray-400 hover:text-white"}`}
                                >
                                    Calendar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={typeFilter} onValueChange={setTypeFilter} className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <TabsList className="bg-[#18181b] border border-[#27272a] p-1">
                            <TabsTrigger value="general" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#d97706] text-gray-400">General Inquiries</TabsTrigger>
                            <TabsTrigger value="custom_menu" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#d97706] text-gray-400">Menu Requests</TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-48">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full bg-[#18181b] border-[#27272a] text-white focus-visible:ring-[#d97706]"
                                />
                            </div>

                            <Input
                                type="date"
                                value={eventDateFilter}
                                onChange={(e) => setEventDateFilter(e.target.value)}
                                className="w-full md:w-40 bg-[#18181b] border-[#27272a] text-white focus-visible:ring-[#d97706]"
                                style={{ colorScheme: "dark" }}
                            />

                            {(searchTerm || eventDateFilter || statusFilter !== "all") && (
                                <Button variant="outline" size="icon" onClick={handleClearFilters} className="bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:bg-[#27272a]">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {typeFilter === "custom_menu" && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <Button
                                variant={statusFilter === "all" ? "default" : "outline"}
                                onClick={() => setStatusFilter("all")}
                                className={statusFilter === "all" ? "bg-[#d97706] hover:bg-[#b45309]" : "bg-[#18181b] border-[#27272a] text-gray-400"}
                                size="sm"
                            >
                                All Status
                            </Button>
                            <Button
                                variant={statusFilter === "pending" ? "destructive" : "outline"}
                                onClick={() => setStatusFilter("pending")}
                                className={statusFilter === "pending" ? "" : "bg-[#18181b] border-[#27272a] text-gray-400"}
                                size="sm"
                            >
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === "in_progress" ? "default" : "outline"}
                                onClick={() => setStatusFilter("in_progress")}
                                className={statusFilter === "in_progress" ? "bg-amber-600 hover:bg-amber-700" : "bg-[#18181b] border-[#27272a] text-gray-400"}
                                size="sm"
                            >
                                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                In Progress
                            </Button>
                            <Button
                                variant={statusFilter === "completed" ? "default" : "outline"}
                                onClick={() => setStatusFilter("completed")}
                                className={statusFilter === "completed" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#18181b] border-[#27272a] text-gray-400"}
                                size="sm"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Done
                            </Button>
                        </div>
                    )}

                    <TabsContent value={typeFilter} className="mt-0">
                        <Card className={`shadow-2xl bg-[#18181b] border-[#27272a] ${viewMode === 'calendar' ? 'border-none bg-transparent shadow-none' : ''}`}>
                            <CardContent className={viewMode === 'list' ? 'p-0' : 'p-0 bg-transparent'}>
                                {isLoading ? (
                                    <div className="flex justify-center py-20">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d97706]"></div>
                                    </div>
                                ) : inquiries.length === 0 ? (
                                    <div className="text-center py-20 px-4">
                                        <MessageSquare className="h-12 w-12 text-[#27272a] mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-white mb-1">No inquiries found</h3>
                                        <p className="text-gray-500">
                                            {searchTerm || eventDateFilter || statusFilter !== "all"
                                                ? "Try adjusting your filters to see more results."
                                                : `When customers submit a ${typeFilter === "custom_menu" ? "menu request" : "contact form"}, it will appear here.`}
                                        </p>
                                        {(searchTerm || eventDateFilter || statusFilter !== "all") && (
                                            <Button variant="link" onClick={handleClearFilters} className="mt-2 text-[#d97706]">Clear all filters</Button>
                                        )}
                                    </div>
                                ) : viewMode === "calendar" && typeFilter === "custom_menu" ? (
                                    <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] shadow-xl">
                                        <MenuInquiryCalendar
                                            inquiries={inquiries}
                                            onEdit={handleEditCustomMenu}
                                            onDownload={downloadCustomMenuPdf}
                                        />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-[#18181b] border-b border-[#27272a]">
                                                <TableRow className="border-[#27272a] hover:bg-[#27272a]/30">
                                                    <TableHead className="font-semibold px-6 py-4 text-gray-400">Client</TableHead>
                                                    <TableHead className="font-semibold text-gray-400">Details</TableHead>
                                                    <TableHead className="font-semibold text-gray-400">Event Info</TableHead>
                                                    {typeFilter === "custom_menu" && <TableHead className="font-semibold text-gray-400">Status</TableHead>}
                                                    <TableHead className="font-semibold text-right px-6 text-gray-400">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {inquiries.map((inquiry: any) => (
                                                    <TableRow key={inquiry.id} className="hover:bg-[#27272a]/30 transition-colors border-[#27272a]">
                                                        {/* Client details */}
                                                        <TableCell className="px-6 py-4 align-top">
                                                            <div className="font-medium text-white">{inquiry.name}</div>
                                                            <div className="text-sm text-gray-400 mt-1">{inquiry.email}</div>
                                                            {inquiry.phone && <div className="text-xs text-gray-500 mt-0.5">{inquiry.phone}</div>}
                                                        </TableCell>

                                                        {/* Details */}
                                                        <TableCell className="align-top py-4">
                                                            {inquiry.type === "custom_menu" ? (
                                                                <div className="space-y-1">
                                                                    <Badge className="bg-[#d97706]/20 text-[#d97706] hover:bg-[#d97706]/30 border border-[#d97706]/50">
                                                                        Custom Menu
                                                                    </Badge>
                                                                    {inquiry.selected_menu_items && (
                                                                        <div className="text-xs text-gray-500 mt-2">
                                                                            <span className="font-medium text-gray-400">{inquiry.selected_menu_items.length}</span> items requested
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1">
                                                                    <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50">
                                                                        Contact Message
                                                                    </Badge>
                                                                    {inquiry.message && (
                                                                        <div className="mt-2 text-xs text-gray-400 bg-[#0f0f11] border border-[#27272a] p-2 rounded max-w-[200px] truncate" title={inquiry.message}>
                                                                            "{inquiry.message}"
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </TableCell>

                                                        {/* Event Info */}
                                                        <TableCell className="align-top py-4">
                                                            {inquiry.event_date ? (
                                                                <div className="space-y-1 text-sm">
                                                                    <div className="flex justify-between items-center text-gray-400">
                                                                        <span>Date:</span>
                                                                        <span className="font-medium text-gray-200 ml-2">{new Date(inquiry.event_date).toLocaleDateString()}</span>
                                                                    </div>
                                                                    {inquiry.event_type && (
                                                                        <div className="flex justify-between items-center text-gray-500">
                                                                            <span>Type:</span>
                                                                            <span className="capitalize">{inquiry.event_type}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 italic text-sm">Not specified</span>
                                                            )}
                                                        </TableCell>

                                                        {/* Status */}
                                                        {typeFilter === "custom_menu" && (
                                                            <TableCell className="align-top py-4">
                                                                <Badge
                                                                    className={
                                                                        inquiry.status === "pending"
                                                                            ? "bg-red-500/20 text-red-500 border-red-500/50"
                                                                            : inquiry.status === "in_progress"
                                                                                ? "bg-amber-500/20 text-amber-500 border-amber-500/50"
                                                                                : "bg-emerald-500/20 text-emerald-500 border-emerald-500/50"
                                                                    }
                                                                    variant="outline"
                                                                >
                                                                    {inquiry.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                                </Badge>
                                                            </TableCell>
                                                        )}

                                                        {/* Actions */}
                                                        <TableCell className="align-top py-4 px-6">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {inquiry.type === "custom_menu" && (
                                                                    <>
                                                                        <Button variant="outline" size="sm" onClick={() => handleEditCustomMenu(inquiry)} className="h-8 bg-[#0f0f11] border-[#27272a] text-gray-300 hover:text-white">
                                                                            <Edit className="h-3.5 w-3.5 mr-1" />
                                                                            Edit
                                                                        </Button>
                                                                        <Button variant="outline" size="sm" onClick={() => downloadCustomMenuPdf(inquiry)} className="h-8 bg-[#0f0f11] border-[#27272a] text-gray-300">
                                                                            <Download className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {inquiry.type === "general" && inquiry.message && (
                                                                    <Button variant="outline" size="sm" onClick={() => alert(`Message:\n\n${inquiry.message}`)} className="h-8 bg-[#0f0f11] border-[#27272a] text-gray-300">
                                                                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                                                        Read
                                                                    </Button>
                                                                )}

                                                                {inquiry.type === "custom_menu" && (
                                                                    <Select
                                                                        defaultValue={inquiry.status}
                                                                        onValueChange={(val) => updateInquiryStatus(inquiry.id, val)}
                                                                    >
                                                                        <SelectTrigger className="h-8 w-32 bg-[#0f0f11] border-[#27272a] text-sm">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="bg-[#18181b] border-[#27272a]">
                                                                            <SelectItem value="pending">Pending</SelectItem>
                                                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                                                            <SelectItem value="completed">Completed</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}

                                                                <Button variant="ghost" size="sm" onClick={() => deleteInquiry(inquiry.id)} className="h-8 w-8 p-0 text-gray-500 hover:text-red-500">
                                                                    <Trash2 className="h-3.5 w-3.5" />
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
            </main>

            {/* Edit Custom Menu Dialog */}
            <EditCustomMenuDialog
                isOpen={isEditMenuDialogOpen}
                onOpenChange={setIsEditMenuDialogOpen}
                inquiry={editingInquiry}
                onSave={handleSaveCustomMenu}
            />
        </div>
    )
}
