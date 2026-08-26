# 📚 Content Management System

A full-stack **Content Management System (CMS)** for creating, managing, reviewing, publishing, searching, and interacting with **articles, blogs, and quizzes**.

The system provides a centralized platform for authors, administrators, and readers with authentication, content management, quiz functionality, search, and notifications.

---

## 🚀 Project Overview

The Content Management System provides the following capabilities:

- 👤 User registration and authentication
- ✍️ Article and blog creation and management
- 📝 Quiz creation and management
- 🔍 Content review and verification
- 📢 Content approval and publishing
- 🔎 Search and browse functionality
- 🎯 Quiz attempts and result tracking
- 🔔 User notifications
- 🏷️ Categories and tags for content organization

---

## 🎨 UI/UX Design

The project follows a common **Figma design system** to maintain consistency across all modules.

### Design Guidelines

All team members must follow the common:

- Layout
- Colors
- Typography
- Buttons
- Navigation
- Cards
- Forms
- Spacing
- UI/UX patterns

### Figma Design

[🔗 View Figma Design](https://www.figma.com/make/QWtS3iW0W1E12vW8yy4LC5/Content-Management-System?t=N1Jf0dDbTLgqZeqT-0)

---

# 🚀 Features & Modules

## 1. 👤 User Management

- User registration
- Login and logout
- JWT authentication
- User profiles
- Role management
- Password security

**Assigned to:** Sadanand

---

## 2. ✍️ Article / Blog

- Create articles
- Edit articles
- Delete articles
- Save drafts
- Submit articles
- Publish articles

**Assigned to:** Sanika

---

## 3. 📝 Quiz

- Create quizzes
- Create questions
- Add answer options
- Set correct answers
- Associate quizzes with articles

**Assigned to:** Shyam

---

## 4. 🛡️ Admin Verification

- Review submitted content
- Approve content
- Reject content
- Request changes

**Assigned to:** Poojitha

---

## 5. 🗂️ Content Management

- Manage approved content
- Categories
- Tags
- Publication status
- Content organization

**Assigned to:** Rakesh

---

## 6. 🔎 Search & Browse

- Browse articles
- Search content
- Filter by category
- Filter by tags
- View associated quizzes

**Assigned to:** Unnati

---

## 7. 🎯 Quiz Attempt & Result

- Attempt quizzes
- Submit answers
- Calculate scores
- Display results
- Track quiz attempts

**Assigned to:** Ashmitha

---

## 8. 🔔 Notification

- Approval notifications
- Rejection notifications
- Change-request notifications
- Quiz notifications
- Author updates

**Assigned to:** Ashmitha

---

# 💻 Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios

## Backend

- Node.js
- Express.js
- REST API
- JWT
- bcrypt

## Database

- MongoDB
- Mongoose

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- Figma

---

# 🏗️ Project Structure

```text
content-management-system-/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── docs/
│   └── DATABASE_SCHEMA.md
│
├── README.md
└── .gitignore
````

---

# 🗄️ Database

The entire project uses **one common MongoDB database** shared by all team members.

### Database

```text
content_management_system
```

### Main Collections

```text
users
articles
quizzes
questions
categories
tags
quizAttempts
notifications
```

All team members must follow the **common database schema**.

Detailed database fields, relationships, and structure are maintained in:

```text
docs/DATABASE_SCHEMA.md
```

> **Important:** If the actual MongoDB Atlas database is configured with a different database name, use the configured database name consistently throughout the project.

---

# 🌿 GitHub Branch Strategy

All team members work in the **same GitHub repository** using separate feature branches.

```text
main
│
├── feature/user-management
├── feature/article-blog
├── feature/quiz
├── feature/admin-verification
├── feature/content-management
├── feature/search-browse
└── feature/quiz-result-notification
```

## Branch Allocation

| Team Member           | Module                               | Branch                             |
| --------------------- | ------------------------------------ | ---------------------------------- |
| Sadanand              | User Management                      | `feature/user-management`          |
| Sanika                | Article / Blog                       | `feature/article-blog`             |
| Shyam                 | Quiz                                 | `feature/quiz`                     |
| Poojitha              | Admin Verification                   | `feature/admin-verification`       |
| Rakesh                | Content Management                   | `feature/content-management`       |
| Unnati                | Search & Browse                      | `feature/search-browse`            |
| Ashmitha              | Quiz Attempt & Result + Notification | `feature/quiz-result-notification` |
| AK — Aravind Kumar GS | Final Integration                    | `main`                             |

---

# 🔄 Development Workflow

## 1. Update Main Branch

```bash
git checkout main
git pull origin main
```

## 2. Switch to Your Assigned Branch

```bash
git checkout feature/your-module
```

## 3. Develop Your Module

Follow:

* Common Figma design
* Common database schema
* Existing project structure
* Established coding conventions

## 4. Test Your Module

Test:

* Frontend
* Backend
* REST APIs
* Database operations
* Module functionality

## 5. Commit Changes

```bash
git add .
git commit -m "Implement <module>"
```

## 6. Push Your Branch

```bash
git push origin feature/your-module
```

## 7. Create Pull Request

Create a Pull Request:

```text
feature/your-module → main
```

## 8. Inform the Captain

Send the Pull Request link to the Captain for review.

## 9. Review & Merge

The Captain reviews the code and merges the Pull Request after approval.

## 10. Final Integration

The Captain handles:

* API integration
* Conflict resolution
* System testing
* Final bug fixing
* Final deployment

---

# ⚠️ GitHub Rules

1. ❌ Do not push directly to `main`.
2. ❌ Do not create separate repositories for individual modules.
3. ✅ Use your assigned feature branch.
4. ✅ Create a Pull Request before merging.
5. ❌ Never commit `.env` files.
6. ❌ Never commit passwords or API keys.
7. ❌ Never expose database credentials.
8. ✅ Follow the common database schema.
9. ✅ Follow the common Figma design.
10. ✅ Inform the Captain about blockers immediately.

---

# 🔐 Environment Variables

Create a local `.env` file for environment-specific configuration.

> ⚠️ **Never commit `.env` to GitHub.**

Example:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=<your-mongodb-connection-string>

JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

---

# 👥 Team

## 👑 Project Captain

### AK — Aravind Kumar GS

**Responsibilities:**

* Final integration
* API integration
* Conflict resolution
* Code review
* System testing
* Final deployment

## 👨‍💻 Team Members

| Member   | Responsibility                       |
| -------- | ------------------------------------ |
| Sadanand | User Management                      |
| Sanika   | Article / Blog                       |
| Shyam    | Quiz                                 |
| Poojitha | Admin Verification                   |
| Rakesh   | Content Management                   |
| Unnati   | Search & Browse                      |
| Ashmitha | Quiz Attempt & Result + Notification |

---

# ⏰ Project Deadline

**29 August 2026**

All team members must complete and test their assigned modules before the deadline.

---

# 🎯 Project Workflow

The overall system follows this content lifecycle:

```text
Create
   ↓
Review
   ↓
Publish
   ↓
Search
   ↓
Learn
   ↓
Attempt Quizzes
   ↓
View Results
```

---

# 📄 Documentation

Database fields, relationships, and schema documentation are maintained separately:

```text
docs/DATABASE_SCHEMA.md
```

Keeping the main `README.md` focused on the project, modules, technology stack, team responsibilities, and GitHub workflow keeps the repository clean and easy for the entire team to follow.

---

# 📜 License

This project is developed as a **team project for educational and development purposes**
