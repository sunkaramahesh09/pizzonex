# Pizzonex 🍕

A modern full-stack pizza delivery application with custom pizza builder, inventory management, and secure online payments.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui

**Backend:** Node.js, Express, MongoDB

## Project Structure

```
pizzonex/
├── frontend/    # React + Vite frontend
└── backend/     # Express + MongoDB API server
```

## Getting Started

### Backend

```sh
cd backend
npm install
node seed.js     # Seeds DB with pizzas, ingredients & admin user
node index.js    # Starts API server on port 5001
```

### Frontend

```sh
cd frontend
npm install
npm run dev      # Starts dev server on port 8080
```

## Features

- 🍕 Custom pizza builder with real-time preview
- 🛒 Shopping cart with seamless checkout
- 📦 Order tracking with status updates
- 🔐 User authentication (login, register, email verification)
- 📊 Admin dashboard with inventory management
- 📋 Admin order management
