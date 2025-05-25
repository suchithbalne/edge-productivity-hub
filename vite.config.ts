import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
// Function to copy manifest.json and icons to the build directory
function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      // Create icons directory if it doesn't exist
      if (!fs.existsSync('dist/icons')) {
        fs.mkdirSync('dist/icons', { recursive: true });
      }
      
      // Copy manifest.json
      fs.copyFileSync('public/manifest.json', 'dist/manifest.json');
      
      // Copy icons
      const iconFiles = fs.readdirSync('public/icons');
      iconFiles.forEach(file => {
        if (file.endsWith('.png')) {
          fs.copyFileSync(`public/icons/${file}`, `dist/icons/${file}`);
        }
      });
      
      console.log('Extension files copied successfully!');
    }
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    copyExtensionFiles(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
