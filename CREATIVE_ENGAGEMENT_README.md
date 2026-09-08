# Ashmitha — Creative Engagement Features (Version 2)

Implemented features:
- Article bookmarks: add, remove, status, saved articles list
- Reading history: record reads, list history, clear history, duplicate-safe per user/article
- Trending articles: dynamic ranking using reads + weighted bookmarks
- Article reader page with Save/Unsave and Share/Copy Link
- Saved Articles page
- Reading History page
- Trending page
- Browse page links into article reader
- JWT-protected user engagement APIs
- MongoDB models plus in-memory fallback consistent with the existing project

## Files added
Backend:
- backend/models/Bookmark.js
- backend/models/ReadingHistory.js
- backend/models/ArticleEngagement.js
- backend/controllers/engagementController.js
- backend/routes/engagementRoutes.js

Frontend:
- frontend/src/pages/Bookmarks.jsx
- frontend/src/pages/ReadingHistory.jsx
- frontend/src/pages/Trending.jsx
- frontend/src/pages/ArticleReader.jsx
- frontend/src/pages/engagementData.js

## Files updated
- backend/server.js
- frontend/src/App.jsx
- frontend/src/components/Navbar.jsx
- frontend/src/pages/Placeholders.jsx
- frontend/src/services/api.js

## API endpoints
Public:
- GET /api/engagement/trending?limit=6

Authenticated:
- POST /api/engagement/bookmarks/:articleId
- DELETE /api/engagement/bookmarks/:articleId
- GET /api/engagement/bookmarks
- GET /api/engagement/bookmarks/:articleId/status
- POST /api/engagement/history/:articleId
- GET /api/engagement/history
- DELETE /api/engagement/history

## Integration note
The current starter project does not contain a complete Article model/API. Therefore the engagement layer stores articleId plus lightweight display metadata. During final integration, Aravind can pass the real article title/category/author data from the Article module into these endpoints, or replace the demo article reader with the real article detail route.

## Local setup
Backend:
1. cd backend
2. npm install
3. Configure backend/.env with MONGO_URI and JWT_SECRET if using MongoDB/JWT.
4. npm run dev

Frontend:
1. cd frontend
2. npm install
3. npm run dev
