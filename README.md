# Apni Sec Assignment

A simple security issue management system built with Next.js. Track your Cloud Security, Redteam Assessment, and VAPT issues all in one place.

## What it does

This is a web application where you can create an account, log in, and manage security issues. Each issue has a title, description, type, priority, and status. You'll get email notifications when important things happen.

## Getting started

First, you need to set up your environment variables. Copy the example file and fill in your details:

```bash
cp .env.example .env
```

Then edit the .env file with your database connection and email settings.

Install the dependencies:

```bash
bun install
```

Set up the database:

```bash
bun run prisma migrate dev
```

Start the development server:

```bash
bun run dev
```

Open http://localhost:3000 in your browser.

## Running with Docker

If you prefer Docker, you can build and run the application in a container:

```bash
docker build -t apni-sec .
docker run -p 3000:3000 apni-sec
```

Make sure to pass your environment variables when running the container.

## Project structure

The code is organized like this:

- app - all the pages and API routes
- components - reusable UI components
- core - business logic and utilities
- prisma - database schema and migrations
- public - static files like images and videos

## Tech stack

Built with Next.js 16, React 19, Prisma, PostgreSQL, and Tailwind CSS. Uses JWT for authentication and Resend for emails.

## Notes

This is a hiring assignment for Apni Sec. The authentication is basic but functional. Rate limiting is implemented to prevent abuse. All passwords are hashed with bcrypt.

## License

This project is for educational purposes.
