# Internal Management System (Frontend)
## Back end repo https://github.com/CheaSeyha/internal_management_system_api
A React + Vite web application for managing internal operations such as **staff roster**, **building/rooms**, **ID card generation/printing**, **ISP/customer tracking**, and **staff management**.

## Features (Modules)

### 1) Staff Roster Management (In progress)
- View staff roster and working shifts in a calendar/table style UI.
- Upload/import roster data (UI supports file upload).

### 2) Building & Room Management (Completed)
- Create/Delete **Buildings**
- Create/Delete **Rooms** under a building

### 3) Card Generator (Auto layout + printing) (Completed)
- Auto-generate card layouts ready for printing
- Track who created cards
- Card listing with filters & delete
- Card summary/analytics

### 4) ISP Management / Internet Tracking (In progress)
- CRUD for ISP list
- Track customer internet status (upgrade/downgrade/stop connection) *(UI present; customer module depends on backend implementation)*

### 5) Staff Management (In progress)
- Add new staff
- List staff with pagination
---

## Tech Stack

- **React 18** + **Vite**
- **React Router**
- **Tailwind CSS** (+ DaisyUI)
- **Radix UI** components
- **Axios** with access-token injection + auto refresh retry logic
- **React Hook Form** + **Zod**
- **Recharts** (charts/analytics)
- **html-to-image / react-to-print** (printing/export)
- **Swiper**, **Framer Motion**

---

## Project Structure

```text
Internal Management System /
  src/
    api/axios.js                 # Axios instance + token + 401 retry
    auth/                        # Auth context + protected routes
    components/                  # Shared UI components
    pages/
      Auth/                      # Login
      RosterForm/                # Staff roster UI
      Blocks/                    # Building/Room management
      CardGenerator/             # Card generator + all cards + summary
      Internet/                  # ISP/customer pages
      StaffManage/               # Staff management (RBAC)
```

---
