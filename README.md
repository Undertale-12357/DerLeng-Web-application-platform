Derleng – Tourism Discovery and Travel Assistance Platform
1. Project Overview

Derleng is a full-stack web-based tourism platform designed to help travelers discover destinations, plan trips efficiently, and access localized services in Cambodia. The system addresses a common problem faced by tourists: uncertainty about where to visit, what to prepare, where to stay, and how to find trustworthy local guides.
Unlike traditional tourism platforms that focus mainly on reviews or listings, Derleng integrates destination discovery, travel preparation guidance, service packages, and community-based tourism support into a single platform. The project emphasizes empowering local service providers while offering visitors a structured and personalized travel experience.
This repository contains the complete system architecture, including frontend, backend, database design, and project documentation.

2. Project Objectives

The main objectives of the Derleng project are:
 - To assist tourists in discovering suitable destinations based on their preferences
 - To provide structured travel packages that include local guides, accommodations, and essential travel items
 - To support community-based tourism and local businesses
 - To design and implement a scalable full-stack web application using modern technologies
 - To follow software engineering best practices, including modular architecture and Scrum methodology

3. System Architecture Overview

Derleng follows a three-tier architecture:

Frontend (Client Layer)
 - Developed using React.js
 - Responsible for user interaction, UI rendering, and client-side routing
 - Communicates with the backend via RESTful APIs

Backend (Application Layer)
 - Built with Node.js and Express.js
 - Implements business logic, authentication, authorization, and API endpoints
 - Uses Sequelize ORM for database interaction

Database (Data Layer)
 - PostgreSQL relational database
 - Stores users, places, reviews, packages, bookings, and related entities

A detailed system architecture diagram is available in the docs/architecture/ directory.

4. Technology Stack

Frontend
 - React.js
 - Vite
 - Axios
 - React Router
 - Tailwind CSS / CSS Modules

Backend
 - Node.js
 - Express.js
 - Sequelize ORM
 - JSON Web Token (JWT)
 - bcrypt

Database
 - PostgreSQL

Tools & Documentation
 - Figma (UI/UX Design)
 - Lucidchart (UML Diagrams)
 - Swagger (API Documentation)
 - Git & GitHub (Version Control)

5. Repository Structure

derleng-project/
├── docs/                # Project documentation and diagrams
├── backend/             # Node.js + Express backend
├── frontend/            # React frontend
├── database/            # Database schema, seeds, migrations
├── README.md            # Project overview and instructions

Each folder contains its own internal structure following industry best practices.

6. Core Features
User Features
 - User registration and authentication
 - Destination discovery and browsing
 - Viewing detailed place information
 - Reading and writing reviews
 - Booking travel packages
 - Profile management

Service & Business Features
 - Local guide service packages
 - Accommodation recommendations
 - Travel preparation and item guidance
 - Community-based tourism support
 - Booking management

System Features
 - JWT-based authentication and authorization
 - Role-based access control (Admin, Provider, Visitor)
 - Pagination and search functionality
 - RESTful API design
 - Modular and scalable architecture

7. Development Methodology

The project follows the Scrum framework, with iterative development cycles (sprints).
So far, the project has completed:

 - Project proposal
 - Business plan
 - Business Model Canvas
 - UML diagrams (Use Case, Activity, Sequence, Domain Model)
 - UI/UX design using Figma

Implementation will proceed incrementally, starting with core authentication and user management.

8. Installation and Setup

Prerequisites
 - Node.js (v18 or later)
 - PostgreSQL
 - Git

   Backend Setup
   cd backend
   npm install
   npm run dev

   Frontend Setup
   cd frontend
   npm install
   npm run dev

Database Setup
 - Create a PostgreSQL database
 - Run schema and seed files located in the database/ folder

9. Documentation

All project documentation is available in the docs/ directory, including:
 - Business plan
 - Final report
 - UML diagrams
 - System architecture
 - Presentations

10. Project Status

Current Status:
The project is in the design-complete and implementation-start phase. Backend and frontend development will proceed according to the defined Scrum roadmap.

11. Team & Acknowledgement

This project is developed by a team of six students as part of an academic final project, under the guidance of an academic advisor.
Further acknowledgements and detailed roles are documented in the final report.

12. License

This project is developed for educational purposes only.
