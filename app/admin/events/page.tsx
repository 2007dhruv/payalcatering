"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Pencil, Trash2, Calendar, MapPin, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { getEventsAction, saveEventAction, deleteEventAction } from "@/app/actions"
import Image from "next/image"

export default function AdminEventsPage() {
    const { language } = useLanguage()
    const [events, setEvents] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const [currentEvent, setCurrentEvent] = useState<any>({
        title_en: "",
        title_gu: "",
        description_en: "",
        description_gu: "",
        location_en: "",
        location_gu: "",
        event_date: "",
        image_url: "",
        images: [],
        video_url: "",
        quote_en: "",
        quote_gu: "",
        menu_highlights: [],
        is_featured: false,
        is_active: true
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        const { data } = await getEventsAction()
        if (data) setEvents(data)
    }

    const handleEdit = (event: any) => {
        // Format date for input field
        const formattedEvent = { ...event }
        if (formattedEvent.event_date) {
            formattedEvent.event_date = new Date(formattedEvent.event_date).toISOString().split('T')[0]
        }

        // Ensure booleans for checkboxes
        formattedEvent.is_featured = Boolean(formattedEvent.is_featured)
        formattedEvent.is_active = Boolean(formattedEvent.is_active)

        // Ensure arrays
        if (!Array.isArray(formattedEvent.images)) {
            formattedEvent.images = [];
        }
        if (!Array.isArray(formattedEvent.menu_highlights)) {
            formattedEvent.menu_highlights = [];
        }

        setCurrentEvent(formattedEvent)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            await deleteEventAction(id)
            fetchEvents()
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        setIsUploading(true)

        try {
            const uploadedUrls: string[] = []

            for (const file of files) {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("title", currentEvent.title_en || 'event')

                const response = await fetch("/api/upload-event-image", {
                    method: "POST",
                    body: formData,
                })

                const result = await response.json()

                if (result.success) {
                    uploadedUrls.push(result.url)
                } else {
                    console.error("Upload failed for a file:", result.message)
                }
            }

            if (uploadedUrls.length > 0) {
                if (isGallery) {
                    setCurrentEvent((prev: any) => ({
                        ...prev,
                        images: [...(prev.images || []), ...uploadedUrls]
                    }))
                } else {
                    setCurrentEvent((prev: any) => ({
                        ...prev,
                        image_url: uploadedUrls[0]
                    }))
                }
            } else {
                alert("Failed to upload image(s)")
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload image(s)")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const removeGalleryImage = (indexToRemove: number) => {
        setCurrentEvent((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, index: number) => index !== indexToRemove)
        }))
    }

    const handleMenuHighlightChange = (index: number, field: string, value: string) => {
        const newHighlights = [...(currentEvent.menu_highlights || [])];
        if (!newHighlights[index]) newHighlights[index] = { title_en: "", title_gu: "", description_en: "", description_gu: "", image_url: "" };
        newHighlights[index][field] = value;
        setCurrentEvent({ ...currentEvent, menu_highlights: newHighlights });
    }

    const handleHighlightImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", `highlight-${index}`);

            const response = await fetch("/api/upload-event-image", { method: "POST", body: formData });
            const result = await response.json();

            if (result.success) {
                handleMenuHighlightChange(index, "image_url", result.url);
            } else {
                alert("Upload failed: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    }

    const addMenuHighlight = () => {
        if ((currentEvent.menu_highlights || []).length >= 3) return;
        setCurrentEvent({ ...currentEvent, menu_highlights: [...(currentEvent.menu_highlights || []), { title_en: "", title_gu: "", description_en: "", description_gu: "" }] });
    }

    const removeMenuHighlight = (index: number) => {
        const newHighlights = [...(currentEvent.menu_highlights || [])];
        newHighlights.splice(index, 1);
        setCurrentEvent({ ...currentEvent, menu_highlights: newHighlights });
    }

    const handleSave = async () => {
        if (!currentEvent.title_en || currentEvent.title_en.trim() === "") {
            alert("Please provide at least an English Title for the event.");
            return;
        }

        try {
            const payload: any = { ...currentEvent }
            const id = payload.id
            delete payload.id
            delete payload.created_at
            delete payload.updated_at

            // Convert date string if empty to null
            if (!payload.event_date) {
                payload.event_date = null
            }

            // Stringify JSON arrays
            if (Array.isArray(payload.images)) {
                payload.images = JSON.stringify(payload.images)
            } else {
                payload.images = JSON.stringify([])
            }
            if (Array.isArray(payload.menu_highlights)) {
                payload.menu_highlights = JSON.stringify(payload.menu_highlights)
            } else {
                payload.menu_highlights = JSON.stringify([])
            }

            await saveEventAction(payload, id)
            setIsDialogOpen(false)
            fetchEvents()

            // Reset form
            setCurrentEvent({
                title_en: "",
                title_gu: "",
                description_en: "",
                description_gu: "",
                location_en: "",
                location_gu: "",
                event_date: "",
                image_url: "",
                images: [],
                video_url: "",
                quote_en: "",
                quote_gu: "",
                menu_highlights: [],
                is_featured: false,
                is_active: true
            })
        } catch (error) {
            console.error("Error saving event:", error)
            alert("Failed to save event. Check console for details.")
        }
    }

    return (
        <div className="space-y-6 min-h-screen bg-[#0f0f11] text-gray-200">
            <div className="flex justify-between items-center bg-[#18181b] p-4 sm:p-6 rounded-lg shadow-sm border border-[#27272a]">
                <h1 className="text-2xl font-serif font-bold text-white">Manage Events</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-[#d97706] hover:bg-[#b45309] text-black"
                            onClick={() => {
                                setCurrentEvent({
                                    title_en: "",
                                    title_gu: "",
                                    description_en: "",
                                    description_gu: "",
                                    location_en: "",
                                    location_gu: "",
                                    event_date: "",
                                    image_url: "",
                                    images: [],
                                    video_url: "",
                                    quote_en: "",
                                    quote_gu: "",
                                    menu_highlights: [],
                                    is_featured: false,
                                    is_active: true
                                })
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#18181b] border-[#27272a] text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-serif">{currentEvent.id ? "Edit Event" : "Add New Event"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">

                            {/* Image Upload section */}
                            <div className="grid gap-2">
                                <Label className="text-gray-300">Event Cover Image</Label>
                                <div className="flex items-center gap-4">
                                    {currentEvent.image_url && (
                                        <div className="relative w-32 h-24 border border-[#27272a] rounded overflow-hidden">
                                            <Image
                                                src={currentEvent.image_url}
                                                alt="Event cover preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, false)}
                                            ref={fileInputRef}
                                            disabled={isUploading}
                                            className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706] text-gray-300"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {isUploading ? "Uploading..." : "Leave empty to keep existing image."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Images section */}
                            <div className="grid gap-2">
                                <Label className="text-gray-300">Event Gallery Images</Label>
                                <div className="space-y-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, true)}
                                        disabled={isUploading}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706] text-gray-300"
                                    />
                                    {isUploading && <p className="text-xs text-gray-500">Uploading files...</p>}
                                    {currentEvent.images && currentEvent.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {currentEvent.images.map((img: string, idx: number) => (
                                                <div key={idx} className="relative w-20 h-20 border border-[#27272a] rounded overflow-hidden group">
                                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                                    <button
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Video URL section */}
                            <div className="grid gap-2">
                                <Label htmlFor="video_url" className="text-gray-300">Video URL (YouTube link or MP4)</Label>
                                <Input
                                    id="video_url"
                                    value={currentEvent.video_url || ""}
                                    placeholder="https://youtube.com/watch?v=..."
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, video_url: e.target.value })}
                                    className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title_en" className="text-gray-300">Title (English)</Label>
                                    <Input
                                        id="title_en"
                                        value={currentEvent.title_en}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, title_en: e.target.value })}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title_gu" className="text-gray-300">Title (Gujarati)</Label>
                                    <Input
                                        id="title_gu"
                                        value={currentEvent.title_gu}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, title_gu: e.target.value })}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="location_en" className="text-gray-300">Location (English)</Label>
                                    <Input
                                        id="location_en"
                                        value={currentEvent.location_en}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, location_en: e.target.value })}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location_gu" className="text-gray-300">Location (Gujarati)</Label>
                                    <Input
                                        id="location_gu"
                                        value={currentEvent.location_gu}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, location_gu: e.target.value })}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="event_date" className="text-gray-300">Event Date</Label>
                                <Input
                                    id="event_date"
                                    type="date"
                                    value={currentEvent.event_date || ""}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, event_date: e.target.value })}
                                    className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    style={{ colorScheme: "dark" }}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description_en" className="text-gray-300">Description (English)</Label>
                                <Textarea
                                    id="description_en"
                                    value={currentEvent.description_en || ""}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, description_en: e.target.value })}
                                    rows={3}
                                    className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description_gu" className="text-gray-300">Description (Gujarati)</Label>
                                <Textarea
                                    id="description_gu"
                                    value={currentEvent.description_gu || ""}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, description_gu: e.target.value })}
                                    rows={3}
                                    dir="ltr"
                                    className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="quote_en" className="text-gray-300">Pull Quote (English)</Label>
                                    <Input
                                        id="quote_en"
                                        value={currentEvent.quote_en || ""}
                                        placeholder="e.g. A fusion of contemporary art..."
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, quote_en: e.target.value })}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="quote_gu" className="text-gray-300">Pull Quote (Gujarati)</Label>
                                    <Input
                                        id="quote_gu"
                                        value={currentEvent.quote_gu || ""}
                                        onChange={(e) => setCurrentEvent({ ...currentEvent, quote_gu: e.target.value })}
                                        className="bg-[#0f0f11] border-[#27272a] focus-visible:ring-[#d97706]"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 border border-[#27272a] p-4 rounded-md bg-[#18181b]">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold text-white">Menu Highlights (Max 3)</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addMenuHighlight}
                                        disabled={(currentEvent.menu_highlights || []).length >= 3}
                                        className="bg-[#0f0f11] border-[#27272a] text-gray-300 hover:text-white hover:border-[#d97706]"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Highlight
                                    </Button>
                                </div>
                                {(currentEvent.menu_highlights || []).map((highlight: any, idx: number) => (
                                    <div key={idx} className="grid gap-4 border border-[#27272a] p-4 rounded-md relative bg-[#0f0f11]">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/50"
                                            onClick={() => removeMenuHighlight(idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <h4 className="font-semibold text-sm text-gray-300">Item {idx + 1}</h4>
                                        <div className="grid gap-2 mb-2">
                                            <Label className="text-xs text-gray-400">Highlight Image</Label>
                                            <div className="flex items-center gap-4">
                                                {highlight.image_url ? (
                                                    <div className="relative w-16 h-16 border border-[#27272a] rounded overflow-hidden">
                                                        <Image src={highlight.image_url} alt="Highlight" fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-[#18181b] border border-[#27272a] rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                                                )}
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleHighlightImageUpload(e, idx)}
                                                    disabled={isUploading}
                                                    className="flex-1 bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Title (English)"
                                                value={highlight.title_en || ""}
                                                onChange={(e) => handleMenuHighlightChange(idx, "title_en", e.target.value)}
                                                className="bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                                            />
                                            <Input
                                                placeholder="Title (Gujarati)"
                                                value={highlight.title_gu || ""}
                                                onChange={(e) => handleMenuHighlightChange(idx, "title_gu", e.target.value)}
                                                className="bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <Textarea
                                                placeholder="Short Description (English)"
                                                value={highlight.description_en || ""}
                                                onChange={(e) => handleMenuHighlightChange(idx, "description_en", e.target.value)}
                                                rows={2}
                                                className="bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                                            />
                                            <Textarea
                                                placeholder="Short Description (Gujarati)"
                                                value={highlight.description_gu || ""}
                                                onChange={(e) => handleMenuHighlightChange(idx, "description_gu", e.target.value)}
                                                rows={2}
                                                className="bg-[#18181b] border-[#27272a] focus-visible:ring-[#d97706]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-6 mt-2 border-t border-[#27272a] pt-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={currentEvent.is_featured}
                                        onCheckedChange={(checked) => setCurrentEvent({ ...currentEvent, is_featured: checked as boolean })}
                                        className="border-[#d97706] data-[state=checked]:bg-[#d97706] data-[state=checked]:text-black"
                                    />
                                    <Label htmlFor="is_featured" className="text-gray-300">Featured Event</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={currentEvent.is_active}
                                        onCheckedChange={(checked) => setCurrentEvent({ ...currentEvent, is_active: checked as boolean })}
                                        className="border-[#d97706] data-[state=checked]:bg-[#d97706] data-[state=checked]:text-black"
                                    />
                                    <Label htmlFor="is_active" className="text-gray-300">Active (Visible)</Label>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-end space-x-2 pt-4 border-t border-[#27272a]">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-[#0f0f11] border-[#27272a] text-gray-300">
                                Cancel
                            </Button>
                            <Button className="bg-[#d97706] hover:bg-[#b45309] text-black" onClick={handleSave}>
                                Save Event
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-[#18181b] rounded-lg shadow-sm overflow-hidden border border-[#27272a]">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-[#18181b] border-b border-[#27272a]">
                            <TableRow className="border-[#27272a] hover:bg-[#27272a]/30">
                                <TableHead className="w-[100px] text-gray-400">Cover</TableHead>
                                <TableHead className="text-gray-400">Title</TableHead>
                                <TableHead className="text-gray-400">Date & Location</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                                <TableHead className="text-right text-gray-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id} className="hover:bg-[#27272a]/30 border-[#27272a]">
                                    <TableCell>
                                        <div className="relative w-16 h-12 rounded overflow-hidden border border-[#27272a]">
                                            <Image
                                                src={event.image_url || '/placeholder.svg?height=100&width=200'}
                                                alt={event.title_en}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-white">{language === "gu" ? event.title_gu : event.title_en}</div>
                                        <div className="text-sm text-gray-400 line-clamp-1">{language === "gu" ? event.description_gu : event.description_en}</div>
                                    </TableCell>
                                    <TableCell>
                                        {event.event_date && (
                                            <div className="flex items-center text-sm text-gray-300 mb-1">
                                                <Calendar className="w-3 h-3 mr-1.5 text-[#d97706]" />
                                                {new Date(event.event_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        {(event.location_en || event.location_gu) && (
                                            <div className="flex items-center text-sm text-gray-400">
                                                <MapPin className="w-3 h-3 mr-1.5" />
                                                {language === "gu" ? event.location_gu : event.location_en}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit border ${Boolean(event.is_active) ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' : 'bg-red-500/20 text-red-500 border-red-500/50'}`}>
                                                {Boolean(event.is_active) ? 'Active' : 'Hidden'}
                                            </span>
                                            {Boolean(event.is_featured) && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit bg-[#d97706]/20 text-[#d97706] border border-[#d97706]/50">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(event)} className="text-gray-400 hover:text-white hover:bg-[#27272a]">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/50"
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {events.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No events found. Click "Add Event" to create one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
