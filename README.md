# User Story Creator

A lightweight web application for creating and formatting user stories. Fill out a simple form and generate properly formatted user stories that you can copy and use in your project documentation.

## What It Does
The User Story Creator provides a clean interface to build user stories with the following structure:

- **As a** [role] **I want** [action] **So that** [benefit]
- Background/Context (optional)
- Acceptance Criteria (optional, multiple items)
- Technical Information (optional, multiple items)

The application provides a live preview of the formatted user story and allows you to copy it to your clipboard with a single click. Empty optional fields are automatically excluded from the output.

## Features

- Password-protected access
- Live preview of formatted user story
- One-click copy to clipboard
- Dark mode support
- Clean, modern interface with smooth animations
- Responsive design

## How It's Built

This application is built with:

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

The application follows a component-based architecture with:
- Separated logic utilities
- Subcomponents in `__internal` folders
- Clean code organization (files under 200 lines)
- JSDoc documentation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm i
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Set your password in `.env`:

```
PASSWORD=your-secure-password-here
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
uscreator/
├── app/
│   ├── api/auth/        # Authentication endpoint
│   ├── icon.svg         # App icon
│   └── page.tsx         # Main page
├── components/
│   └── UserStoryCreator/
│       └── __internal/   # Subcomponents
├── types/               # TypeScript interfaces
├── utils/               # Utility functions
└── public/              # Static assets
```

## Security

The application is protected by a password stored in environment variables. Authentication state is persisted using cookies for convenience.
