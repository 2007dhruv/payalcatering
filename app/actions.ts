"use server"

import { db } from "@/lib/db"
import crypto from 'crypto'

const sanitize = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') return Number(value);
        return value;
    }));
};

export async function getDashboardStats() {
    const [[{ count: totalInquiries }]] = await db.query("SELECT COUNT(*) as count FROM contact_inquiries") as any;
    const [[{ count: pendingInquiries }]] = await db.query("SELECT COUNT(*) as count FROM contact_inquiries WHERE status = 'pending'") as any;
    const [[{ count: totalMenuItems }]] = await db.query("SELECT COUNT(*) as count FROM menu_items") as any;
    const [[{ count: totalEvents }]] = await db.query("SELECT COUNT(*) as count FROM events") as any;
    const [[{ count: customMenuInquiries }]] = await db.query("SELECT COUNT(*) as count FROM contact_inquiries WHERE type = 'custom_menu'") as any;
    const [[{ count: totalCategories }]] = await db.query("SELECT COUNT(*) as count FROM menu_categories") as any;
    const [[{ count: materialTemplates }]] = await db.query("SELECT COUNT(*) as count FROM material_templates") as any;

    return sanitize({
        totalInquiries,
        pendingInquiries,
        totalMenuItems,
        totalEvents,
        customMenuInquiries,
        totalCategories,
        materialTemplates
    })
}

export async function getInquiries(searchTerm: string, eventDateFilter: string, limit: number = 10, type?: string, status?: string) {
    let query = "SELECT * FROM contact_inquiries";
    const params: any[] = [];
    const checks: string[] = [];

    if (searchTerm) {
        checks.push("name LIKE ?");
        params.push(`%${searchTerm}%`);
    }
    if (eventDateFilter) {
        checks.push("event_date = ?");
        params.push(eventDateFilter);
    }
    if (type && type !== "all") {
        checks.push("type = ?");
        params.push(type);
    }
    if (status && status !== "all") {
        checks.push("status = ?");
        params.push(status);
    }

    if (checks.length > 0) {
        query += " WHERE " + checks.join(" AND ");
    }

    query += " ORDER BY created_at DESC";
    if (limit > 0) {
        query += ` LIMIT ${limit}`;
    }

    const [rows] = await db.query(query, params) as any;
    const parsedRows = rows.map((row: any) => {
        if (typeof row.selected_menu_items === 'string') {
            try {
                row.selected_menu_items = JSON.parse(row.selected_menu_items);
            } catch (e) {
                row.selected_menu_items = [];
            }
        }
        return row;
    });
    return { data: sanitize(parsedRows) };
}

