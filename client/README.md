# Chat App Client

A modern chat application client built with [Create React App](https://github.com/facebook/create-react-app).

## Deployed Application

- [Frontend (Vercel)](https://chat-app-front-dusky-three.vercel.app/)
- [Backend (Render)](https://chat-app-oeoa.onrender.com/)


## Features (placeholders)

- Real-time messaging
- Responsive UI
- User authentication

## Folder Structure

```text
client/
├── public/
│   ├── favicon.ico
│   ├── icon.png
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── assets/
│   │   ├── Audio/
│   │   │   └── audio1.mp3
│   │   ├── Videos/
│   │   │   └── video1.mp4
│   │   └── images/
│   │       ├── favicon/
│   │       │   └── icon.png
│   │       └── photo.jpg
│   ├── components/
│   │   ├── Avtar.js
│   │   ├── Divider.js
│   │   ├── EditUserDetails.js
│   │   ├── Loading.js
│   │   ├── MessagePage.js
│   │   ├── SearchUser.js
│   │   ├── UserSearchCard.js
│   │   └── sidebar.js
│   ├── helper/
│   │   └── uploadFile.js
│   ├── index.css
│   ├── index.js
│   ├── layout/
│   │   └── index.js
│   ├── logo.svg
│   ├── pages/
│   │   ├── CheckEmailPage.js
│   │   ├── CheckPasswordpage.js
│   │   ├── ForgotPassword.js
│   │   ├── Home.js
│   │   └── RegisterPage.js
│   ├── redux/
│   │   ├── store.js
│   │   └── userSlice.js
│   ├── reportWebVitals.js
│   ├── routers/
│   │   └── index.js
│   └── setupTests.js
├── .env
├── .gitignore
├── README.md
├── package-lock.json
└── package.json
```

## Getting Started

These instructions will help you set up and run the project locally.

### Prerequisites
- Node.js (v14 or newer recommended)
- npm (v6 or newer)

### Installation
```bash
npm install
```

### Running the App
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production
```bash
npm run build
```
The production-ready build will be in the `build` folder.

### Running Tests
```bash
npm test
```

## Available Scripts
- `npm start` — Start the development server
- `npm test` — Run tests in watch mode
- `npm run build` — Build for production
- `npm run eject` — Eject configuration (irreversible)

## Learn More
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)

## Useful Links
- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
- [Troubleshooting: Build Fails to Minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

