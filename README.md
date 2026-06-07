
# TokBatch Downloader

> A modern, fast, and efficient batch downloader built with React, TypeScript, and Vite. Download multiple files at once and package them into a zip archive.

[![Language](https://img.shields.io/badge/language-TypeScript-blue?logo=typescript)]()
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)]()
[![Vite](https://img.shields.io/badge/Vite-6.2-blue?logo=vite)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## ✨ Features

- ⚡ **Lightning Fast** - Built with Vite for instant hot reload and fast builds
- 📦 **Batch Download** - Download multiple files at once with ease
- 🎯 **Zip Archive** - Automatically package files into zip format
- 💾 **Local Processing** - All processing happens locally, no server needed
- 🎨 **Modern UI** - Clean and intuitive interface with Tailwind CSS
- 🔒 **Type Safe** - Full TypeScript support for reliability
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**

Verify your installation:
```bash
node --version
npm --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/BrK08/tokbatch-downloader.git
cd tokbatch-downloader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another available port). Open your browser and begin downloading!

## 📚 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module reloading |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |

## 🏗️ Project Structure

```
tokbatch-downloader/
├── src/
│   ├── components/          # Reusable React components
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application-wide styles
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript compiler options
├── tailwind.config.js       # Tailwind CSS customization
└── README.md                # Project documentation
```

## 🛠️ Technology Stack

### Core Dependencies
- **React** (v19.2.1) - Modern UI library
- **TypeScript** (v5.8.2) - Type-safe JavaScript development
- **Vite** (v6.2.0) - Next-generation build tool

### Styling & UI
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **PostCSS** (v8.4.32) - CSS preprocessing
- **Autoprefixer** (v10.4.17) - CSS vendor prefixes
- **Lucide React** (v0.559.0) - Icon library

### File Management
- **jszip** (v3.10.1) - ZIP archive creation
- **file-saver** (v2.0.5) - File download functionality

### Development Tools
- **@vitejs/plugin-react** (v5.0.0) - Vite React plugin

## 📖 Usage Guide

### Getting Started

1. **Launch the Application**
   ```bash
   npm run dev
   ```

2. **Add Files**
   - Use the interface to select or drag-and-drop files
   - Multiple file formats are supported

3. **Configure Your Download**
   - Set the output archive filename
   - Organize files into folders (optional)
   - Adjust any other settings as needed

4. **Download**
   - Click the download button to save the zip file to your computer
   - The file will be packaged automatically

### Production Deployment

Build an optimized production version:

```bash
npm run build
```

The compiled files will be in the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```

## ⚙️ Configuration

### Customize Vite Build Settings

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Customize Tailwind CSS

Modify `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🤝 Contributing

We welcome contributions from the community! Follow these steps:

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/tokbatch-downloader.git
cd tokbatch-downloader
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Implement Your Changes
- Write clean, maintainable code
- Use TypeScript for type safety
- Follow the existing code style and conventions
- Test your changes thoroughly

### 4. Commit Your Work
```bash
git commit -m 'Add meaningful commit message'
```

### 5. Push to Your Branch
```bash
git push origin feature/your-feature-name
```

### 6. Submit a Pull Request
- Provide a clear description of your changes
- Reference any related issues
- Include screenshots if applicable

## 📝 Code Standards

- **Language**: TypeScript for all new code
- **Components**: Functional components with React hooks
- **Architecture**: Keep components modular and reusable
- **Naming**: Use descriptive names for variables and functions
- **Documentation**: Add comments for complex logic

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is unavailable, Vite will automatically use the next available port. Check your terminal output for the actual URL.

### Fix Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Ensure you're using Node.js v16 or higher:
```bash
node --version
```

Update to the latest version if needed:
```bash
npm install -g npm@latest
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 👨‍💻 Author

**BrK08** - [GitHub Profile](https://github.com/BrK08)

## 🙌 Acknowledgments

- [React Team](https://react.dev) - For the excellent UI library
- [Vite](https://vitejs.dev) - For the ultra-fast build tool
- [Tailwind CSS](https://tailwindcss.com) - For modern styling solutions
- [jszip](https://stuk.github.io/jszip/) - For ZIP file creation
- All contributors and supporters of this project

## 📞 Getting Support

If you encounter issues or have questions:

1. **Search Existing Issues** - Check [GitHub Issues](https://github.com/BrK08/tokbatch-downloader/issues)
2. **Open a New Issue** - [Report a Bug](https://github.com/BrK08/tokbatch-downloader/issues/new)
3. **Start a Discussion** - [Ask Questions](https://github.com/BrK08/tokbatch-downloader/discussions)

---

<div align="center">

**⭐ If you find this project helpful, please consider starring it!**

Made with ❤️ by [BrK08](https://github.com/BrK08)

</div>
