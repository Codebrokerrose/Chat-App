# Chat App

A modern real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.  
The app features real-time messaging, user authentication, profile management, and a responsive UI.

---

## Deployed Applications

- **Frontend (Vercel):** [Chat App Frontend](https://chat-app-front-dusky-three.vercel.app/)
- **Backend (Render):** [Chat App Backend](https://chat-app-oeoa.onrender.com/)

---

## Features

### Frontend
- Real-time messaging interface
- Responsive design for all devices
- Secure user authentication and session management
- Profile editing and user search functionality
- Loading indicators and smooth UX transitions

### Backend
- User registration and login (JWT + secure cookies)
- Email existence checking
- Profile update and user search APIs
- Secure password hashing using `bcryptjs`
- Real-time communication with `Socket.IO`
- MongoDB database for persistent storage

---

## Technologies Used

- **Frontend:** React, Redux, Socket.IO Client
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## Frontend Folder Structure

```
client/
├── public/
│   └── static assets (favicon, manifest, etc.)
├── src/
│   ├── assets/ (audio, videos, images)
│   ├── components/ (UI components like Avatar, SearchUser, Sidebar)
│   ├── helper/ (helper functions like uploadFile.js)
│   ├── layout/ (application layouts)
│   ├── pages/ (major pages like Home, Register, ForgotPassword)
│   ├── redux/ (store and userSlice)
│   ├── routers/ (application routing)
│   ├── App.js / App.css / index.js
├── .env
├── package.json
└── README.md
```

---

## Backend Folder Structure

```
server/
├── config/ (MongoDB connection setup)
├── controller/ (request handlers: register, login, logout, update user)
├── helpers/ (utility functions)
├── models/ (Mongoose models for User and Conversation)
├── routes/ (API routes)
├── socket/ (Socket.IO server handling)
├── .env
├── index.js
└── README.md
```

---

## API Endpoints

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| POST   | `/api/register`      | Register a new user             |
| POST   | `/api/email`         | Check if email exists           |
| POST   | `/api/password`      | Authenticate user, set cookie   |
| GET    | `/api/user-details`  | Fetch current user details      |
| GET    | `/api/logout`        | Logout user, clear session      |
| POST   | `/api/update-user`   | Update user profile             |
| POST   | `/api/search-user`   | Search users by name or email   |

---

## Real-time Messaging

- Authenticated Socket.IO connections using JWT tokens.
- Event-driven architecture for sending and receiving messages.
- Conversations are saved in MongoDB for persistence.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v14 or newer)
- npm (v6 or newer)
- MongoDB (local or Atlas)

---

### Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm start
   ```
   Access it at: [http://localhost:3000](http://localhost:3000)

---

### Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/server` directory:
   ```
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=your-mongodb-uri
   PORT=8080
   JWT_SECRET_KEY=your-secret-key
   ```
4. Run the server:
   ```bash
   npm start
   # or
   node index.js
   ```
   Backend will run on [http://localhost:8080](http://localhost:8080)

---

## Environment Variables

| Variable        | Purpose                                  |
|-----------------|------------------------------------------|
| `FRONTEND_URL`   | URL of frontend (for CORS)              |
| `MONGO_URI`      | MongoDB connection string              |
| `PORT`           | Port for server (default 8080)         |
| `JWT_SECRET_KEY` | Secret key for JWT token encryption    |

---

## Available Scripts

| Command            | Usage                                   |
|--------------------|----------------------------------------|
| `npm start`         | Run development server (client or server) |
| `npm run build`     | Build production frontend assets       |
| `npm test`          | Run frontend tests                     |
| `npm run eject`     | Eject CRA configuration (irreversible) |

---

## Deployment Notes

- Frontend and backend must be served over **HTTPS** in production.
- Configure cookies with `SameSite=None; Secure` for cross-site authentication.
- Update `.env` variables before deploying to Vercel and Render.

---

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Docs](https://facebook.github.io/create-react-app/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Socket.IO Documentation](https://socket.io/)

---

## License

This project is licensed under the **MIT License**.

---
