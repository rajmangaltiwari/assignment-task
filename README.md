# Assignment 01: Me-API Playground (MERN Stack)

A professional personal profile API and frontend dashboard for Rajmangal Tiwari with authentication, CRUD operations, and skill-based project search.

**Resume Link**: [View My Resume](https://example.com/resume-link)

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Sample cURL Commands](#sample-curl-commands)
- [Known Limitations](#known-limitations)

---

## 🏗️ Architecture

### Monorepo Structure
```
assignment01/
├── backend/
│   ├── models/
│   │   ├── Profile.js      (Profile with projects, skills, work)
│   │   └── User.js         (User authentication)
│   ├── controllers/
│   │   ├── projectController.js    (CRUD for projects)
│   │   ├── profileController.js    (CRUD for skills & profile)
│   │   └── userController.js       (Auth signup/login)
│   ├── middleware/
│   │   └── authenticateToken.js    (JWT verification)
│   ├── seed.js             (Database seeding)
│   └── server.js           (Express app setup)
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   └── SignupPage.tsx
    │   ├── components/
    │   │   ├── EducationSection.tsx
    │   │   ├── SkillsSection.tsx
    │   │   ├── ProjectsSection.tsx
    │   │   ├── WorkExperienceSection.tsx
    │   │   └── SearchBar.tsx
    │   ├── App.tsx         (Main profile page)
    │   └── main.tsx        (Router setup)
    └── package.json
```

### Data Flow
```
Frontend (React) 
    ↓ (axios requests)
Backend API (Express)
    ↓ (JWT validation)
MongoDB (Local/Cloud)
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS** - Native styling

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **Mongoose 9** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Database
- **MongoDB** - NoSQL database
- Local: `mongodb://localhost:27017`
- Cloud: MongoDB Atlas

---

## ✨ Features

- ✅ User authentication (Signup/Login with JWT)
- ✅ Profile management (name, email, education, skills)
- ✅ Project CRUD operations
- ✅ Skill management (add/remove)
- ✅ Project search by skill
- ✅ Work experience display
- ✅ Protected routes with authentication middleware
- ✅ Password hashing with bcryptjs
- ✅ Clean component structure

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+) installed
- MongoDB running locally OR MongoDB Atlas account

### Local Setup

#### 1. Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/me-api
JWT_SECRET=your-super-secret-key-here
PORT=5001
```

**Seed the database:**
```bash
node seed.js
```

**Start dev server:**
```bash
npm run dev
```
Server runs on `http://localhost:5001`

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env.local` file (optional):**
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

**Start dev server:**
```bash
npm run dev
```
App runs on `http://localhost:5173`

### Production Setup

#### Backend (Production)

1. **Deploy to Heroku/Vercel/Railway:**
   ```bash
   # Set environment variables in hosting dashboard
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/me-api
   JWT_SECRET=your-production-secret-key
   NODE_ENV=production
   ```

2. **Start production server:**
   ```bash
   npm run dev  # or npm start
   ```

#### Frontend (Production)

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy built files to Netlify/Vercel:**
   ```bash
   # Netlify: Connect GitHub repo
   # Vercel: Connect GitHub repo or upload dist/ folder
   ```

3. **Update `.env.local` with production API URL:**
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

---

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcryptjs),
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  education: String,
  skills: [String],  // e.g., ["React", "Node.js", "MongoDB"]
  
  projects: [
    {
      _id: ObjectId,
      title: String,
      description: String,
      skills: [String],
      links: {
        github: String (URL),
        demo: String (URL)
      }
    }
  ],
  
  work: [
    {
      company: String,
      position: String,
      duration: String,
      description: String
    }
  ],
  
  links: {
    github: String (URL),
    linkedin: String (URL),
    portfolio: String (URL)
  },
  
  timestamps: true
}
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/me` - Get current user (protected)

### Profile
- `GET /api/profile` - Get full profile
- `POST /api/profile` - Create/update profile

### Projects
- `GET /api/projects` - Get all projects or filter by skill
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/top` - Get top 5 skills
- `POST /api/skills` - Add new skill (protected)
- `DELETE /api/skills/:skillName` - Remove skill (protected)

### Search
- `GET /api/search?q=...` - Search profile data

---

## 📝 Sample cURL Commands

### Authentication

**Signup:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajmangal Tiwari",
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get Current User (Protected):**
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Profile

**Get Profile:**
```bash
curl -X GET http://localhost:5001/api/profile
```

**Add Skill:**
```bash
curl -X POST http://localhost:5001/api/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "skill": "TypeScript"
  }'
```

**Remove Skill:**
```bash
curl -X DELETE http://localhost:5001/api/skills/TypeScript \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Projects

**Create Project:**
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Portfolio API",
    "description": "A MERN stack portfolio",
    "skills": ["React", "Node.js", "MongoDB"],
    "links": {
      "github": "https://github.com/user/project",
      "demo": "https://project-demo.com"
    }
  }'
```

**Get Projects by Skill:**
```bash
curl -X GET "http://localhost:5001/api/projects?skill=React"
```

**Delete Project:**
```bash
curl -X DELETE http://localhost:5001/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Search Profile:**
```bash
curl -X GET "http://localhost:5001/api/search?q=React"
```

---

## ⚠️ Known Limitations

1. **Local MongoDB Required** - Backend expects MongoDB running on `localhost:27017`. For production, use MongoDB Atlas.

2. **JWT Token Storage** - Tokens stored in browser localStorage (not HTTP-only cookies). Consider using secure cookies for production.

3. **CORS** - Allow all origins by default. For production, restrict to your domain:
   ```javascript
   app.use(cors({
     origin: "https://yourdomain.com",
     credentials: true
   }));
   ```

4. **No Email Verification** - Signup creates user immediately without email confirmation.

5. **No Password Reset** - Users can't reset forgotten passwords. Implement forgot password flow in production.

6. **Single Profile Per App** - Only one profile/portfolio per database instance. Scale architecture for multi-user portfolios.

7. **No Input Validation** - Minimal validation on API inputs. Add comprehensive validation using libraries like `joi` or `yup`.

8. **No Rate Limiting** - No protection against brute force attacks. Add rate limiting middleware for production.

9. **Image Upload Not Supported** - Only text data. Add file upload support for profile pictures/project images.

10. **No Pagination** - All projects/skills returned at once. Add pagination for large datasets.

---

## 🔗 Resume & Links

- **Resume**: [Download](https://drive.google.com/file/d/1RqCLg-RhoTSQJdnV8ilpc0T7t9hE0gRe/view?usp=sharing)
- **GitHub**: [github.com/rajmangaltiwari](https://github.com/rajmangaltiwari)
- **LinkedIn**: [linkedin.com/in/rajmangaltiwari](https://linkedin.com/in/rajmangaltiwari)
- **Portfolio**: [rajmangal.live](https://rajmangal.live)

---

## 📞 Support

For issues or questions, refer to the API documentation or contact through the links above.
