# MDEditor

A modern, feature-rich Markdown editor built with React, TypeScript, and Vite. Create, preview, and edit Markdown documents with support for GitHub Flavored Markdown, LaTeX math expressions, and integrated task management.

## Features

- ✨ **Live Preview** - Real-time markdown rendering as you type, with side-by-side or stacked view options.
- 📝 **Rich Markdown Support** - GitHub Flavored Markdown (GFM) with all standard extensions.
- 🧮 **LaTeX Math** - Full support for mathematical expressions using KaTeX.
- 🌓 **Theme Support** - Toggle between elegant Light and Dark modes.
- 🔄 **Import & Export** - Easily import existing `.md` files and export your notes as markdown.
- ✅ **Task Management** - Built-in Todo list tracker directly in the sidebar.
- 💾 **Local Storage** - Automatically save your notes and tasks locally in your browser.
- ⌨️ **Intuitive Editor** - Responsive sidebar navigation, component-based design, and mobile-friendly layout.
- 🎯 **Syntax Highlighting** - Clean, readable code block formatting.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Markdown**: react-markdown, remark-gfm, remark-math
- **Math**: KaTeX, rehype-katex
- **Utilities**: date-fns, uuid, clsx, tailwind-merge

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

## Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at the URL provided in your terminal (typically `http://localhost:5173` or `http://localhost:3000`).

## Build for Production

To create an optimized production build:

```bash
npm run build
```

This generates production-ready static files in the `dist` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
