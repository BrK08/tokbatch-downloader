<div align="center">
<img width="1200" height="475" alt="TokBatch Downloader" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TokBatch Downloader

> A modern, fast, and efficient batch downloader built with React, TypeScript, and Vite. Download multiple files at once and package them into a zip archive.

[![Created](https://img.shields.io/badge/created-December%202025-blue)]()
[![Language](https://img.shields.io/badge/language-TypeScript-blue?logo=typescript)]()
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)]()
[![Vite](https://img.shields.io/badge/Vite-6.2-blue?logo=vite)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## ✨ Features

- ⚡ **Lightning Fast** - Built with Vite for instant hot reload and fast builds
- 📦 **Batch Download** - Download multiple files at once with ease
- 🎯 **Zip Archive** - Automatically package files into zip format
- 💾 **Local Download** - All processing happens locally, no server needed
- 🎨 **Modern UI** - Clean and intuitive interface with Tailwind CSS
- 🔒 **Type Safe** - Full TypeScript support for reliability
- 📱 **Responsive** - Works seamlessly on desktop and mobile

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**

Check your versions:
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

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port). Open it in your browser and start downloading!

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## 🏗️ Project Structure

```
tokbatch-downloader/
├── src/
│   ├── components/          # React components
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

## 🛠️ Tech Stack

### Core
- **React** (v19.2.1) - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** (v6.2.0) - Lightning-fast build tool

### Styling
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **PostCSS** (v8.4.32) - CSS transformations
- **Autoprefixer** (v10.4.17) - Vendor prefixes

### Utilities
- **jszip** (v3.10.1) - Create zip files
- **file-saver** (v2.0.5) - Save files to disk
- **lucide-react** (v0.559.0) - Icon library

### Development
- **TypeScript** (v5.8.2) - Type checking
- **Vite React Plugin** (v5.0.0) - React support for Vite

## 🎯 How to Use

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Add Files**
   - Use the interface to select or drag files you want to download

3. **Configure Download**
   - Set the output filename
   - Choose compression level (if applicable)
   - Organize files in folders within the zip

4. **Download**
   - Click the download button to save the zip file to your computer

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory. You can preview it with:

```bash
npm run preview
```

## 🌐 AI Studio Integration

This project is integrated with AI Studio. View your app here:
[AI Studio - TokBatch Downloader](https://ai.studio/apps/drive/1yTdmc5TIqmuH_EC1StoLeukIkOtLzobC)

## 🔧 Configuration

### Vite Configuration

Edit `vite.config.ts` to customize build settings:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Tailwind CSS

Customize styling in `tailwind.config.js`:

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

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tokbatch-downloader.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Use TypeScript for type safety
   - Follow the existing code style

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

## 📝 Code Style Guidelines

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port. Check the console for the actual URL.

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
Make sure you're using Node.js v16 or higher:
```bash
node --version
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**BrK08** - [GitHub Profile](https://github.com/BrK08)

## 🙏 Acknowledgments

- React team for the amazing library
- Vite for the blazing fast build tool
- Tailwind CSS for the utility-first CSS framework
- All contributors and users

## 📞 Support

If you encounter any issues or have questions:

1. **Check Existing Issues** - Search [GitHub Issues](https://github.com/BrK08/tokbatch-downloader/issues)
2. **Create New Issue** - [Open an Issue](https://github.com/BrK08/tokbatch-downloader/issues/new)
3. **Discussions** - Ask questions in [GitHub Discussions](https://github.com/BrK08/tokbatch-downloader/discussions)

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

Made with ❤️ by [BrK08](https://github.com/BrK08)

</div>