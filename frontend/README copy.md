# Preference Grammar Generator

A modern web application for analyzing and generating preferred grammar forms based on user-uploaded audio and custom criteria. Built with React, Vite, Tailwind CSS, and Material UI.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [License](#license)

## Overview

Preference Grammar Generator allows users to upload audio files, specify a target word, set evaluation criteria, and receive detailed analysis and results. The app is designed for linguists, language teachers, and researchers interested in phonetic and pronunciation analysis.

## Features

- **Audio Upload:** Drag-and-drop or browse to upload audio files for analysis.
- **Target Word Analysis:** Enter a word to analyze its IPA (International Phonetic Alphabet) representation.
- **Custom Criteria:** Adjust sliders for criteria such as International Acceptance, Dis-ambiguity, Contrastiveness, Pedagogic Convenience, Phonetic Simplicity, and Frequency.
- **Results Dashboard:** View transcriptions, audio duration, segment breakdowns, and IPA errors.
- **Modern UI:** Responsive, accessible, and visually appealing interface using Material UI and Tailwind CSS.

## Screenshots

> _Add screenshots of the main app screens here._

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd PG_MAIN
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variable:
     ```env
     VITE_API_BASE_URL=<your-api-base-url>
     ```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Available Scripts

- `npm run dev` — Start the development server with hot reloading
- `npm run build` — Build the app for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint for code quality

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Material UI
- **State Management:** React Hooks
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Linting:** ESLint

## Project Structure

```
PG_MAIN/
  public/
  src/
    api/           # API utilities (if any)
    assets/        # Images, SVGs, etc.
    components/    # Reusable UI components
    pages/         # Main app pages (Upload, Target Word, Criteria, Results)
  .env             # Environment variables
  package.json     # Project metadata and scripts
  vite.config.js   # Vite configuration
```

## License

© 2025 Preference Grammar Generator. All rights reserved.
