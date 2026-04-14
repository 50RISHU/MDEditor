# MDEditor

A modern, feature-rich Markdown editor built with React, TypeScript, and Vite. Create, preview, and edit Markdown documents with support for GitHub Flavored Markdown, LaTeX math expressions, and AI-powered enhancements.

## Features

- ✨ **Live Preview** - Real-time markdown rendering as you type
- 📝 **Rich Markdown Support** - GitHub Flavored Markdown (GFM) with all standard extensions
- 🧮 **LaTeX Math** - Full support for mathematical expressions using KaTeX
- 🤖 **AI Integration** - Powered by Google Gemini API for intelligent assistance
- 🎨 **Beautiful UI** - Modern interface with Tailwind CSS and smooth animations
- 💾 **Local Storage** - Automatically save your work locally
- ⌨️ **Intuitive Editor** - Responsive sidebar navigation and component-based design
- 🎯 **Syntax Highlighting** - Clean, readable code formatting

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Markdown**: react-markdown, remark-gfm, remark-math
- **Math**: KaTeX, rehype-katex
- **Backend**: Express
- **AI**: Google Gemini API
- **Utilities**: date-fns, uuid, Motion (animations)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MDEditor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run clean` - Remove dist directory
- `npm run lint` - Type check with TypeScript

## Configuration

The project uses Vite for fast development and optimized builds. Key configurations:

- **Vite Config**: Configured with React plugin and Tailwind CSS support
- **TypeScript**: Strict mode enabled for type safety
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Path Alias**: `@` is aliased to the root directory

## Development

The editor uses a component-based architecture:

- **Editor**: Main editing interface with syntax highlighting
- **Preview**: Real-time markdown rendering
- **Sidebar**: Navigation and document management

All components are built with React hooks and TypeScript for maximum type safety.

## Build for Production

```bash
npm run build
```

This generates optimized production-ready files in the `dist` directory.

