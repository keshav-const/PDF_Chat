🤖 DocuChat AI - Premium PDF Intelligence Platform
==================================================

Welcome to DocuChat AI, a full-stack application that transforms your static PDF documents into dynamic, intelligent conversations. Powered by Google's Gemini AI, this platform allows users to upload documents and ask questions in a natural, conversational way. Built with a modern tech stack including React, Express, and Supabase, it features a premium black/blue gradient UI with smooth, responsive animations.

✨ Live Demo
-----------

[**\[Insert Your Live Vercel URL Here\]**](https://www.google.com/search?q=https://your-deployment-link.vercel.app)

🚀 Features
-----------

*   **🔐 Secure Authentication**: Robust email/password signup and login functionality.
    
*   **📄 PDF Upload & Storage**: Seamlessly upload PDFs to secure Supabase storage.
    
*   **🤖 AI-Powered Q&A**: Chat with your documents using the advanced capabilities of the Google Gemini API.
    
*   **💬 Persistent Conversation History**: Never lose your place with chat histories stored in a PostgreSQL database.
    
*   **🎨 Premium UI/UX**: A stunning black and blue gradient design with glass morphism effects and intuitive navigation.
    
*   **✨ Smooth Animations**: Fluid user experience powered by Framer Motion animations and transitions.
    
*   **📱 Fully Responsive**: Flawless performance and design on both desktop and mobile devices.
    

🛠️ Tech Stack
--------------

### Frontend

*   **React** (with Vite)
    
*   **TypeScript**
    
*   **TailwindCSS**
    
*   **Framer Motion**
    
*   **Shadcn/ui**
    
*   **React Query**
    
*   **Wouter**
    

### Backend

*   **Express.js**
    
*   **TypeScript**
    
*   **Drizzle ORM**
    
*   **Multer**
    
*   **pdf-parse**
    

### Database & Services

*   **Supabase** (PostgreSQL)
    
*   **Supabase Storage**
    
*   **Google Gemini API**
    

🏁 Getting Started
------------------

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later)
    
*   pnpm (or your preferred package manager)
    
*   A Supabase account for the database and storage.
    
*   A Google Gemini API key.
    

### Local Setup

1.  Bashgit clone https://github.com/your-username/your-repository-name.gitcd your-repository-name
    
2.  **Set up your environment variables:**
    
    *   Create a .env file in the root of the project.
        
    *   Copy the contents of .env.example into your new .env file.
        
    *   Fill in the required values (your Supabase URL, keys, database connection string, etc.).
        
3.  Bashpnpm install
    
4.  Bashpnpm run db:push
    
5.  Bashpnpm run devYour application should now be running locally!
    

📦 Deployment
-------------

This project is configured for easy deployment on platforms like Vercel or Render.

### Vercel

1.  Connect your GitHub repository to a new Vercel project.
    
2.  Configure the **Build & Development Settings**:
    
    *   **Framework Preset**: Vite
        
    *   **Package Manager**: pnpm
        
    *   **Build Command**: pnpm run build
        
    *   **Output Directory**: dist/public
        
    *   **Install Command**: pnpm install
        
3.  Add all the necessary environment variables from your .env file to the Vercel project settings.
    
4.  Deploy!
