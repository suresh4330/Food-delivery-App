# Food Delivery App

A full-stack food delivery application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). 

## Features
- **User Authentication:** Secure login and registration.
- **Browse Restaurants & Menu:** Users can view a list of restaurants and their available food items.
- **Cart & Checkout:** Add items to cart and seamlessly checkout.
- **Location-based Services:** Map integration for address selection.
- **Order Tracking:** Track the status of active and past orders.
- **Admin Dashboard:** Admins can manage restaurants, food items, and monitor all orders.

## Tech Stack
- **Frontend:** React, React Router, Context API, CSS/Tailwind (or styled-components).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Authentication:** JSON Web Tokens (JWT).

## Installation and Setup

### Prerequisites
- Node.js installed on your local machine.
- MongoDB instance (local or Atlas) running.

### 1. Clone the repository
```bash
git clone https://github.com/suresh4330/Food-delivery-App.git
cd Food-delivery-App
```

### 2. Setup the Backend
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm start
# or for development:
npm run dev
```

### 3. Setup the Frontend
Open a new terminal, navigate to the `frontend` directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm start
# or if using Vite:
npm run dev
```

## Usage
- The frontend will run on `http://localhost:3000` (or `http://localhost:5173` if Vite).
- The backend API will be available at `http://localhost:5000`.

## License
This project is open-source and available under the [MIT License](LICENSE).
