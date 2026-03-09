# 🍽️ Payal Catering — Official Website

> Rajkot's most trusted catering service for weddings, functions & corporate events.  
> Built with **Next.js 15**, **MySQL**, and deployed on **DigitalOcean**.

---

## ✨ Features

- 🌐 **Bilingual** — English & Gujarati (ગુજરાતી)
- 📋 **Dynamic Menu** — Admin-managed menu categories & items
- 📸 **Photo Gallery** — Event photo management
- 📅 **Event Listings** — Featured events showcase
- 📩 **Inquiry System** — Contact & custom menu request forms
- 🔐 **Admin Panel** — Manage menus, events, inquiries & photos
- 🔍 **SEO Optimized** — Local SEO for Rajkot & Saurashtra
- 📱 **Fully Responsive** — Mobile, tablet & desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MySQL 8 |
| ORM | mysql2 (raw queries + Server Actions) |
| Hosting | DigitalOcean App Platform |
| DB Hosting | DigitalOcean Managed MySQL |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/ddg06863/payalcatering.git
cd payalcatering
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
MYSQL_URI=mysql://root:@localhost:3306/payalcatering
DB_SSL=false
ADMIN_PASSWORD=your_admin_password
```

### 4. Set up the database

```bash
# Import schema into your local MySQL
mysql -u root payalcatering < mysql_schema.sql
```

### 5. Run the development server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
payalcatering/
├── app/
│   ├── page.tsx          # Homepage
│   ├── menu/             # Menu page
│   ├── events/           # Events page
│   ├── about/            # About page
│   ├── contact/          # Contact & inquiry form
│   ├── admin/            # Admin panel (protected)
│   ├── actions.ts        # Server Actions (DB operations)
│   ├── robots.ts         # SEO robots
│   └── sitemap.ts        # SEO sitemap
├── components/
│   ├── header.tsx        # Navigation with logo
│   ├── footer.tsx        # Footer
│   └── admin/            # Admin UI components
├── lib/
│   └── db.ts             # MySQL connection pool
├── public/
│   └── images/           # All images & logo
└── mysql_schema.sql      # Database schema
```

---

## 🌐 Deployment (DigitalOcean)

### Environment Variables (App Platform)

| Variable | Description |
|----------|-------------|
| `MYSQL_URI` | Full MySQL connection string |
| `DB_SSL` | Set to `true` for DigitalOcean Managed MySQL |
| `ADMIN_PASSWORD` | Password for admin panel access |

### Deploy

1. Push to GitHub → `git push origin main`
2. DigitalOcean App Platform **auto-redeploys** on every push ✅

---

## 📞 Contact

**Payal Catering** — Rajkot, Gujarat  
📍 Purusharth Society, Haridhva Road, opp. Balaji Temple, Rajkot - 360002  
📱 +91 97147 99377  
📱 +91 93136 77629 (WhatsApp)  
📧 info@payalcatering.com
