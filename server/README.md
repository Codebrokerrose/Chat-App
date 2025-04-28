# Chat-App Backend


## Deployed Application

- [Frontend (Vercel)](https://chat-app-front-dusky-three.vercel.app/)
- [Backend (Render)](https://chat-app-oeoa.onrender.com/)

This is the backend server for the Chat-App project. It provides RESTful APIs and real-time communication features for a chat application, including user authentication, user management, and messaging using Socket.IO.

## Features

- User registration and authentication (JWT + cookies)
- Secure password hashing (bcryptjs)
- Email existence check
- User profile update
- User search
- Logout functionality
- Real-time messaging with Socket.IO
- MongoDB for persistent storage

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser
- CORS

## API Endpoints

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/api/register`    | Register a new user            |
| POST   | `/api/email`       | Check if email exists          |
| POST   | `/api/password`    | Authenticate user, set cookie  |
| GET    | `/api/user-details`| Get current user details       |
| GET    | `/api/logout`      | Logout user (clear cookie)     |
| POST   | `/api/update-user` | Update user profile            |
| POST   | `/api/search-user` | Search users by name/email     |

## Real-time Messaging

- Uses Socket.IO for real-time chat features.
- Authenticates users via JWT token sent in the socket handshake.

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB instance (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Chat-App/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/server` directory:
   ```env
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=your-mongodb-uri
   PORT=8080
   JWT_SECRET_KEY=your-secret-key
   ```
4. Start the server:
   ```bash
   npm start
   # or
   node index.js
   ```

### Environment Variables
- `FRONTEND_URL`: URL of the frontend application (for CORS)
- `MONGO_URI`: MongoDB connection string
- `PORT`: Port to run the server
- `JWT_SECRET_KEY`: Secret key for JWT

## Deployment Notes
- Ensure cookies are set with `SameSite=None; Secure` for cross-site authentication in production.
- Both backend and frontend should be served over HTTPS for cookies to work.
- Update `FRONTEND_URL` in `.env` to match your deployed frontend.

## Project Structure

```
server/
├── config/
│   └── connectDB.js
├── controller/
│   ├── checkEmail.js
│   ├── checkPassword.js
│   ├── logout.js
│   ├── registerUser.js
│   ├── searchUser.js
│   ├── updateUserDetails.js
│   └── userDetails.js
├── helpers/
│   ├── getConversation.js
│   └── getUserDetailsFromToken.js
├── models/
│   ├── ConversationModel.js
│   └── UserModel.js
├── routes/
│   └── index.js
├── socket/
│   └── index.js
├── .env
├── .gitignore
├── index.js
└── README.md
```

## License
This project is licensed under the MIT License.
