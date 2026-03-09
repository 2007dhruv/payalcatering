"use client"

import { useState, useMemo } from "react"
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    parseISO
} from "date-fns"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Info,
    Edit,
    Download,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface MenuInquiryCalendarProps {
    inquiries: any[]
    onEdit: (inquiry: any) => void
    onDownload: (inquiry: any) => void
}

export default function MenuInquiryCalendar({ inquiries, onEdit, onDownload }: MenuInquiryCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [isDayDetailOpen, setIsDayDetailOpen] = useState(false)

    // Memoize grouped inquiries by date
    const inquiriesByDate = useMemo(() => {
        const groups: Record<string, any[]> = {}
        inquiries.forEach(inquiry => {
            if (inquiry.event_date) {
                const dateKey = format(parseISO(inquiry.event_date), 'yyyy-MM-dd')
                if (!groups[dateKey]) groups[dateKey] = []
                groups[dateKey].push(inquiry)
            }
        })
        return groups
    }, [inquiries])

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="bg-[#18181b] border-[#27272a] text-gray-400">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date())} className="bg-[#18181b] border-[#27272a] text-gray-400 text-xs px-2 w-auto">
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="bg-[#18181b] border-[#27272a] text-gray-400">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ""

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d")
                const cloneDay = day
                const dateKey = format(day, 'yyyy-MM-dd')
                const dayInquiries = inquiriesByDate[dateKey] || []

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[100px] border border-[#27272a] p-2 transition-colors cursor-pointer hover:bg-[#27272a]/20 ${!isSameMonth(day, monthStart) ? "bg-[#0f0f11]/50 text-gray-600" : "bg-[#18181b] text-white"
                            } ${isSameDay(day, new Date()) ? "ring-1 ring-inset ring-[#d97706]" : ""}`}
                        onClick={() => {
                            setSelectedDate(cloneDay)
                            if (dayInquiries.length > 0) setIsDayDetailOpen(true)
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <span className={`text-xs font-medium ${isSameDay(day, new Date()) ? "text-[#d97706]" : ""}`}>
                                {formattedDate}
                            </span>
                            {dayInquiries.length > 0 && (
                                <Badge className="h-5 px-1.5 min-w-[20px] justify-center text-[10px] bg-[#d97706] text-black border-none">
                                    {dayInquiries.length}
                                </Badge>
                            )}
                        </div>
                        <div className="mt-2 space-y-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                            {dayInquiries.slice(0, 3).map((inq, idx) => (
                                <div
                                    key={inq.id}
                                    className={`text-[10px] truncate px-1 rounded-sm py-0.5 ${inq.status === 'completed'
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        }`}
                                >
                                    {inq.name}
                                </div>
                            ))}
                            {dayInquiries.length > 3 && (
                                <div className="text-[9px] text-gray-500 text-center">
                                    +{dayInquiries.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            )
            days = []
        }
        return <div className="border border-[#27272a] rounded-lg overflow-hidden">{rows}</div>
    }

    const selectedDateInquiries = selectedDate
        ? inquiriesByDate[format(selectedDate, 'yyyy-MM-dd')] || []
        : []

    return (
        <div className="w-full">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30"></div>
                    <span>Saved Menu</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
                    <span>Accepted Menu</span>
                </div>
            </div>

            {/* Day Detail Dialog */}
            <Dialog open={isDayDetailOpen} onOpenChange={setIsDayDetailOpen}>
                <DialogContent className="max-w-md bg-[#18181b] border-[#27272a] text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-[#d97706]" />
                            {selectedDate && format(selectedDate, "EEEE, MMMM do")}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedDateInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="p-4 bg-[#0f0f11] border border-[#27272a] rounded-lg space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-white">{inquiry.name}</h4>
                                        <p className="text-xs text-gray-500">{inquiry.email}</p>
                                    </div>
                                    <Badge className={
                                        inquiry.status === "pending"
                                            ? "bg-red-500/20 text-red-500 border-red-500/50"
                                            : inquiry.status === "in_progress"
                                                ? "bg-amber-500/20 text-amber-500 border-amber-500/50"
                                                : "bg-emerald-500/20 text-emerald-500 border-emerald-500/50"
                                    }>
                                        {inquiry.status}
                                    </Badge>
                                </div>

                                <div className="text-sm text-gray-400">
                                    <span className="font-medium text-gray-300">Event:</span> {inquiry.event_type || 'Custom'}
                                    {inquiry.event_time && <span className="ml-2">• {inquiry.event_time}</span>}
                                </div>

                                {inquiry.selected_menu_items && (
                                    <div className="text-xs text-gray-500">
                                        <span className="text-[#d97706]">{inquiry.selected_menu_items.length} items</span> in menu
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsDayDetailOpen(false)
                                            onEdit(inquiry)
                                        }}
                                        className="flex-1 bg-[#18181b] border-[#27272a] text-gray-300 h-8"
                                    >
                                        <Edit className="h-3 w-3 mr-1.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDownload(inquiry)}
                                        className="bg-[#18181b] border-[#27272a] text-gray-300 h-8"
                                    >
                                        <Download className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
        </div>
    )
}
