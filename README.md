<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b69e0667-052c-4494-853b-44343de61735

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the backend server (on port 3001):
   `npm start`
4. In a separate terminal, run the frontend dev server:
   `npm run dev`

## Deployment

Since this app securely proxies the Gemini API key through a backend, it cannot be deployed as a static site.
You must deploy this to a Node.js-compatible hosting service (like Heroku, Render, or an EC2 instance).
Set your `GEMINI_API_KEY` as an environment variable in your hosting provider's dashboard.
The `npm start` command will automatically serve the built frontend files in production.
