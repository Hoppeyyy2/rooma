Welcome to Rooma Project ! (https://rooma.ca/login)

Rooma is a scheduling and communication aids application for people who live together. The app is designed for people to communicate with each other regarding house rules and chores. By using Rooma, people can create tasks, divide house-hold chores, combine schedules, and find future roommates to live with. Our goal is to build an app that helps resolve issues regarding miscommunication and conflicts between roommates and people who live together.

This application was build with 6 people in total: 3 designers/front-end developers and 3 full-stack developers. We constantly encounted several challenges regarding concept of ideas, user-friendliness designs, and development processes. However, we always respect, communicate, and support each other to overcome the obstacles.

For Getting know more about Rooma project, such as description, process, and blogs, please visit https://leahma.com/rooma/

Thank you for reading and have fun with Rooma!

## Run locally

The Next.js app is in `app/`. To preview the frontend without the Docker backend, copy the example demo configuration and start the app:

```bash
cd app
cp .env.local.example .env.local
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo mode uses sample roommates and stores interactions in this browser: add and complete chores, earn points, create and delete calendar events, edit the profile, and try the invite code `ROOM24`. The sample data remains in local storage between visits.

To connect to the backend instead, remove `app/.env.local` and start the Docker services from the repository root with `docker compose up -d`.

The app's npm scripts include the OpenSSL compatibility option needed by this legacy Next.js version on current Node.js releases.
