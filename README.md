# Flow Board

Project Prompt: Build a Professional Kanban Project Management Application

You are an experienced Senior Frontend Engineer and UI/UX Designer.

Your task is to build a modern, production-quality Kanban Project Management web application using React, HTML5, CSS3, and JavaScript (ES6+).

The application should look like something a SaaS company would release, not a beginner tutorial project.

Technology Stack

React (Vite)

HTML5

CSS3 (no Bootstrap)

JavaScript ES6+

React Router

Context API for state management

Local Storage for persistence

Responsive Design

CSS Variables for theming

Overall Goal

Build a Trello-inspired project management application where users can organize projects into boards, manage tasks, drag and drop cards between columns, assign priorities, and monitor progress.

Everything should be modular, reusable, and production-ready.

UI Style

Use a clean modern SaaS design.

Design language:

Plenty of whitespace

Rounded corners

Soft shadows

Smooth animations

Professional typography

Modern icons

Responsive layout

Dark mode

Light mode

Glassmorphism where appropriate (subtle)

Beautiful loading states

Empty states

Hover animations

Micro-interactions

Color palette should be modern and professional.

Authentication Screens (UI only)

Create:

Login page

Register page

Forgot Password page

Authentication does not need a backend.

Dashboard

Dashboard should contain:

Sidebar navigation

Top navigation

User profile

Search bar

Notification icon

Theme switch

Statistics cards

Statistics should display:

Total Projects

Total Tasks

Tasks Completed

Tasks Due Today

Include charts using mock data.

Project Boards

Users should be able to:

Create projects

Rename projects

Delete projects

Archive projects

Favorite projects

Each project should contain Kanban columns.

Kanban Columns

Default columns:

Backlog

To Do

In Progress

Review

Completed

Users should be able to:

Add columns

Rename columns

Delete columns

Reorder columns

Task Cards

Each task should support:

Title

Description

Priority

Due Date

Labels

Assignee Avatar

Checklist

Attachments (UI only)

Comments

Activity History

Users should be able to:

Create tasks

Edit tasks

Delete tasks

Duplicate tasks

Move tasks

Drag and Drop

Implement smooth drag-and-drop functionality.

Users should be able to drag tasks:

Between columns

Within the same column

Animations should be smooth.

Task Details Modal

Clicking a task opens a detailed modal.

Include:

Full description

Editable checklist

Comments

Due date

Priority

Labels

Activity log

Attachments section

Assigned user

Search

Implement live search that filters:

Tasks

Labels

Projects

Results should update instantly.

Filters

Users should filter tasks by:

Priority

Labels

Due Date

Completed

Assignee

Notifications

Create a notification panel.

Example notifications:

Task completed

Due tomorrow

New project created

Comment added

Calendar View

Include a calendar showing tasks by due date.

Activity Timeline

Create an activity feed showing:

Task created

Task edited

Card moved

Task completed

User Settings

Settings page should include:

Profile

Password (UI only)

Notification preferences

Theme

Language selector

Dark Mode

Implement complete dark mode using CSS variables.

Persist user preference in Local Storage.

Responsive Design

Application should work perfectly on:

Desktop

Laptop

Tablet

Mobile

Sidebar should collapse on smaller screens.

Animations

Include smooth animations for:

Modals

Buttons

Cards

Navigation

Dragging

Loading

Theme switching

Use CSS transitions or Framer Motion.

Accessibility

Follow accessibility best practices:

Semantic HTML

Keyboard navigation

Focus states

Proper labels

Sufficient color contrast

ARIA attributes where needed

Folder Structure

Use a scalable project structure.

Example:

src/
components/
pages/
layouts/
hooks/
context/
services/
assets/
styles/
utils/
data/

Keep components small and reusable.

Code Quality

Requirements:

Clean code

Reusable components

Meaningful variable names

Proper folder organization

Comments only where necessary

No duplicated code

Mock Data

Populate the application with realistic example data.

Include:

Multiple projects

Multiple users

Various priorities

Different due dates

Different task statuses

The application should feel like a real product immediately after opening.

Bonus Features

If possible, also implement:

Command palette (Ctrl + K)

Keyboard shortcuts

Toast notifications

Undo delete

Recently viewed tasks

Favorites

Export board to JSON

Import board from JSON

Pomodoro timer widget

Productivity statistics

Progress charts

Final Deliverable

Produce a complete, fully functional React application.

Do not simplify the project.

Generate the project one feature at a time, maintaining a clean architecture throughout.

Whenever a new feature is added, explain:

Which files were created.

Which files were modified.

Why the architecture was chosen.

How the feature integrates with the rest of the application.

The final result should be polished enough to be included in a professional frontend developer portfolio and demonstrate intermediate-to-advanced React skills.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4220f021-44e4-4ecd-a1d3-f011202105d8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
