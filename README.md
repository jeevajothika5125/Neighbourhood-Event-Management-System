# 🏘️ Neighbourhood Event Management System

## 📌 Project Overview
The **Neighbourhood Event Management System** is a full-stack web application developed to simplify the organization and management of community events. The system provides a centralized digital platform where residents and organizers can efficiently create, manage, and participate in neighbourhood events.

In many communities, event information is often shared through scattered mediums such as WhatsApp groups, posters, or word of mouth, leading to communication gaps and reduced participation. This application eliminates these challenges by offering a unified platform for event coordination and interaction.

---

## 🎯 Objectives
- Provide a centralized platform for neighbourhood event management
- Improve communication among community members
- Enable easy creation and management of events
- Increase participation in local activities
- Ensure secure and controlled access using role-based permissions

---

## 🔐 Role-Based Access Control (RBAC)
The system follows a **Role-Based Access Control (RBAC)** model to ensure secure and controlled system usage.

Each user is assigned specific permissions based on their role:

### 👨‍💼 Admin
- Manage all events
- Monitor users and activities
- Approve or remove event details
- Maintain overall system control

### 📅 Organizer
- Create new events
- Update event details
- Delete or manage events
- View participant information

### 👥 Participant
- View available events
- Register for events
- Access event information and updates

✅ Ensures data security, controlled access, and efficient event management.

---

## 🚀 Key Features
- Event creation and management
- View upcoming neighbourhood events
- Update and delete event information
- Participant registration
- Role-based user access
- Centralized event information system
- User-friendly interface

---

## 🛠️ Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Spring Boot
- REST APIs

### Database
- MySQL

---

## 🏗️ Application Architecture

The Neighbourhood Event Management System follows a layered architecture pattern to ensure scalability, maintainability, and separation of concerns.

### 📦 Entity Layer
- Represents domain models and database entities
- Defines core objects such as:
  - Users
  - Events
  - Venues
- Maps application data to database tables using ORM concepts.

---

### ⚙️ Service Layer
- Contains business logic and core workflows
- Manages event lifecycle operations such as:
  - Event creation
  - Validation
  - Updates and deletion
- Acts as an intermediary between Controller and Repository layers.

---

### 🌐 Controller Layer
- Exposes RESTful API endpoints
- Handles HTTP requests and responses
- Processes client interactions from the frontend application
- Routes requests to appropriate services.

---

### 🗄️ Repository Layer
- Responsible for database interaction
- Performs CRUD operations
- Communicates directly with the database using Spring Data JPA.

---

✅ This layered architecture improves modularity, code reusability, and system maintainability.

---

## 📂 Functional Modules
- User Authentication
- Event Management Module
- Role Management System
- Participant Registration
- Event Information Dashboard

---

## ▶️ How to Run the Project

### Backend Setup (Spring Boot)
1. Open backend project in IDE
2. Configure database in `application.properties`
3. Run Spring Boot application

### Frontend Setup (React)
```bash
npm install
npm start
