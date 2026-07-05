# UmaPOS

A lightweight, role-based Point of Sale system built for small retail shops (kiryana/general stores). Designed with local businesses in Pakistan in mind, with real-time inventory sync and a focus on simplicity over bloat.

**Live Demo:** [https://umapos.umairiqbal.tech](https://umapos.umairiqbal.tech)

## Features

- **Role-based access** — Admin and Cashier roles with protected routes
- **Sell screen** — Fast product selection, cart management, checkout
- **Inventory management** — Full CRUD for products with low-stock alerts
- **Admin dashboard** — Daily/weekly revenue, top-selling products, low-stock overview
- **Receipts** — Auto-generated printable receipts after checkout
- **Realtime sync** — Stock levels update live across devices via Supabase Realtime
- **Responsive design** — Works across desktop, tablet, and mobile

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Row Level Security)
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Supabase project

### Installation

```bash
git clone https://github.com/your-username/umapos.git
cd umapos
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL scripts in `/supabase` (schema + RLS policies) in your Supabase SQL editor to set up tables and permissions.

### Run Locally

```bash
npm run dev
```

## Roles

| Role    | Access                                      |
|---------|----------------------------------------------|
| Admin   | Dashboard, Inventory management, all sales data |
| Cashier | Sell screen only                              |

## Roadmap

- [ ] Multi-shop support
- [ ] Barcode scanner integration
- [ ] Customer credit (udhaar) tracking
- [ ] Offline mode (PWA)
- [ ] WhatsApp receipt sharing

## License

MIT

## Author

Built by Umair Iqbal — [GitHub](https://github.com/umair-iqbal-61)