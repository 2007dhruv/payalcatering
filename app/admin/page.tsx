"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  MessageSquare,
  Calendar,
  MenuIcon,
  ImageIcon,
  BarChart3,
  Settings,
  FileText,
  Edit,
  Trash2,
  Download,
  Search,
  X,
  Calculator,
} from "lucide-react"
import {
  getDashboardStats,
  getInquiries,
  updateInquiryStatusAction,
  deleteInquiryAction,
  saveCustomMenuAction
} from "@/app/actions"
import EditCustomMenuDialog from "@/components/admin/edit-custom-menu-dialog"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    pendingInquiries: 0,
    totalMenuItems: 0,
    totalEvents: 0,
    customMenuInquiries: 0,
    totalCategories: 0,
  })
  const [inquiries, setInquiries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [eventDateFilter, setEventDateFilter] = useState("") // YYYY-MM-DD format

  // State for the new custom menu edit dialog
  const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false)
  const [editingInquiry, setEditingInquiry] = useState<any | null>(null)

  useEffect(() => {
    fetchDashboardData()

    // Listen for real-time inquiry notifications
    const handleNewInquiry = () => {
      fetchDashboardData()
    }

    window.addEventListener("new-inquiry", handleNewInquiry)
    return () => window.removeEventListener("new-inquiry", handleNewInquiry)
  }, [searchTerm, eventDateFilter]) // Re-fetch data when filters change or new inquiry arrives


  const fetchDashboardData = async () => {
    setIsLoading(true)

    // Fetch stats
    const newStats = await getDashboardStats()
    setStats(newStats)

    // Fetch recent inquiries with filters
    const { data: inquiriesData } = await getInquiries(searchTerm, eventDateFilter)

    setInquiries(inquiriesData)
    setIsLoading(false)
  }

  const updateInquiryStatus = async (id: string, status: string) => {
    const { error } = await updateInquiryStatusAction(id, status)

    if (!error) {
      fetchDashboardData()
    } else {
      console.error("Error updating inquiry status:", error)
    }
  }

  const deleteInquiry = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      const { error } = await deleteInquiryAction(id)

      if (!error) {
        fetchDashboardData()
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
      throw error // Re-throw to be caught by the dialog's save handler
    } else {
      fetchDashboardData() // Refresh data after successful save
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setEventDateFilter("")
  }

  const downloadCustomMenuPdf = async (inquiry: any) => {
    // Check if inquiry has Gujarati content or prefer Gujarati
    const hasGujaratiContent = inquiry.selected_menu_items?.some((item: any) => item.name_gu)
    const useGujarati = hasGujaratiContent || inquiry.language === "gu"

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
          
          body {
            font-family: ${useGujarati ? "'Noto Sans Gujarati', sans-serif" : "'Inter', sans-serif"};
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #f59e0b;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #d97706;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
          }
          
          .company-info {
            color: #6b7280;
            font-size: 14px;
            margin-top: 10px;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            background: #fef3c7;
            color: #d97706;
            padding: 10px 15px;
            font-size: 18px;
            font-weight: 600;
            border-left: 4px solid #f59e0b;
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .info-item {
            background: #f9fafb;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          
          .info-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
          }
          
          .info-value {
            color: #6b7280;
            margin-top: 4px;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .menu-items {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .menu-item {
            background: white;
            padding: 10px 15px;
            margin-bottom: 8px;
            border-radius: 6px;
            border-left: 3px solid #10b981;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .menu-item:last-child {
            margin-bottom: 0;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          
          .inquiry-id {
            background: #dbeafe;
            color: #1e40af;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 12px;
            display: inline-block;
            margin-bottom: 20px;
          }
          
          @media print {
            body { margin: 0; padding: 15px; }
            .header { page-break-after: avoid; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${useGujarati ? "પાયલ કેટરિંગ" : "Payal Catering"}</h1>
          <div class="company-info">
            ${useGujarati ? "અસલી સ્વાદ, યાદગાર ક્ષણો" : "Authentic Flavors, Memorable Moments"}<br>
            📞 +91 98765 43210 | 📧 info@payalcatering.com
          </div>
        </div>

        <div class="inquiry-id">
          ${useGujarati ? "પૂછપરછ ID" : "Inquiry ID"}: ${inquiry.id}
        </div>

        <div class="section">
          <div class="section-title">
            ${useGujarati ? "ગ્રાહકની વિગતો" : "Customer Details"}
          </div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">${useGujarati ? "નામ" : "Name"}</div>
              <div class="info-value">${inquiry.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">${useGujarati ? "ઈમેલ" : "Email"}</div>
              <div class="info-value">${inquiry.email}</div>
            </div>
            ${inquiry.phone ? `
            <div class="info-item">
              <div class="info-label">${useGujarati ? "ફોન" : "Phone"}</div>
              <div class="info-value">${inquiry.phone}</div>
            </div>` : ""}
            ${inquiry.guest_count ? `
            <div class="info-item">
              <div class="info-label">${useGujarati ? "મહેમાનોની સંખ્યા" : "Number of Guests"}</div>
              <div class="info-value">${inquiry.guest_count}</div>
            </div>` : ""}
          </div>
        </div>

        <div class="section">
          <div class="section-title">
            ${useGujarati ? "ઇવેન્ટની વિગતો" : "Event Details"}
          </div>
          <div class="info-grid">
            ${inquiry.event_type ? `
            <div class="info-item">
              <div class="info-label">${useGujarati ? "ઇવેન્ટનો પ્રકાર" : "Event Type"}</div>
              <div class="info-value">${(() => {
    const eventTypeMap = {
      wedding: useGujarati ? "લગ્ન" : "Wedding",
      corporate: useGujarati ? "કોર્પોરેટ ઇવેન્ટ" : "Corporate Event",
      birthday: useGujarati ? "જન્મદિવસ પાર્ટી" : "Birthday Party",
      anniversary: useGujarati ? "વર્ષગાંઠ" : "Anniversary",
      festival: useGujarati ? "તહેવાર" : "Festival",
      other: useGujarati ? "અન્ય" : "Other",
    }
    return (eventTypeMap[inquiry.event_type as keyof typeof eventTypeMap] || inquiry.event_type)
  })()}</div>
            </div>` : ""}
            ${inquiry.event_date ? `
            <div class="info-item">
              <div class="info-label">${useGujarati ? "ઇવેન્ટની તારીખ" : "Event Date"}</div>
              <div class="info-value">${new Date(inquiry.event_date).toLocaleDateString(useGujarati ? "gu-IN" : "en-IN")}</div>
            </div>` : ""}
            ${inquiry.event_time ? `
            <div class="info-item">
              <div class="info-label">${useGujarati ? "ઇવેન્ટનો સમય" : "Event Time"}</div>
              <div class="info-value" style="font-weight: 800; color: #d97706; font-size: 1.1em;">${(() => {
    const timeValue = String(inquiry.event_time || '').toLowerCase().trim();
    if (timeValue === 'morning') return useGujarati ? 'સવાર' : 'Morning';
    if (timeValue === 'evening') return useGujarati ? 'સાંજ' : 'Evening';
    if (timeValue === 'night') return useGujarati ? 'રાત' : 'Night';
    if (timeValue === 'full_day' || timeValue.includes('full') || timeValue.includes('આખો દિવસ')) return useGujarati ? 'આખો દિવસ મેનુ' : 'Full Day Menu';
    if (timeValue === 'other') return inquiry.event_time_custom || (useGujarati ? 'અન્ય' : 'Other');
    return inquiry.event_time;
  })()}</div>
            </div>` : ""}
            ${inquiry.event_address ? `
            <div class="info-item full-width">
              <div class="info-label">${useGujarati ? "ઇવેન્ટનું સરનામું" : "Event Address"}</div>
              <div class="info-value">${inquiry.event_address}</div>
            </div>` : ""}
          </div>
        </div>

        <div class="section">
          <div class="section-title">
            ${useGujarati ? "પસંદ કરેલી મેનુ વસ્તુઓ" : "Selected Menu Items"}
          </div>
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

      const slotName = slot === 'breakfast' ? (useGujarati ? 'સવારનું મેનુ (Morning)' : 'Morning Menu') :
        slot === 'lunch' ? (useGujarati ? 'બપોરનું મેનુ (Afternoon)' : 'Afternoon Menu') :
        slot === 'dinner' ? (useGujarati ? 'રાતનું મેનુ (Evening/Night)' : 'Evening / Night Menu') : 
        (useGujarati ? 'મેનુ' : 'Menu');

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
        </div>

        ${inquiry.message ? `
        <div class="section">
          <div class="section-title">
            ${useGujarati ? "વધારાનો સંદેશ" : "Additional Message"}
          </div>
          <div class="info-item">
            <div class="info-value">${inquiry.message}</div>
          </div>
        </div>` : ""}

        <div class="footer">
          <strong>${useGujarati ? "જનરેટ કરવામાં આવ્યું" : "Generated on"}:</strong> 
          ${new Date().toLocaleString(useGujarati ? "gu-IN" : "en-IN")}<br>
          <em>${useGujarati ? "આ દસ્તાવેજ પાયલ કેટરિંગ દ્વારા આપમેળે જનરેટ કરવામાં આવ્યો છે." : "This document was automatically generated by Payal Catering."}</em>
        </div>
      </body>
      </html>
    `

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 10000);
      };
    } else {
      // Fallback: create a blob and download as HTML
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const filename = useGujarati
        ? `કસ્ટમ_મેનુ_પૂછપરછ_${inquiry.name}_${inquiry.id.substring(0, 8)}.html`
        : `Custom_Menu_Inquiry_${inquiry.name}_${inquiry.id.substring(0, 8)}.html`

      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const adminCards = [
    {
      title: "General Inquiries",
      description: "View and respond to contact messages",
      icon: MessageSquare,
      href: "/admin/inquiries?type=general",
      color: "bg-blue-500",
    },
    {
      title: "Menu Inquiries",
      description: "Manage custom menu builder requests",
      icon: FileText,
      href: "/admin/inquiries?type=custom_menu",
      color: "bg-[#d97706]",
    },
    {
      title: "Menu Categories",
      description: "Organize items into groups",
      icon: MenuIcon,
      href: "/admin/menu-categories",
      color: "bg-amber-500",
    },
    {
      title: "Menu Items",
      description: "Manage individual food items",
      icon: Edit,
      href: "/admin/menu-items",
      color: "bg-green-500",
    },
    {
      title: "Events",
      description: "Manage upcoming celebrations",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-red-500",
    },
    {
      title: "Material Calculator",
      description: "Calculate grocery lists for guests",
      icon: Calculator,
      href: "/admin/materials",
      color: "bg-amber-600",
    },
    {
      title: "Photo Management",
      description: "Organize food photos",
      icon: ImageIcon,
      href: "/admin/photos",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200">
      {/* Header */}
      <header className="bg-[#18181b] shadow-sm border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your Payal Catering website</p>
            </div>
            <Button asChild>
              <Link href="/">View Website</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#18181b] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-[#d97706]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? "..." : stats.totalInquiries}</div>
              <p className="text-xs text-gray-500">{stats.pendingInquiries} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Custom Menu Requests</CardTitle>
              <FileText className="h-4 w-4 text-[#d97706]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? "..." : stats.customMenuInquiries}</div>
              <p className="text-xs text-gray-500">Special menu requests</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Menu Items</CardTitle>
              <MenuIcon className="h-4 w-4 text-[#d97706]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? "..." : stats.totalMenuItems}</div>
              <p className="text-xs text-gray-500">{stats.totalCategories} categories</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181b] border-[#27272a]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Events</CardTitle>
              <Calendar className="h-4 w-4 text-[#d97706]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{isLoading ? "..." : stats.totalEvents}</div>
              <p className="text-xs text-gray-500">Upcoming events</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminCards.map((card, index) => (
            <Card key={index} className="bg-[#18181b] border-[#27272a] hover:border-[#d97706]/50 hover:shadow-lg hover:shadow-[#d97706]/5 transition-all cursor-pointer group">
              <Link href={card.href}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-[#0f0f11] border border-[#27272a] group-hover:border-[#d97706] transition-colors`}>
                      <card.icon className="h-6 w-6 text-[#d97706]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white font-serif">{card.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-400">{card.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Recent Inquiries */}
        <Card className="bg-[#18181b] border-[#27272a]">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-serif text-white">Recent Inquiries</CardTitle>
                <CardDescription className="text-gray-400">Latest customer inquiries and requests</CardDescription>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706]"
                  />
                </div>
                <Input
                  type="date"
                  value={eventDateFilter}
                  onChange={(e) => setEventDateFilter(e.target.value)}
                  className="w-40 bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706]"
                  style={{ colorScheme: "dark" }}
                />
                {(searchTerm || eventDateFilter) && (
                  <Button variant="outline" size="icon" onClick={handleClearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97706]"></div>
              </div>
            ) : inquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {searchTerm || eventDateFilter ? "No inquiries match your filters." : "No inquiries found."}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#27272a] hover:bg-[#27272a]/30">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Event Date</TableHead>
                    <TableHead className="text-gray-400">Guests</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry: any) => (
                    <TableRow key={inquiry.id} className="border-[#27272a] hover:bg-[#27272a]/30">
                      <TableCell className="font-medium text-white">{inquiry.name}</TableCell>
                      <TableCell>
                        <Badge className={inquiry.type === "custom_menu" ? "bg-[#d97706] text-black hover:bg-[#b45309]" : "bg-[#27272a] text-gray-300 hover:bg-[#404040]"}>
                          {inquiry.type === "custom_menu" ? "Custom Menu" : "General"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {inquiry.event_date ? new Date(inquiry.event_date).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">{inquiry.guest_count || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            inquiry.status === "pending"
                              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/50 border"
                              : inquiry.status === "in_progress"
                                ? "bg-[#d97706]/20 text-[#d97706] hover:bg-[#d97706]/30 border-[#d97706]/50 border"
                                : "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/50 border"
                          }
                          variant="outline"
                        >
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {inquiry.type === "custom_menu" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEditCustomMenu(inquiry)} className="bg-[#0f0f11] border-[#27272a] text-gray-300 hover:text-white hover:border-[#d97706]">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit Menu
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => downloadCustomMenuPdf(inquiry)} className="bg-[#0f0f11] border-[#27272a] text-gray-300 hover:text-white hover:border-[#d97706]">
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#0f0f11] border-[#27272a] text-gray-300 hover:text-[#d97706] hover:border-[#d97706]"
                            onClick={() =>
                              updateInquiryStatus(
                                inquiry.id,
                                inquiry.status === "pending" ? "in_progress" : "completed",
                              )
                            }
                          >
                            {inquiry.status === "pending" ? "Start" : "Complete"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteInquiry(inquiry.id)} className="bg-[#0f0f11] border-[#27272a] text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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
