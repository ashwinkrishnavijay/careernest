# CareerNest — API Documentation Reference

Interactive Swagger UI is accessible at:
- **Local:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec:** `http://localhost:8080/v3/api-docs`

---

## Base URLs
- **Local Development:** `http://localhost:8080/api`
- **Production (Render / Railway):** `https://<your-backend-app>.onrender.com/api`

---

## Authentication & Headers
Protected endpoints require an HTTP `Authorization` header containing the JWT token returned by `/auth/login` or `/auth/register`:
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Access:** Public
- **Request Body (Job Seeker):**
```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "password": "password123",
  "phone": "+15550143892",
  "role": "JOB_SEEKER"
}
```
- **Request Body (Employer):**
```json
{
  "name": "Sarah Jenkins",
  "email": "sarah@techcorp.com",
  "password": "password123",
  "phone": "+15550198234",
  "role": "EMPLOYER",
  "companyName": "TechCorp Global",
  "companyWebsite": "https://techcorp.example.com"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully. Role assigned: JOB_SEEKER",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": "673752e8f1b2...",
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "phone": "+15550143892",
    "role": "JOB_SEEKER",
    "companyName": null
  }
}
```

---

### 1.2 Login User
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "employer@careernest.com",
  "password": "password123"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": "673752...",
    "name": "Sarah Jenkins",
    "email": "employer@careernest.com",
    "phone": "+15550198234",
    "role": "EMPLOYER",
    "companyName": "TechCorp Global"
  }
}
```

---

### 1.3 Get Current User Profile
- **Method:** `GET`
- **URL:** `/api/auth/me`
- **Access:** Authenticated (Bearer Token required)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": "673752...",
    "name": "Sarah Jenkins",
    "email": "employer@careernest.com",
    "phone": "+15550198234",
    "role": "EMPLOYER",
    "companyName": "TechCorp Global"
  }
}
```

---

## 2. Job Listings (`/api/jobs`)

### 2.1 Search and Browse Jobs
- **Method:** `GET`
- **URL:** `/api/jobs?keyword=java&location=remote`
- **Access:** Public
- **Query Parameters:**
  - `keyword` *(optional)*: Matches job title, description, or company name.
  - `location` *(optional)*: Matches job location (case-insensitive regex).
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Job listings retrieved",
  "data": [
    {
      "id": "673753a...",
      "title": "Senior Full Stack Java Developer",
      "description": "Looking for an experienced engineer with Spring Boot & React...",
      "location": "San Francisco, CA (Remote)",
      "salary": "$135,000 - $165,000 / year",
      "deadline": "2026-12-15",
      "company": "TechCorp Global",
      "employmentType": "Full-time",
      "requirements": ["5+ years Java / Spring Boot", "React & TypeScript", "MongoDB"],
      "employerId": "673752...",
      "employerName": "Sarah Jenkins",
      "employerEmail": "employer@careernest.com",
      "active": true,
      "applicantCount": 4,
      "appliedByCurrentUser": false,
      "createdAt": "2026-11-13T10:00:00"
    }
  ]
}
```

---

### 2.2 Get Single Job Details
- **Method:** `GET`
- **URL:** `/api/jobs/{id}`
- **Access:** Public

---

### 2.3 Post a New Job
- **Method:** `POST`
- **URL:** `/api/jobs`
- **Access:** Employer only (`hasRole('EMPLOYER')`)
- **Headers:** `Authorization: Bearer <employer_token>`
- **Request Body:**
```json
{
  "title": "DevOps & Cloud Specialist",
  "description": "Lead our AWS infrastructure and automated CI/CD pipelines.",
  "location": "Austin, TX (Remote)",
  "salary": "$120,000 - $150,000 / year",
  "deadline": "2026-12-31",
  "company": "TechCorp Global",
  "employmentType": "Full-time",
  "requirements": [
    "AWS & Docker mastery",
    "Terraform IaC",
    "CI/CD automation with GitHub Actions"
  ]
}
```
- **Response (`201 Created`):** Returns the created job and dispatches confirmation SMS to the employer.

---

### 2.4 Update Job
- **Method:** `PUT`
- **URL:** `/api/jobs/{id}`
- **Access:** Employer only (must be job owner)

---

### 2.5 Delete Job
- **Method:** `DELETE`
- **URL:** `/api/jobs/{id}`
- **Access:** Employer only (must be job owner)

---

### 2.6 Get Employer's Posted Jobs
- **Method:** `GET`
- **URL:** `/api/jobs/my-jobs`
- **Access:** Employer only

---

## 3. Job Applications (`/api/applications`)

### 3.1 Apply for a Job
- **Method:** `POST`
- **URL:** `/api/applications/apply/{jobId}`
- **Access:** Job Seeker only (`hasRole('JOB_SEEKER')`)
- **Headers:** `Authorization: Bearer <seeker_token>`
- **Request Body:**
```json
{
  "phone": "+15550143892",
  "resumeUrl": "https://linkedin.com/in/alex-rivera",
  "coverLetter": "I have 5+ years building full stack web applications with Spring Boot and React."
}
```
- **Response (`201 Created`):**
  - Saves the application document.
  - Sends candidate SMS confirmation: *"Hi Alex, your application for 'Senior Full Stack Java Developer' at TechCorp Global has been submitted successfully on CareerNest!"*
  - Sends employer SMS alert: *"Hello Sarah, you received a new application for 'Senior Full Stack Java Developer' from Alex Rivera on CareerNest."*

---

### 3.2 Get Seeker's Submitted Applications
- **Method:** `GET`
- **URL:** `/api/applications/my-applications`
- **Access:** Job Seeker only

---

### 3.3 Get Applications for Employer's Jobs
- **Method:** `GET`
- **URL:** `/api/applications/employer?jobId={optionalJobId}`
- **Access:** Employer only

---

### 3.4 Update Application Status & Notify Candidate (Twilio SMS)
- **Method:** `PATCH`
- **URL:** `/api/applications/{id}/status`
- **Access:** Employer only
- **Headers:** `Authorization: Bearer <employer_token>`
- **Request Body:**
```json
{
  "status": "SHORTLISTED",
  "notes": "Impressive background in Spring Boot. Scheduled for technical interview."
}
```
- **Allowed Statuses:** `APPLIED`, `REVIEWING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`
- **Action:**
  - Updates the application status in MongoDB.
  - Dispatches an automated Twilio SMS directly to candidate's phone:
    *"Hi Alex Rivera, your application status for 'Senior Full Stack Java Developer' at TechCorp Global has been updated to: SHORTLISTED. Note: Impressive background in Spring Boot. Scheduled for technical interview."*
