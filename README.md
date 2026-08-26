# Sniplink — URL Shortener

Sniplink is a modern full-stack URL shortener application built with the **MERN stack** (MongoDB, Express, React, Node.js), TypeScript, and Tailwind CSS.

---

## ✨ Features

- 🔗 **Instant URL Shortening**: Convert long links into short, shareable URLs.
- ✨ **Custom Aliases**: Create custom short codes for your URLs.
- 📱 **QR Code Generation**: View and download QR codes for any short link.
- 📊 **Analytics Dashboard**: Track total links, click counts, and performance.
- 👤 **User Accounts & Guest Mode**: Use as a guest or sign in to save your links across devices.
- 📱 **Mobile Responsive**: Clean and responsive design for all screen sizes.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Muhammed-Jasir-M/MERN-URL-Shortener.git
cd MERN-URL-Shortener
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend app:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📝 License

Made with ❤️ by **Muhammed Jasir**.