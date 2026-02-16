# Internal Management System (Frontend)

## 📌 Overview

### 🎯 Purpose

This system was built to improve my team’s workflow efficiency.

Previously, card creation was done manually using Photoshop. Each card had to be designed individually, and the print layout had to be prepared manually every time. This process was time-consuming, repetitive, and prone to human error.

To solve this problem, I decided to build a system that can:

- Automatically generate cards
- Provide a ready-to-print layout
- Reduce manual design work
- Improve speed and operational efficiency

The system allows users to generate cards instantly using predefined templates, eliminating the need for manual layout adjustments.

After completing the core Card Generator module, I decided to expand the system by adding additional modules such as Staff Management, Roster Management, ISP Management, and Building Management to make it a more complete internal operational system.

This project is currently under active development.

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
## Back End repo : https://github.com/CheaSeyha/internal_management_system_api
------------------------------------------------------------------------

# 🚀 Current Modules

## 🖨️ Card Generator (Completed Core Functionality)

-   Auto-generate printable card layout
-   Chat Feature bot read chat message from telegram group
-   Ready-to-print card template
-   Track who created each card
-   Card income analytics
-   Maintain card generation history

This is the most stable and functional module in the system.

------------------------------------------------------------------------

## 🏢 Building Management (CRUD Available)

-   Create building records
-   Update building information
-   Delete building entries
-   View building list

Core CRUD functionality is implemented.

------------------------------------------------------------------------

# 🚧 Modules Under Development

The following modules are NOT completed yet and are still under
development:

## 👥 Staff Management (In Progress)

-   Staff creation and editing (partial)
-   Role and permission integration (not completed)
-   Data validation improvements pending

## 📅 Staff Roster Management (In Progress)

-   Shift scheduling logic under development
-   UI structure created
-   Full workflow not finalized

## 🌐 ISP Management (In Progress)

-   Upgrade / downgrade logic not fully implemented
-   Stop / resume tracking under development
-   Service history tracking incomplete

⚠️ These modules are functional only partially and may contain
unfinished features or temporary logic.

------------------------------------------------------------------------

# 🔐 Authentication & Access Control

-   Role-based access structure implemented (basic level)
-   Protected routes
-   API integration using Axios

Further security enhancements planned.
---

# 🛠️ Project Structure

    src/
    │
    ├── assets/
    │   └── CardTamplete/
    ├── components/
    ├── pages/
    ├── services/
    ├── hooks/
    ├── context/
    └── App.jsx

------------------------------------------------------------------------

# ⚙️ Installation

Clone repository:

    git clone <your-repository-url>

Install dependencies:

    npm install

Run development server:

    npm run dev

------------------------------------------------------------------------

# 🏗️ Production Build

    npm run build

Preview build:

    npm run preview

------------------------------------------------------------------------

# 📈 Planned Improvements

-   Complete Staff Management module
-   Finalize Roster scheduling logic
-   Finish ISP tracking workflow
-   Add export reporting (PDF / Excel)
-   Improve analytics dashboard
-   Add audit logging

------------------------------------------------------------------------

# 👨‍💻 Development Status

This project is an active development project and not a finalized
production-ready system.

Some modules are stable (Card Generator, Building CRUD), while others
remain under construction.

------------------------------------------------------------------------

# 🎨 Customizing Card Template

If you want to use your own customize card design you can replacing the template image and adjusting text positioning.

---

## 🖼️ 1. Replace Card Template Design

To change the card background design:

Navigate to:

src/assets/CardTamplete/


Replace the existing template image with your own design.

### 📏 Card Size Requirement

- Card size must be **6cm × 9cm**
- Maintain correct aspect ratio
- Use high-resolution image for better print quality

⚠️ It is recommended to keep the same filename to avoid modifying import paths in the code.

After replacing the image, restart the development server:

npm run dev

---

## ✏️ 2. Adjust Text Position & Size

If text elements (name, ID, etc.) do not align properly with your new design:

Navigate to:

src/pages/CardGenerator/components/VIP.jsx


Inside this file, adjust the following properties:

- `top` position
- `left` position
- `text size`

Example:

```jsx
<div className="absolute top-[120px] left-[80px] text-[14px]">
  {userName}
</div>
You may modify:

top-[value]

left-[value]

text-[size]

Adjust these values until the text aligns correctly with your template layout.
```
# Author

Developed by: Chea Seyha
Full Stack Developer (React.js Laravel)

