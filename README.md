<<<<<<< HEAD
=======
# Lumen — Content Management System

> **Branch:** `feature/user-management`  
> **Module Owner:** Sadanand (User Management, Authentication & Discussions)

---

## 📖 Module Overview

This module provides the core **User Management, Authentication, and Comment & Discussion** infrastructure for the Lumen Content Management System:
- **Authentication & User Management**: Secure JWT-based authentication, bcrypt password hashing, MongoDB User modeling, protected routes, and role-based access control (`admin`, `author`, `reader`).
- **Comment & Discussion System**: Full-featured threaded discussions, nested replies, emoji & like reactions, author edit permissions, admin moderation deletion, and community discussion feeds.

### Team Module Division & Architecture:
- **Sadanand (This Module)**: User Management, Authentication & Discussions (Register, Login, JWT, Profile, Roles, Threaded Comments, Replies, Reactions)
- **Sanika**: Article / Blog Publishing
- **Shyam**: Quiz Creation & Management
- **Poojitha**: Admin Verification & Moderation
- **Rakesh**: Content Management
- **Unnati**: Search & Browse
- **Ashmitha**: Quiz Attempt & Result + Notification System
- **AK**: Final Integration

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo accounts (Admin, Author, Reader)
npm test         # Runs automated Auth & Comment verification test suites
npm run dev      # Runs Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```

---

## 🛡️ Team Integration Contract

All team members can consume the centralized authentication and comment modules directly without duplicating logic:

### How to Protect Routes in Your Backend Module:
```javascript
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// 1. Any authenticated user (Reader, Author, Admin)
router.post('/my-endpoint', authenticateUser, (req, res) => {
  const currentUserId = req.user.id;    // MongoDB User ObjectId
  const currentUserRole = req.user.role; // 'reader' | 'author' | 'admin'
  const currentUserName = req.user.name;
  
  // Proceed with your module logic
});

// 2. Author or Admin restricted endpoint (e.g. Sanika's Article Creation)
router.post('/articles', authenticateUser, authorizeRole('author', 'admin'), createArticleController);

// 3. Admin-only restricted endpoint (e.g. Poojitha's Verification Center)
router.put('/verify-article/:id', authenticateUser, authorizeRole('admin'), verifyArticleController);
```

### Frontend Token Handling & Comments Integration:
```jsx
// 1. Access user authentication state anywhere in React:
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, isAuthor, isAdmin, isReader } = useAuth();
  return <div>Welcome, {user?.name} ({user?.role})</div>;
};

// 2. Embed the CommentSection on any article, quiz, or discussion page:
import CommentSection from '../components/comments/CommentSection';

<CommentSection targetId="article-123" targetTitle="My Article Headline" />
```

---

## ⚡ Pre-seeded Demo Accounts for Testing

| Role | Email | Password | Intended Use |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lumen.com` | `admin123` | Platform administration, user moderation, comment deletion |
| **Author** | `author@lumen.com` | `author123` | Writing articles, creating quizzes, replying to readers |
| **Author** | `priya.mehta@lumen.com` | `author123` | Science journalism essays & discussions |
| **Reader** | `reader@lumen.com` | `reader123` | Reading articles, taking quizzes, commenting, reacting |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`reader` or `author`). Admin registration via public endpoint is strictly blocked.
- `POST /api/auth/login` — Sign in and receive JWT token + user profile.
- `POST /api/auth/logout` — Invalidate session.
- `GET /api/auth/me` — *(Protected)* Fetch currently authenticated user session.

### Users (`/api/users`)
- `GET /api/users/profile` — *(Protected)* Fetch current user profile.
- `PUT /api/users/profile` — *(Protected)* Update name and bio.
- `GET /api/users/:id` — Public profile lookup.
- `GET /api/users` — *(Admin Only)* List all registered users.
- `POST /api/users` — *(Admin Only)* Create new user with specified role.
- `PUT /api/users/:id/role` — *(Admin Only)* Change a user's role.
- `DELETE /api/users/:id` — *(Admin Only)* Remove a user account.

### Comments & Discussions (`/api/comments`)
- `GET /api/comments/target/:targetId` — Fetch all threaded comments and nested replies with reaction counts.
- `POST /api/comments` — *(Protected)* Post a top-level comment or reply (`{ content, targetId, parentId }`).
- `PUT /api/comments/:id` — *(Protected)* Edit comment text (author only).
- `DELETE /api/comments/:id` — *(Protected)* Delete comment (author or admin moderation).
- `POST /api/comments/:id/react` — *(Protected)* Like or react to a comment (`{ type: 'like' }`).
- `GET /api/comments/recent` — Fetch platform-wide recent discussion feed.
>>>>>>> be4582c (Update user management)