export async function updateInquiryStatusAction(id: string, status: string) {
    try {
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.execute("UPDATE contact_inquiries SET status = ?, updated_at = ? WHERE id = ?", [status, updated_at, id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteInquiryAction(id: string) {
    try {
        await db.execute("DELETE FROM contact_inquiries WHERE id = ?", [id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveCustomMenuAction(id: string, selectedItems: any[]) {
    try {
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.execute("UPDATE contact_inquiries SET selected_menu_items = ?, updated_at = ? WHERE id = ?", [JSON.stringify(selectedItems), updated_at, id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function submitInquiryAction(formData: any) {
    try {
        const id = crypto.randomUUID();
        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const updated_at = created_at;

        // Allowed columns in the contact_inquiries table
        const allowedColumns = [
            'id', 'name', 'email', 'phone', 'event_type', 'event_date', 
            'guest_count', 'message', 'status', 'type', 'selected_menu_items', 
            'event_address', 'event_time', 'event_time_custom', 'created_at', 
            'updated_at', 'breakfast_count', 'lunch_count', 'dinner_count', 'language'
        ];

        let type = formData.type || 'general';
        const columns = ['id', 'created_at', 'updated_at', 'type'];
        const values: any[] = [id, created_at, updated_at, type];
        const placeholders = ['?', '?', '?', '?'];

        const processedData = { ...formData };
        
        // Ensure numeric counts are actually numbers or null (not empty strings)
        ['guest_count', 'breakfast_count', 'lunch_count', 'dinner_count'].forEach(field => {
            if (processedData[field] === '' || processedData[field] === undefined || processedData[field] === null) {
                processedData[field] = 0;
            } else {
                processedData[field] = Number.parseInt(processedData[field]);
            }
        });

        const fieldsToExclude = ['id', 'created_at', 'updated_at', 'type'];
        for (const [key, value] of Object.entries(processedData)) {
            if (fieldsToExclude.includes(key)) continue;
            if (!allowedColumns.includes(key)) continue; // Filter out unknown columns

            let finalValue: any = value;
            
            // Convert empty strings to null for optional database columns
            if (finalValue === "") {
                finalValue = null;
            }

            if (key === 'selected_menu_items' && value) {
                finalValue = JSON.stringify(value);
            }

            columns.push(key);
            values.push(finalValue);
            placeholders.push('?');
        }

        const query = `INSERT INTO contact_inquiries (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
        await db.execute(query, values);
        return { error: null };
    } catch (error: any) {
        console.error("Database Error:", error);
        return { error: error.message };
    }
}


export async function getEventsAction() {
    const [rows] = await db.query("SELECT * FROM events ORDER BY event_date DESC") as any;
    const parsedRows = rows.map((row: any) => {
        if (typeof row.images === 'string') {
            try { row.images = JSON.parse(row.images); } catch (e) { row.images = []; }
        }
        if (typeof row.menu_highlights === 'string') {
            try { row.menu_highlights = JSON.parse(row.menu_highlights); } catch (e) { row.menu_highlights = []; }
        }
        return row;
    });
    return { data: sanitize(parsedRows) };
}

export async function getActiveEventsAction() {
    const [rows] = await db.query("SELECT * FROM events WHERE is_active = true ORDER BY event_date DESC") as any;
    const parsedRows = rows.map((row: any) => {
        if (typeof row.images === 'string') {
            try { row.images = JSON.parse(row.images); } catch (e) { row.images = []; }
        }
        if (typeof row.menu_highlights === 'string') {
            try { row.menu_highlights = JSON.parse(row.menu_highlights); } catch (e) { row.menu_highlights = []; }
        }
        return row;
    });
    return { data: sanitize(parsedRows) };
}

export async function getFeaturedEventsAction() {
    const [rows] = await db.query("SELECT * FROM events WHERE is_featured = true AND is_active = true LIMIT 3") as any;
    const parsedRows = rows.map((row: any) => {
        if (typeof row.images === 'string') {
            try { row.images = JSON.parse(row.images); } catch (e) { row.images = []; }
        }
        if (typeof row.menu_highlights === 'string') {
            try { row.menu_highlights = JSON.parse(row.menu_highlights); } catch (e) { row.menu_highlights = []; }
        }
        return row;
    });
    return { data: sanitize(parsedRows) };
}

export async function deleteEventAction(id: string) {
    try {
        await db.execute("DELETE FROM events WHERE id = ?", [id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveEventAction(payload: any, id?: string) {
    try {
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (id) {
            const sets: string[] = [];
            const values: any[] = [];
            for (const [key, value] of Object.entries(payload)) {
                sets.push(`${key} = ?`);
                values.push(value);
            }
            sets.push(`updated_at = ?`);
            values.push(updated_at);
            values.push(id as any);
            await db.execute(`UPDATE events SET ${sets.join(', ')} WHERE id = ?`, values);
        } else {
            const newId = crypto.randomUUID();
            const columns = ['id', 'created_at', 'updated_at'];
            const values: any[] = [newId, updated_at, updated_at];
            const placeholders = ['?', '?', '?'];

            for (const [key, value] of Object.entries(payload)) {
                columns.push(key);
                values.push(value);
                placeholders.push('?');
            }
            await db.execute(`INSERT INTO events (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`, values);
        }
        return { error: null };
    } catch (error: any) {
        console.error(error);
        return { error: error.message };
    }
}

export async function getEventByIdAction(id: string) {
    try {
        const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]) as any;
        if (rows.length === 0) return { data: null, error: "Event not found" };
        const event = rows[0];
        if (typeof event.images === 'string') {
            try { event.images = JSON.parse(event.images); } catch (e) { event.images = []; }
        }
        if (typeof event.menu_highlights === 'string') {
            try { event.menu_highlights = JSON.parse(event.menu_highlights); } catch (e) { event.menu_highlights = []; }
        }
        return { data: sanitize(event), error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

export async function getMenuItemsAndCategoriesAction() {
    const [items] = await db.query(`
    SELECT mi.*, mc.name_en as category_name_en, mc.name_gu as category_name_gu 
    FROM menu_items mi 
    LEFT JOIN menu_categories mc ON mi.category_id = mc.id 
    ORDER BY mi.sort_order ASC
  `) as any;

    const formattedItems = items.map((item: any) => {
        const { category_name_en, category_name_gu, ...rest } = item;
        return {
            ...rest,
            menu_categories: category_name_en ? { id: item.category_id, name_en: category_name_en, name_gu: category_name_gu } : null
        }
    });

    const [categories] = await db.query("SELECT * FROM menu_categories ORDER BY sort_order ASC") as any;

    return sanitize({ itemsData: formattedItems, categoriesData: categories });
}

export async function deleteMenuItemAction(id: string) {
    try {
        await db.execute("DELETE FROM menu_items WHERE id = ?", [id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveMenuItemAction(payload: any, id?: string) {
    try {
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (id) {
            const sets: string[] = [];
            const values: any[] = [];
            for (const [key, value] of Object.entries(payload)) {
                sets.push(`${key} = ?`);
                values.push(value);
            }
            sets.push(`updated_at = ?`);
            values.push(updated_at);
            values.push(id as any);
            await db.execute(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = ?`, values);
        } else {
            const newId = crypto.randomUUID();
            const columns = ['id', 'created_at', 'updated_at'];
            const values: any[] = [newId, updated_at, updated_at];
            const placeholders = ['?', '?', '?'];

            for (const [key, value] of Object.entries(payload)) {
                columns.push(key);
                values.push(value);
                placeholders.push('?');
            }
            await db.execute(`INSERT INTO menu_items (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`, values);
        }
        return { error: null };
    } catch (error: any) {
        console.error(error);
        return { error: error.message };
    }
}

export async function getMenuCategoriesAction() {
    const [rows] = await db.query("SELECT * FROM menu_categories ORDER BY sort_order ASC") as any;
    return { data: sanitize(rows) };
}

export async function deleteMenuCategoryAction(id: string) {
    try {
        await db.execute("DELETE FROM menu_categories WHERE id = ?", [id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveMenuCategoryAction(payload: any, id?: string) {
    try {
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (id) {
            const sets: string[] = [];
            const values: any[] = [];
            for (const [key, value] of Object.entries(payload)) {
                sets.push(`${key} = ?`);
                values.push(value);
            }
            sets.push(`updated_at = ?`);
            values.push(updated_at);
            values.push(id as any);
            await db.execute(`UPDATE menu_categories SET ${sets.join(', ')} WHERE id = ?`, values);
        } else {
            const newId = crypto.randomUUID();
            const columns = ['id', 'created_at', 'updated_at'];
            const values: any[] = [newId, updated_at, updated_at];
            const placeholders = ['?', '?', '?'];

            for (const [key, value] of Object.entries(payload)) {
                columns.push(key);
                values.push(value);
                placeholders.push('?');
            }
            await db.execute(`INSERT INTO menu_categories (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`, values);
        }
        return { error: null };
    } catch (error: any) {
        console.error(error);
        return { error: error.message };
    }
}

export async function getPhotosAction() {
    try {
        const [rows] = await db.query("SELECT * FROM photos ORDER BY created_at DESC") as any;
        return { data: sanitize(rows), error: null };
    } catch (error: any) {
        return { data: [], error: error.message };
    }
}

export async function deletePhotoAction(id: string) {
    try {
        await db.execute("DELETE FROM photos WHERE id = ?", [id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function savePhotoAction(payload: any) {
    try {
        const id = crypto.randomUUID();
        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const columns = ['id', 'created_at', 'updated_at'];
        const values: any[] = [id, created_at, created_at];
        const placeholders = ['?', '?', '?'];

        for (const [key, value] of Object.entries(payload)) {
            columns.push(key);
            values.push(value);
            placeholders.push('?');
        }

        await db.execute(`INSERT INTO photos (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`, values);
        return { data: { id, ...payload, created_at }, error: null };
    } catch (error: any) {
        console.error("Database error saving photo", error);
        return { data: null, error: error.message };
    }
}

export async function getMaterialTemplatesAction() {
    try {
        const [rows] = await db.query("SELECT * FROM material_templates ORDER BY created_at DESC") as any;
        return { data: sanitize(rows), error: null };
    } catch (error: any) {
        return { data: [], error: error.message };
    }
}

export async function getMaterialItemsAction(templateId: string) {
    try {
        const [rows] = await db.query("SELECT * FROM material_items WHERE template_id = ? ORDER BY sort_order ASC", [templateId]) as any;
        return { data: sanitize(rows), error: null };
    } catch (error: any) {
        return { data: [], error: error.message };
    }
}

export async function saveMaterialTemplateAction(payload: any, id?: string) {
    try {
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (id) {
            const { items, ...templateData } = payload;
            const sets: string[] = [];
            const values: any[] = [];
            for (const [key, value] of Object.entries(templateData)) {
                sets.push(`${key} = ?`);
                values.push(value);
            }
            sets.push(`updated_at = ?`);
            values.push(updated_at);
            values.push(id as any);
            await db.execute(`UPDATE material_templates SET ${sets.join(', ')} WHERE id = ?`, values);

            if (items) {
                // Delete old items and insert new ones or sync them
                // Simplest is to delete and re-insert for now
                await db.execute("DELETE FROM material_items WHERE template_id = ?", [id]);
                for (const item of items) {
                    const itemId = crypto.randomUUID();
                    const itemData = {
                        id: itemId,
                        template_id: id,
                        ...item,
                        created_at: updated_at,
                        updated_at: updated_at
                    };
                    const columns = Object.keys(itemData);
                    const placeholders = columns.map(() => '?');
                    const itemValues = Object.values(itemData) as any[];
                    await db.execute(`INSERT INTO material_items (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`, itemValues);
                }
            }
        } else {
            const newId = crypto.randomUUID();
            const { items, ...templateData } = payload;
            const columns = ['id', 'created_at', 'updated_at'];
            const values: any[] = [newId, updated_at, updated_at];
            const placeholders = ['?', '?', '?'];

            for (const [key, value] of Object.entries(templateData)) {
                columns.push(key);
                values.push(value);
                placeholders.push('?');
            }
            await db.execute(`INSERT INTO material_templates (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`, values);

            if (items) {
                for (const item of items) {
                    const itemId = crypto.randomUUID();
                    const itemData = {
                        id: itemId,
                        template_id: newId,
                        ...item,
                        created_at: updated_at,
                        updated_at: updated_at
                    };
                    const iCols = Object.keys(itemData);
                    const iPlaceholders = iCols.map(() => '?');
                    const iValues = Object.values(itemData) as any[];
                    await db.execute(`INSERT INTO material_items (${iCols.join(', ')}) VALUES (${iPlaceholders.join(', ')})`, iValues);
                }
            }
        }
        return { error: null };
    } catch (error: any) {
        console.error(error);
        return { error: error.message };
    }
}

export async function deleteMaterialTemplateAction(id: string) {
    try {
        await db.execute("DELETE FROM material_templates WHERE id = ?", [id]);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}
