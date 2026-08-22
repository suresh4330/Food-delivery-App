<h1 align="center">🍔 Food Delivery App</h1>

<div align="center">
  <p>A full-stack, modern food delivery application built with the MERN stack.</p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()
</div>

<br />

## 📑 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🌟 About the Project

This is a comprehensive Food Delivery application designed to provide a seamless experience for users to browse restaurants, order food, and track their deliveries. It also includes an admin dashboard for managing food items, categories, and monitoring user orders.

## ✨ Key Features

- **Authentication & Authorization**: Secure JWT-based login, registration, and role-based access (User/Admin).
- **Interactive UI**: Responsive and modern user interface built with React and styled beautifully.
- **Restaurant & Menu Browsing**: Users can browse different restaurants, view menus, and check prices.
- **Cart Management**: Add, remove, or update quantities of items in the cart.
- **Checkout & Location Picker**: Integrated map picker for selecting delivery addresses.
- **Order Tracking**: Users can view their order history and track the live status of their current orders.
- **Admin Dashboard**: Comprehensive dashboard for admins to add/edit restaurants, manage food items, and update order statuses.

## 🛠 Tech Stack

### Frontend
- **React.js** - UI Library
- **Vite** - Build Tool
- **React Router** - Navigation
- **Context API** - State Management
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM Library
- **JWT & bcrypt.js** - Security & Authentication

---

## 📁 Project Structure

```text
Food-delivery-App/
├── backend/
│   ├── controllers/      # Route controllers (Order, User, Admin)
│   ├── models/           # Mongoose schemas (User, Order, FoodItem)
│   ├── routes/           # Express API routes
│   ├── server.js         # Entry point for backend
│   └── .env              # Environment variables
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (MapPicker, etc.)
    │   ├── context/      # Context providers (Auth, Location)
    │   ├── pages/        # Page components (Cart, Checkout, Admin, User)
    │   ├── App.jsx       # Main React component
    │   └── main.jsx      # React DOM rendering
    ├── public/           # Static assets
    └── package.json      # Frontend dependencies
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas URI
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/suresh4330/Food-delivery-App.git
cd Food-delivery-App
```

### 2. Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm run dev
# The server should now be running on http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
# The frontend should now be running on http://localhost:5173
```

---

## 🔌 API Endpoints (Brief Overview)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/users/profile` - Get user profile details
- `POST /api/orders` - Place a new food order
- `GET /api/orders/myorders` - Get orders for logged-in user
- `GET /api/admin/orders` - (Admin) Get all orders
- `PUT /api/admin/orders/:id/status` - (Admin) Update order status

---

## 📸 Screenshots

*(Replace these with actual screenshots of your application)*

| Home Page | Cart Page |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250.png?text=Home+Page+Screenshot" alt="Home Page" width="400"/> | <img src="https://via.placeholder.com/400x250.png?text=Cart+Page+Screenshot" alt="Cart Page" width="400"/> |

| Checkout Map Picker | Admin Dashboard |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250.png?text=Map+Picker+Screenshot" alt="Map Picker" width="400"/> | <img src="https://via.placeholder.com/400x250.png?text=Admin+Dashboard+Screenshot" alt="Admin Dashboard" width="400"/> |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/suresh4330/Food-delivery-App/issues).

---

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
