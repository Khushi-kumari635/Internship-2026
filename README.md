# 🎓 AlumniConnect — Alumni Network Platform

A complete full-stack **Alumni Network Platform** built as a B.Tech Computer Science
college project. It connects students and alumni through profiles, a searchable
directory, a job/internship board, and an events & RSVP system.

Built with a simple, beginner-friendly tech stack:

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

---

## 📁 Folder Structure

```
alumni-network-platform/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/                # Business logic for each feature
│   │   ├── authController.js
│   │   ├── alumniController.js
│   │   ├── studentController.js
│   │   ├── jobController.js
│   │   ├── internshipController.js
│   │   ├── eventController.js
│   │   ├── connectionController.js
│   │   ├── messageController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT route protection
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   ├── AlumniProfile.js
│   │   ├── StudentProfile.js
│   │   ├── Job.js
│   │   ├── InternshipRequest.js
│   │   ├── Event.js
│   │   ├── RSVP.js
│   │   ├── Connection.js
│   │   └── Message.js
│   ├── routes/                     # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── alumniRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── internshipRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── connectionRoutes.js
│   │   ├── messageRoutes.js
│   │   └── dashboardRoutes.js
│   ├── seed/
│   │   └── seedData.js             # Realistic Indian sample data
│   ├── .env.example                # Copy to .env and configure
│   ├── package.json
│   └── server.js                   # App entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css               # All styling (blue & white theme)
│   ├── js/
│   │   ├── api.js                  # Central fetch()/API helper
│   │   ├── main.js                 # Navbar/footer + shared utilities
│   │   ├── auth.js                 # Login/Register logic
│   │   ├── home.js
│   │   ├── directory.js
│   │   ├── profile.js
│   │   ├── jobs.js
│   │   ├── events.js
│   │   ├── dashboard.js
│   │   └── contact.js
│   ├── index.html                  # Home Page
│   ├── login.html
│   ├── register.html
│   ├── directory.html              # Alumni Directory
│   ├── profile.html                # Alumni Profile (view by ?id=)
│   ├── jobs.html                   # Job Board
│   ├── events.html                 # Events & Reunions
│   ├── dashboard.html              # Student/Alumni Dashboard
│   ├── about.html
│   └── contact.html
│
└── README.md
```

---

## ⚙️ Prerequisites

Before running this project, make sure you have installed:

