# PlacementHub

## Overview
PlacementHub is a Student Placement Management Platform designed to help students manage their placement profiles, discover jobs, apply to companies, and track their applications. 

## Features
- Phase 1: Initial Setup
- (Future phases will include Student, Company, and Job modules)

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.3, Spring Data JPA, Hibernate, MySQL, Spring Security (JWT)
- **Frontend:** React 18, Vite, React Router, Axios

## Setup Instructions

### Environment Variables
1. Copy `.env.example` to `.env`
2. Update the credentials in `.env` as required.

### Running Backend
1. Ensure Java 21 and Maven are installed.
2. Navigate to the `backend` directory.
3. Run `mvn spring-boot:run`
4. The server will start on `http://localhost:8080`

### Running Frontend
1. Ensure Node.js is installed.
2. Navigate to the `frontend` directory.
3. Run `npm install`
4. Run `npm run dev`
5. The application will start on `http://localhost:5173`

## Author
Built as a learning project for Java Full Stack Development.
