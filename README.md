# Modern Productivity Hub - Browser Homepage Extension

## Features

- **Customizable Clock**: Toggle between digital and analog clock styles
- **Theme Switching**: Switch between light and dark themes
- **Quick Search**: Search using multiple search engines with a minimalist interface
- **Customizable Tools**: Add and manage your favorite AI tools, social links, and workspace apps
- **Bookmarks**: Easily access and organize your bookmarks
- **Tasks**: Keep track of your to-do items
- **Weather Widget**: View current weather conditions
- **Responsive Design**: Works on various screen sizes

## Chrome Extension Setup

To use this as a Chrome extension:

1. Build the project:
   ```sh
   npm run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top right corner

4. Click "Load unpacked" and select the `dist` folder from this project

5. The extension is now installed! Open a new tab to see your customized homepage

## How to use

- **Theme Toggle**: Click the sun/moon icon in the clock widget to switch between light and dark themes
- **Clock Style**: Toggle between digital and analog clock styles using the button in the clock widget
- **Search**: Use the search bar to quickly search with your preferred engine
- **Customization**: Click the settings icon in each widget to add or remove items
- **Expandable Menus**: Click on AI Tools, Social, Google, or Microsoft buttons to expand their respective menus

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/aedbf6cc-087d-4bb0-b5c4-d6cb3f5e6849) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/aedbf6cc-087d-4bb0-b5c4-d6cb3f5e6849) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