1. **Node.js** (v16 or higher) — [Download here](https://nodejs.org)
2. **MongoDB** — either:
   - Installed locally ([Download here](https://www.mongodb.com/try/download/community)), OR
   - A free **MongoDB Atlas** cloud cluster ([Sign up here](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Installation & Setup

### Step 1 — Download / Extract the Project

Extract the project ZIP (or clone it) to a folder on your computer.

### Step 2 — Install Backend Dependencies

Open a terminal, navigate into the `backend` folder, and install packages:

```bash
cd alumni-network-platform/backend
npm install
```

### Step 3 — Configure Environment Variables

Copy the example environment file and rename it to `.env`:

```bash
# On Windows (Command Prompt)
copy .env.example .env

# On Mac/Linux
cp .env.example .env
```

Open `.env` in a text editor and update `MONGO_URI` if needed:

```
MONGO_URI=mongodb://127.0.0.1:27017/alumni_network
PORT=5000
JWT_SECRET=alumni_network_secret_key_2024
JWT_EXPIRES_IN=7d
```

> If you're using MongoDB Atlas instead of a local database, replace `MONGO_URI`
> with your Atlas connection string (Atlas dashboard → Connect → Drivers).

### Step 4 — Start MongoDB (if running locally)

Make sure your local MongoDB server is running:

```bash
mongod
```

(Skip this step if you're using MongoDB Atlas — it's already running in the cloud.)

### Step 5 — Seed the Database with Sample Data

This fills your database with realistic Indian alumni, students, jobs, and events
so the app looks complete right away:

```bash
npm run seed
```

You should see a success message listing sample login credentials.

### Step 6 — Start the Server

```bash
npm start
```

You should see:

```
✅ MongoDB Connected: 127.0.0.1
🚀 Server running at http://localhost:5000
```

### Step 7 — Open the App

Open your browser and go to:

```
http://localhost:5000
```

That's it! The Express backend also serves the frontend files directly, so you
don't need a separate frontend server.

---

## 🔑 Demo Login Credentials

After running `npm run seed`, you can log in with any of these sample accounts
(all use the same password):

| Role    | Email                          | Password      |
|---------|---------------------------------|----------------|
| Alumni  | rahul.sharma@example.com        | password123    |
| Alumni  | priya.singh@example.com         | password123    |
| Alumni  | aman.kumar@example.com          | password123    |
| Student | kabir.anand@example.com         | password123    |
| Student | ishita.reddy@example.com        | password123    |

Or simply click **"Register"** to create your own new account as a Student or Alumni.

---

## ✨ Features Implemented

### Frontend
- Fully responsive design (mobile, tablet, desktop) with a clean blue & white theme
- Reusable navbar & footer injected via JavaScript on every page
- Client-side form validation (login, register, contact)
- Live search & dynamic filters on the Alumni Directory and Job Board
- Event RSVP with live status updates
- Interactive modals for job details, event RSVP, and internship requests

### Backend (REST API)
- JWT-based authentication (register/login) with hashed passwords (bcrypt)
- Role-based access (Student vs Alumni) for posting jobs, applying, etc.
- Full CRUD-style APIs for Alumni Profiles, Student Profiles, Jobs, Events, RSVPs,
  Internship Requests, Connections, and Messages
- Aggregated Dashboard API returning live stats, latest jobs, and upcoming events

### Database (MongoDB)
- 9 well-structured collections with Mongoose schemas and validation
- Realistic Indian sample data (names, cities, companies) via the seed script

---

## 🧭 Quick API Reference

| Method | Endpoint                        | Description                          | Auth Required |
|--------|----------------------------------|---------------------------------------|----------------|
| POST   | /api/auth/register               | Register a new student/alumni         | No             |
| POST   | /api/auth/login                  | Login and receive a JWT token         | No             |
| GET    | /api/alumni                      | List/search/filter alumni             | No             |
| GET    | /api/alumni/:id                  | View one alumni profile               | No             |
| PUT    | /api/alumni/:id                  | Update your alumni profile            | Yes            |
| GET    | /api/students                    | List all students                     | Yes            |
| GET    | /api/jobs                        | List/search/filter jobs               | No             |
| POST   | /api/jobs                        | Post a new job (alumni only)          | Yes            |
| POST   | /api/jobs/:id/apply               | Apply to a job                        | Yes            |
| GET    | /api/events                      | List all events                       | No             |
| POST   | /api/events/:id/rsvp               | RSVP to an event                      | Yes            |
| POST   | /api/internships                 | Send an internship request            | Yes            |
| GET    | /api/dashboard                   | Get dashboard stats & data            | Yes            |

---

## 🛠️ Troubleshooting

**"MongoDB Connected" error / connection refused**
Make sure MongoDB is running (`mongod`) or that your Atlas connection string
in `.env` is correct and your IP is whitelisted in Atlas.

**Port 5000 already in use**
Change `PORT` in your `.env` file to another number (e.g. `5050`).

**Seed script says "duplicate email" errors**
This means data was already seeded. Either skip seeding again, or manually
clear your MongoDB database before re-running `npm run seed`.

---

## 📚 For Your Viva / Presentation

A few talking points that show understanding of the project:

1. **Architecture:** This is a classic 3-tier MVC-inspired architecture —
   Routes → Controllers → Models, with a separate static frontend.
2. **Authentication:** Passwords are never stored in plain text — they're hashed
   using `bcrypt` before saving, and login sessions use signed JWT tokens.
3. **Relationships:** `AlumniProfile`/`StudentProfile` both reference the base
   `User` model via `ObjectId` — a one-to-one relationship, common in real apps.
4. **RESTful Design:** Each resource (alumni, jobs, events...) has predictable
   endpoints following REST conventions (GET/POST/PUT/DELETE).
5. **Client-Server Separation:** The frontend never talks to MongoDB directly —
   it only calls the backend's REST API (see `frontend/js/api.js`).

---

## 📄 License

This project was created for educational purposes as a college project.
Feel free to use, modify, and extend it for learning.
