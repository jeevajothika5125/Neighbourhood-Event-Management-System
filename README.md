# 🏘️ Neighbourhood Event Management System

## 📌 Project Overview
The **Neighbourhood Event Management System** is a full-stack web application designed to streamline the organization and management of community events. It provides a centralized platform where residents and organizers can efficiently create, manage, and participate in neighborhood activities.

Traditional event coordination often relies on scattered channels like WhatsApp, posters, or word-of-mouth, leading to communication gaps and low participation. This system unifies event management, communication, and participation tracking in one platform.

---

## 👩‍💻 Developer:

- **Name:** Jeevajothika D
- **Department:** B.Tech, Artificial Intelligence & Data Science (AIDS)
- **Year of Study:** Pre-Final Year Student
- **Institution:** Sri Krishna College of Engineering and Technology, Coimbatore

---

## 🎯 Objectives
- Centralize neighborhood event management  
- Enhance communication among community members  
- Simplify event creation, updates, and deletion  
- Increase community participation  
- Implement secure role-based access control  

---

## 🔐 Role-Based Access Control (RBAC)
The system implements **RBAC** to manage permissions efficiently.

### 👨‍💼 Admin
- Manage all events and participants  
- Monitor user activity  
- Approve, update, or remove events  
- Maintain overall system integrity  

### 📅 Organizer
- Create, update, and delete events  
- View participant registrations  
- Manage event lifecycle  

### 👥 Participant
- Browse available events  
- Register for events  
- Access real-time updates  

---

## 🚀 Key Features
- Event creation, updates, and deletion  
- View upcoming community events  
- Participant registration and tracking  
- Centralized event dashboard  
- Role-based user access  
- Responsive and user-friendly interface  

---

## 🛠️ Technology Stack

### Frontend
- React.js  
- HTML5, CSS3, JavaScript  

### Backend
- Spring Boot  
- RESTful APIs  

### Database
- MySQL  

---

## 🏗️ Application Architecture
The system follows a **layered architecture** for scalability and maintainability:

### 📦 Entity Layer
- Represents domain models and database entities  
- Core objects: Users, Events, Venues  
- Maps data to database tables using ORM  

### ⚙️ Service Layer
- Contains business logic  
- Handles event lifecycle operations  
- Intermediary between Controllers and Repositories  

### 🌐 Controller Layer
- Exposes RESTful API endpoints  
- Handles HTTP requests and responses  
- Routes requests to the appropriate services  

### 🗄️ Repository Layer
- Manages database interactions  
- Performs CRUD operations via Spring Data JPA  

---

## 📂 Functional Modules
- User Authentication  
- Event Management  
- Role Management System  
- Participant Registration  
- Event Information Dashboard  

---

## ▶️ How to Run the Project

### Backend Setup (Spring Boot)
1. Open the backend project in your IDE  
2. Configure the database in `application.properties`  
3. Run the Spring Boot application  

### Frontend Setup (React)
```bash
npm install
npm start 
