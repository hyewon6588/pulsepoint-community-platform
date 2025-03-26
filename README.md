# pulsepoint-community-platform
## Vite MF + GraphQL Community Platform

A modern community engagement platform built with Micro Frontends (Vite Module Federation) and GraphQL Microservices using Apollo Server and Express.js.  

---

## Tech Stack

### Frontend
- React + Vite
- Micro Frontends (Module Federation Plugin)
- Apollo Client
- React Bootstrap

### Backend
- Express.js
- Apollo Server (Federated)
- GraphQL
- MongoDB (Mongoose)
- JWT (User Authentication)
- Password Hashing (bcrypt)

---

## Microservice Architecture

| Microservice | Description |
|--------------|-------------|
| `auth-service` | Handles user registration, login, and authentication |
| `community-service` | Handles community posts and help requests |
| `shell-app` | Main container app using Vite MF |
| `user-app` | Auth Micro Frontend (login/signup/logout) |
| `community-app` | Community Micro Frontend (posts/help requests) |

---

## Features

- User Signup/Login (Resident, Business Owner, Community Organizer)
- Community Posts: News & Discussions
- Help Requests with volunteer/resolution features
- Role-based UI rendering (e.g. only Residents can request help)
- Federated GraphQL schema integration
