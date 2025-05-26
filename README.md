# Modern Productivity Hub - Browser Homepage Extension

## Features

- **Customizable Clock**: Positioned on the left side with blinking colons
- **Weather Widget**: Located on the right side with real-time weather data
- **Quick Search**: Search bar positioned below the clock and weather
- **Personalized Greeting**: Gradient text styling showing time-based greetings
- **Website Analytics**: Track and categorize your website usage
  - Time spent tracking
  - Website categorization (productive, neutral, distracting)
  - Daily time limits for distracting websites
  - Visual analytics with progress bars and charts
- **Clean, Modern UI**: Glass-card styling with proper spacing
- **Responsive Design**: Works on various screen sizes

## Browser Extension Setup

This extension redirects new tabs to the GitHub Pages version of the productivity hub:

1. Build the extension:
   ```sh
   npm run build
   ```

2. For Microsoft Edge:
   - Navigate to `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

3. For Google Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

4. The extension is now installed! Open a new tab to see your productivity hub

## How to use

- **Theme Toggle**: Switch between light and dark themes in the settings panel
- **Search**: Use the search bar positioned below the clock and weather to quickly search the web
- **Weather Widget**: View current weather conditions on the right side of the screen
- **Website Analytics**: Access through the "Advanced Features" toggle in settings
  - **Overview Tab**: See a summary of your browsing habits with time spent statistics
  - **Details Tab**: View detailed breakdown of websites visited and time spent
  - **Limits Tab**: Set daily time limits for distracting websites
  - **Add/Edit/Remove**: Manage which websites are tracked and how they're categorized
- **Settings Panel**: Customize your experience and toggle features on/off

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

## Deployment

This project is deployed in two ways:

1. **GitHub Pages**: The main application is deployed to GitHub Pages at:
   ```
   https://suchithbalne.github.io/edge-productivity-hub/
   ```
   To update the deployment, run:
   ```sh
   npm run deploy
   ```

2. **Browser Extension**: The extension redirects new tabs to the GitHub Pages deployment.
   To update the extension after making changes:
   ```sh
   npm run build
   ```
   Then reinstall the extension from the `dist` folder in your browser.

## Using as Default Homepage

You can set this productivity hub as your default homepage in several ways:

1. **As a New Tab Page**: Install the browser extension as described above

2. **As a Homepage**: Set your browser's homepage to:
   ```
   https://suchithbalne.github.io/edge-productivity-hub/
   ```

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
