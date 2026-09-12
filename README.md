# DineDesk – Restaurant Ordering & Management Platform
> **CodSoft Full Stack Web Development Internship – Task 2**

DineDesk is a full-stack, production-grade restaurant ordering and management web application. It offers digital dining experiences for customers, kitchen staff, and restaurant administrators.

---

## 🚀 Features

### 1. Customer Experience
- **Interactive Menu:** Filter by category, dietary tags (Veg, Spicy, Chef Special), search dishes, view preparation times.
- **Cart & Checkout:** Real-time cart calculation, taxes, delivery fee, dine-in/takeaway/delivery options, and order placement.
- **Order Tracking:** Live order status updates (Pending, Confirmed, Preparing, Ready, Delivered).
- **Table Reservation:** Interactive reservation system with party size selection, date/time pickers, and special requests.

### 2. Kitchen & Staff Dashboard (`/staff/dashboard`)
- Real-time order stream with 10-second polling.
- Kitchen display system to update order statuses: *Pending → Confirmed → Preparing → Out for Delivery / Ready → Completed*.

### 3. Admin Management Portal (`/admin/dashboard`)
- **Key Metrics:** Total revenue, orders, reservations, and customer counts.
- **Menu Management:** Add new dishes, toggle dish availability, update prices.
- **Order Overview:** Manage and review all platform orders.
- **Reservation Control:** Approve or cancel bookings.
- **User Management:** Manage customer and staff roles.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@dinedesk.com` | `admin123` |
| **Staff / Kitchen** | `staff@dinedesk.com` | `staff123` |
| **Customer** | `customer@dinedesk.com` | `customer123` |

*(1-Click login buttons are also available on the `/login` page)*

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mdhassanraza0879-sudo/codsoft_task_2.git
   cd codsoft_task_2
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Setup Environment Variables:
   - Backend: Copy `backend/.env.example` to `backend/.env` and update your PostgreSQL `DATABASE_URL`.
   - Frontend: Copy `frontend/.env.example` to `frontend/.env.local`.

4. Run Database Migrations & Seed:
   ```bash
   npm run seed
   ```

5. Start the Development Servers:
   ```bash
   npm run dev
   ```

- Frontend runs at: `http://localhost:3000`
- Backend runs at: `http://localhost:5000`
