# CareerNest - Employers and Job Seeker Platform

CareerNest is a full-stack job portal web application that connects job seekers with employers. The platform provides role-based access for job seekers to search and apply for jobs, and for employers to post jobs and manage candidate applications, supported by automated SMS alerts via Twilio.

---

## Submission Details

- **Project:** CareerNest (SDEP2)
- **GitHub Repository:** https://github.com/ashwinkrishnavijay/careernest
- **Backend Deployed URL:** https://careernest-backend.onrender.com
- **API Documentation (Swagger UI):** https://careernest-backend.onrender.com/swagger-ui.html
- **Frontend Deployed URL:** https://careernest-app.vercel.app

---

## Tech Stack

- **Backend:** Java 17+, Spring Boot 3.2.4, Spring Security, Spring Data MongoDB, JJWT
- **Database:** MongoDB (Local or MongoDB Atlas)
- **Frontend:** React 18, TypeScript, Redux Toolkit, TailwindCSS, React Router v6
- **SMS Notifications:** Twilio SDK (with simulated local fallback mode)
- **API Documentation:** SpringDoc OpenAPI 3.0 / Swagger UI
- **Build Tools & Deployment:** Maven, Vite, Docker, Render, Vercel

---

## Key Modules & Features

### 1. Authentication & Role Management
- Secure user registration and login with Spring Security and stateless JWT authentication.
- Role-based authorization with two distinct user roles: `JOB_SEEKER` and `EMPLOYER`.
- Passwords securely hashed with BCrypt.

### 2. Job Management (Employer)
- Post new job listings with title, description, location, salary, deadline, and employment type.
- Update and delete job postings.
- Employer dashboard to review applicants, view resumes, and update application statuses (`REVIEWING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`).

### 3. Job Search & Application (Job Seeker)
- Browse and search jobs by keywords (title, company, description) and filter by location.
- View detailed job descriptions, company details, salary range, and deadlines.
- Submit job applications with contact number, resume/portfolio URL, and cover letter.
- Seeker dashboard to track real-time application status.

### 4. SMS Notifications (Twilio)
- SMS alerts sent upon:
  - User registration confirmation.
  - Job application submission (notifies both candidate and hiring manager).
  - Application status change (notifies candidate when shortlisted, accepted, or rejected).
- Safe fallback: if Twilio credentials are not configured, the system logs simulated SMS events to the console without interrupting application flow.

---

## Demo Test Accounts

The database seeder pre-populates the following test credentials:

| Role | Email | Password | Allowed Actions |
|---|---|---|---|
| **Employer** | `employer@careernest.com` | `password123` | Post jobs, edit listings, review applicants, update statuses |
| **Job Seeker** | `seeker@careernest.com` | `password123` | Search jobs, apply with resume link, track application status |

*(Quick demo login buttons are also available on the login page for rapid evaluation.)*

---

## REST API Endpoints

### Auth Controller (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user as `JOB_SEEKER` or `EMPLOYER` |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current logged-in user details |

### Job Controller (`/api/jobs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | List and search jobs (query params: `keyword`, `location`) |
| `GET` | `/api/jobs/{id}` | Public | Get single job details by ID |
| `POST` | `/api/jobs` | Employer | Create a new job listing |
| `PUT` | `/api/jobs/{id}` | Employer | Edit existing job listing |
| `DELETE` | `/api/jobs/{id}` | Employer | Remove job listing |
| `GET` | `/api/jobs/my-jobs` | Employer | Get all jobs posted by current employer |

### Application Controller (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/apply/{jobId}` | Job Seeker | Submit application for a job |
| `GET` | `/api/applications/my-applications` | Job Seeker | Get applications submitted by logged-in seeker |
| `GET` | `/api/applications/employer` | Employer | Get all candidate applications for employer's jobs |
| `PATCH` | `/api/applications/{id}/status` | Employer | Update candidate status (`REVIEWING`, `SHORTLISTED`, etc.) |

---

## Project Structure

```
careernest/
├── backend/
│   ├── src/main/java/com/careernest/
│   │   ├── config/          # Spring Security, JWT Filter, CORS, Swagger OpenAPI
│   │   ├── controller/      # Auth, Job, Application, and Health REST controllers
│   │   ├── dto/             # Request & Response payload classes
│   │   ├── model/           # MongoDB document models (User, Job, Application)
│   │   ├── repository/      # Spring Data Mongo repositories
│   │   ├── service/         # Business logic & Twilio SMS service
│   │   └── seeder/          # Initial seed data for demo accounts
│   ├── pom.xml              # Maven dependencies
│   └── Dockerfile           # Backend Docker container configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Footer, Modals, Badges)
│   │   ├── pages/           # Pages (Home, Login, Register, Jobs, Dashboards)
│   │   ├── services/        # Axios API client with JWT interceptor
│   │   ├── store/           # Redux Toolkit state slices
│   │   └── types/           # TypeScript interfaces
│   ├── package.json         # React dependencies
│   ├── tailwind.config.js   # Tailwind styling config
│   └── vercel.json          # Vercel deployment configuration
├── docker-compose.yml       # Local multi-container development setup
├── API_DOCUMENTATION.md     # Detailed API request/response documentation
└── README.md                # Project documentation
```

---

## Local Setup & Installation

### Prerequisites
- JDK 17 or higher
- Node.js 18 or higher & npm
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
The backend starts at `http://localhost:8080`.
Swagger API documentation: `http://localhost:8080/swagger-ui.html`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at `http://localhost:5173`.

---

## Deployment Instructions

### Backend (Render / Railway)
1. Link the GitHub repository on Render.
2. Select **Web Service** with **Root Directory** as `backend` and runtime as **Docker**.
3. Add Environment Variables:
   - `PORT`: `8080`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<A random 256-bit string>`
   - `CORS_ALLOWED_ORIGINS`: `*` (or your frontend domain)
   - `TWILIO_ENABLED`: `false` (set to `true` if supplying Twilio SID & Token)
4. Deploy the service.

### Frontend (Vercel)
1. Import repository on Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-backend-render-url>/api`
5. Click **Deploy**.
