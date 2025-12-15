# Teamwork Marketing - Front-end Assessment

A reusable accordion component built with Nuxt 4 and Sass, based on the Teamwork Marketing design specifications.

## Project Overview

This project implements an accordion section that fetches content from a provided API endpoint and displays it with full responsiveness, accessibility, and performance optimizations.

**Stack:** Nuxt 4, Sass

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Components

- **Accordion.vue** - Main accordion component with expand/collapse functionality
- **SectionAccordion.vue** - Reusable accordion section with image handling and state management
- **Icon.vue** - Reusable icon component
- **Spinner.vue** - Loading state indicator

## Features

- ✅ Responsive design (mobile to desktop)
- ✅ Keyboard navigation support
- ✅ Performance optimized (Core Web Vitals)
- ✅ Accessibility compliant (ARIA attributes, screen reader support)
- ✅ Error handling with retry functionality
- ✅ Image lazy loading and fallback states
- ✅ Modular and reusable component architecture