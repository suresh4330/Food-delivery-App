# Food Delivery App — Full-Stack MERN Platform

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)]()
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)]()
[![License MIT](https://img.shields.io/badge/License-MIT-00C853?style=flat-square)](https://github.com/suresh4330/Food-delivery-App)

Food Delivery App is a premium, production-grade **MERN stack application** with secure JWT authentication, real-time cart state management, location-based checkout, and a comprehensive admin dashboard. It dynamically serves restaurant menus, allows users to place and track orders securely, and provides restaurant administrators with powerful tools to manage food items and order lifecycles.

> **Repository:** [https://github.com/suresh4330/Food-delivery-App.git](https://github.com/suresh4330/Food-delivery-App.git)

---

## Table of Contents
1. [Overview](#overview)
2. [Feature Highlights](#feature-highlights)
3. [What's New](#whats-new)
4. [Resume Highlights](#resume-highlights)
5. [Screenshots](#screenshots)
6. [Tech Stack](#tech-stack)
7. [Architecture](#architecture)
8. [How It Works](#how-it-works)
9. [Project Structure](#project-structure)
10. [Environment Variables](#environment-variables)
11. [Run Locally](#run-locally)
12. [Run with Docker & Compose](#run-with-docker--compose)
13. [Troubleshooting](#troubleshooting)
14. [FAQ](#faq)
15. [Contributing](#contributing)
16. [Changelog](#changelog)
17. [Roadmap](#roadmap)
18. [Author](#author)
19. [License](#license)

---

## Overview

Food Delivery App helps users easily browse nearby restaurants, explore detailed menus, and order their favorite meals with a few clicks. It is designed to handle the entire lifecycle of a food order—from secure login and cart management to location selection and final checkout. Furthermore, it empowers platform administrators with a dedicated dashboard to update menus, track active orders, and update delivery statuses in real-time.

---

## Feature Highlights

### 🛒 Core Ordering System
- **Dynamic Cart Management**: Seamlessly add, remove, and adjust quantities of food items with real-time price calculation.
- **Restaurant & Menu Browsing**: Categorized views for restaurants and their specific menu items with high-quality imagery.
- **Order Tracking**: Users can view their past order history and track the status of current active deliveries.

### 📍 Location & Checkout
- **Interactive Map Picker**: Integrated mapping component allowing users to precisely pin their delivery location.
- **Secure Checkout**: Validates user carts, applies dynamic tax/delivery fees, and securely processes order placement.

### 🔐 Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct permissions for standard Users and platform Admins.
- **JWT Authorization**: Secure, stateless authentication using JSON Web Tokens and bcrypt password hashing.

### 📊 Admin Dashboard
- **Menu Management**: Admins can easily add, edit, or remove restaurants and specific food items.
- **Order Lifecycle Management**: View all platform orders and dynamically update their status (Pending -> Preparing -> Out for Delivery -> Delivered).

---

## What's New

### v1.0.0 — Launch of Core Platform

| Phase | Feature | Description |
|-------|---------|-------------|
| **1** | User Authentication | JWT-based secure login and registration system |
| **1** | Mongoose Schemas | Fully defined `User`, `Order`, `Restaurant`, and `FoodItem` models |
| **2** | State Management | Context API integration for global Auth, Cart, and Location state |
| **2** | Interactive Map | MapPicker component added to the checkout flow for precision routing |
| **3** | Admin Portal | Dedicated routes and UI for admins to oversee platform operations |
| **3** | API Routing | Modularized Express routes with middleware-based role protection |

---

## Resume Highlights

- **Built a production-grade Food Delivery Platform** powered by the MERN stack (MongoDB, Express, React, Node.js), enabling end-to-end order processing.
- **Designed a secure RESTful API architecture**: Implemented robust JWT-based authentication and role-based access control to securely segregate user and administrative privileges.
- **Engineered an interactive checkout flow**: Integrated a custom MapPicker component for accurate delivery location selection.
- **Developed a dynamic global state management system** using React Context API to handle complex shopping cart operations, user sessions, and localized data across the application.
- **Implemented a comprehensive Admin Dashboard** allowing real-time monitoring of order lifecycles and effortless CRUD management of restaurant menus.

---

## Screenshots

*(Replace these placeholders with actual application screenshots)*

| User Home / Restaurants | Shopping Cart |
| :---: | :---: |
| <img src="./screenshots/home.png?v=1787387086355" alt="Home Page" width="500"/> | <img src="./screenshots/cart.png?v=1787387086355" alt="Cart Page" width="500"/> |

| Interactive Checkout Map | Admin Dashboard |
| :---: | :---: |
| <img src="./screenshots/checkout.png?v=1787387086355" alt="Checkout Map" width="500"/> | <img src="./screenshots/admin.png?v=1787387086355" alt="Admin Dashboard" width="500"/> |

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Context API, CSS3
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcrypt.js
- **Database**: MongoDB (Atlas/Local), Mongoose ODM
- **Tools/Utilities**: Axios (HTTP client), ESLint

---

## Architecture

The application follows a standard **Client-Server Architecture**:
1. **Client (React/Vite)**: A Single Page Application (SPA) that handles the UI, routing, and global state (Auth, Cart, Location). Communicates with the backend via REST APIs using Axios.
2. **Server (Express/Node)**: A RESTful API that handles business logic, authenticates users (JWT), and interacts with the database. Middleware functions intercept requests to verify tokens and admin roles.
3. **Database (MongoDB)**: A NoSQL document database storing collections for Users, Restaurants, Food Items, and Orders. Mongoose enforces strict schema validation before any write operations.

---

## How It Works

1. **User Flow**: A user registers/logs in → Browses restaurants → Adds food to the cart → Proceeds to checkout → Selects a delivery location on the map → Places the order.
2. **Admin Flow**: An admin logs in → Accesses the restricted dashboard → Adds new food items to the menu → Monitors incoming orders → Updates order statuses as food is prepared and dispatched.

---

## Project Structure

```text
Food-delivery-App/
├── backend/
│   ├── controllers/      # Route controllers (orderController.js, userController.js)
│   ├── models/           # Mongoose schemas (Order.js, User.js)
│   ├── routes/           # Express API route definitions (user.js, etc.)
│   ├── server.js         # Entry point for the backend server
│   └── .env              # Environment variables (Backend)
├── frontend/
│   ├── public/           # Static frontend assets
│   ├── src/
│   │   ├── components/   # Reusable UI elements (MapPicker.jsx)
│   │   ├── context/      # React Context (AuthContext, LocationContext)
│   │   ├── pages/        # Route components (Cart, Checkout, Admin pages)
│   │   ├── App.jsx       # Root React component and router definition
│   │   └── main.jsx      # Vite entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite bundler configuration
└── README.md             # Project documentation
```

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/food-delivery
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## Run Locally

Clone the project:
```bash
git clone https://github.com/suresh4330/Food-delivery-App.git
cd Food-delivery-App
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## Run with Docker & Compose

*(Support for Docker coming soon! Once a `docker-compose.yml` is added, you will be able to spin up the entire stack with a single command.)*

```bash
# Example command for future docker support
docker-compose up --build
```

---

## Troubleshooting

- **MongoDB Connection Error (`MongooseServerSelectionError`)**: Ensure your IP address is whitelisted in MongoDB Atlas, or that your local MongoDB daemon is running.
- **CORS Issues on Frontend**: Verify that your Axios base URL matches the backend server port (usually `http://localhost:5000`).
- **JWT Verification Failed**: Ensure the `JWT_SECRET` in your `.env` matches the one used to sign the token. Try clearing your browser's local storage and logging in again.

---

## FAQ

**Q: Can I use this for a real restaurant?**
A: This project is a solid foundation. For production use, you should integrate a real payment gateway (like Stripe) and enforce stricter validation on orders.

**Q: Where are the images stored?**
A: Currently, images are either referenced via external URLs or stored in the frontend's public directory. Future updates will include Cloudinary integration for image uploads.

---

## Contributing

Contributions are always welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## Changelog

- **v1.0.0**: Initial release featuring user authentication, cart management, and admin dashboard.
- **v1.0.1**: Added `MapPicker` component for checkout routing and resolved styling bugs in `AdminOrders`.

---

## Roadmap

- [ ] Stripe Payment Gateway Integration
- [ ] Real-time WebSocket notifications for order status
- [ ] Cloudinary integration for Restaurant/Food image uploads
- [ ] Mobile-responsive layout overhaul
- [ ] Docker containerization for production deployment

---

## Author

**Suresh**
- GitHub: [@suresh4330](https://github.com/suresh4330)

---

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
