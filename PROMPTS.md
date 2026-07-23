# PROMPTS.md

# AutoVault - AI Tooling Chat History

This document records the AI prompts and AI-assisted interactions used during the development of **AutoVault – Car Dealership Inventory System**. 

## AI Tools Used

- **ChatGPT** – Used for initial project planning, REST API architectural design, and conceptual TDD guidance.
- **Gemini / Antigravity** – Used extensively for executing TDD cycles (Red/Green/Refactor), generating React UI components, styling with Tailwind CSS, debugging integration tests, and fixing full-stack routing and backend bugs.

---

## 1. Project Planning & TDD Workflow
### Tool Used: ChatGPT
### Prompt:
> The goal is to build a full-stack Car Dealership Inventory System. Backend: Node/Express, JWT auth, vehicle management, purchasing. Frontend: React, Tailwind. Help me plan the features step by step and explain how to use the Red-Green-Refactor TDD workflow.
### Usage:
Used to divide the project into logical phases and establish strict testing conventions.

---

## 2. Authentication API & JWT Logic
### Tool Used: ChatGPT
### Prompt:
> Write integration test cases for user registration and login endpoints (POST /api/auth/register and /login). Also create authentication middleware using JWT that attaches decoded info to req.user, including an admin role check.
### Usage:
Guided the backend authentication structure and initial RED phase tests for user logic.

---

## 3. Vehicle Inventory API
### Tool Used: Gemini / Antigravity
### Prompt:
> Help me implement the Vehicle features using TDD: Add, Get All, Search, Update, Delete, and Restock. Delete and restock must be Admin-only. Protect with JWT. I want failing tests first before implementing the API logic.
### Usage:
Gemini generated comprehensive Jest test suites, followed by robust Express controllers handling validation and admin authorization.

---

## 4. Premium Frontend & Landing Page
### Tool Used: Gemini / Antigravity
### Prompt:
> Create a modern React + Tailwind CSS frontend for AutoVault. Use a premium dark automotive design. Build a navbar, a large hero section with "Find Your Perfect Drive", and responsive layouts. Generate frontend UI only.
### Usage:
Gemini generated the foundational frontend UI, which was then iterated upon for spacing and layout corrections.

---

## 5. React Router & Frontend Debugging
### Tool Used: Gemini / Antigravity
### Prompt:
> I am getting a React Router error: Cannot destructure property 'basename' of useContext(...) as it is null. Also, my login tests are returning 404 instead of 401. Help me debug these.
### Usage:
AI quickly diagnosed missing `BrowserRouter` wrappers on the frontend and incorrect route registrations on the backend.

---

## 6. Dashboards & Interface UIs
### Tool Used: Gemini / Antigravity
### Prompt:
> Create separate dashboard interfaces for users and admins. Users can browse, search, and view vehicles. Admins can view inventory, add, update, delete, and restock vehicles. Keep the premium dark theme. Also create a dedicated Vehicle Details page showing a gallery, specs, price, and stock quantity.
### Usage:
Gemini scaffolded the entire role-based UI flow, creating highly modular React components for both user types.

---

## 7. Purchase Vehicle Workflow (TDD)
### Tool Used: Gemini / Antigravity
### Prompt:
> We are implementing the Purchase Vehicle feature using TDD. This is the RED phase for POST /api/vehicles/:id/purchase. Write tests covering successful purchases (decreasing quantity by 1), zero quantity rejections, non-existent vehicles, and missing JWTs. After RED, implement the GREEN phase controller and Purchase model.
### Usage:
Gemini wrote strict failing tests, and then implemented the exact database logic to decrement stock safely and record the purchase history.

---

## 8. Purchase Tracking & UI Integration
### Tool Used: Gemini / Antigravity
### Prompt:
> Connect the Purchase workflow to the frontend. Show a confirmation modal when clicking "Purchase". On success, create a "My Purchases" page (Route: /my-purchases) that fetches GET /api/users/purchases and displays the user's order history with images and prices.
### Usage:
Gemini wired up the API calls in React, handled loading states, and built a dynamic "Track Purchases" garage UI to replace static placeholders.

---

## 9. Price Formatting & Final Cleanup
### Tool Used: Gemini / Antigravity
### Prompt:
> Make the car prices display in Indian Rupees (INR) instead of Dollars. Also clean up any unnecessary scaffolding or unused files.
### Usage:
AI utilized `Intl.NumberFormat` for INR currency rendering globally and safely deleted unused CSS and placeholder files.

---

# AI-Assisted Development Notes

- **Verification:** AI was used as a rapid development assistant, not a blind code generator. All API logic was strictly validated using automated Jest integration tests before manual frontend testing.
- **TDD Enforcement:** The Red-Green-Refactor methodology was enforced by prompting the AI specifically for "RED phase" tests before allowing it to write "GREEN phase" controllers.
- **Iterative UI:** Frontend components were generated in structural blocks by the AI and manually refined for exact visual alignment and spacing.
