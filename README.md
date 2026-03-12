# DevCollab - Developer Collaboration Platform

A modern full-stack web application for developers to showcase projects and collaborate.

## Technologies

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Redux Toolkit, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Mailjet, Cloudinary

## Features

- **Authentication:** Secure JWT-based auth with email verification and password reset.
- **Profiles:** Customizable developer profiles with skills and social links.
- **Project Showcase:** Create, edit, and explore projects from the community.
- **Dashboard:** Personalized view of projects and account settings.
- **Admin Panel:** Powerful tools to manage users and view statistics.
- **Responsive Design:** Fully optimized for all screen sizes.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for images)
- Mailjet account (for emails)

### Installation

1. Clone the repository
2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` folder (copy from `.env.example` or use the one created).
   - Add your MongoDB URI, JWT Secret, Mailjet, and Cloudinary keys.

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   ```
   - Run the development server:
   ```bash
   npm run dev
   ```

4. **Running the App:**
   - Start the backend: `node server.js` (or `npm start` if script added)
   - Start the frontend: `npm run dev`

## Deployment

- **Frontend:** Deploy to Vercel
- **Backend:** Deploy to Render
