# Project Notes: Service Portal with n8n Chat Integration

## Summary of Requirements and Decisions

### 1. Project Overview
- Build a service portal where users can register and log in.
- After login, users will see a selection of role-based cards (e.g., Customer Engineer, Azure Engineer, Project Manager, Service Manager).
- Each card leads to a tailored chat experience that showcases specific n8n workflows for that role.
- The portal will start as a standalone app, with the option to integrate into the main company portal later.

### 2. User Flow
- User signs up for an account using an email address.
- After logging in, the user is presented with a dashboard displaying multiple cards, with a maximum of three cards per row.
- Users select a card to enter a chat experience tailored to that role, demonstrating the relevant n8n flows.

### 3. Chat Integration
- n8n webhook URL: `http://localhost:5678/webhook/122742ad-e48e-468a-905d-e7b5b3cd24c6/chat` (update to your hosted n8n URL as needed).
- The backend will POST chat messages to this webhook and relay responses back to the frontend.
- Real-time chat will be implemented using WebSockets between the frontend and backend.
- **n8n will be accessed as an externally hosted service, not run locally in Docker Compose.**

### 4. Architecture
- **Frontend:** React (styled like Conclusion, with branding extracted from their website).
- **Backend:** Node.js (using Express or Fastify, with WebSocket support).
- **Database:** PostgreSQL (for user accounts; chat history can be added later).
- **All services except n8n will run in Docker Compose.**

### 5. Admin Panel Capabilities
- Manage user accounts (add, remove, block/unblock users).
- Manage role-based cards (add or remove cards to showcase different n8n workflows).

### 6. Database Schema (Initial)
- **users table:** id, email, password_hash, role, status, created_at, and a blocked field for admin functionality.

### 7. Real-Time Chat
- WebSocket connection between frontend and backend for instant messaging.
- Backend relays messages to the n8n webhook and returns responses to the frontend.

### 8. Layout and UI
- The dashboard will display cards in rows of three, ensuring a clean and organized look.
- Responsive design to ensure a good user experience across different devices.

### 9. Docker Compose
- All components (frontend, backend, PostgreSQL) will be orchestrated with Docker Compose.
- **n8n is not included in Docker Compose; it is accessed as an external service.**

### 10. Outstanding Questions
- Confirm message format expected/returned by n8n webhook.
- No additional services (like Redis) needed for now.

---

**Backend will be implemented in Node.js as per latest decision.** 