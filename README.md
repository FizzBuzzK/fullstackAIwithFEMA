# Real Estate Flood Risk Assessment App

A full-stack web application that helps users discover properties **with built-in flood detection and risk assessment features**.  
This project combines **real estate listings** with **geospatial + AI-powered flood analysis**, giving buyers, renters, and investors critical insights before making decisions.  

---

## Features

- **User Authentication**
  - Google OAuth login via NextAuth.js  
- **Property Management**
  - Create, edit, browse, bookmark, and delete property listings  
- **Media Upload**
  - Store and optimize images securely using **Cloudinary**  
- **Interactive Maps**
  - Google Maps integration to visualize property locations  
  - Elevation data with **Google Elevation API**  
- **Flood Risk Assessment**
  - FEMA NFHL API → Flood Zone Classification, SFHA flag, Base Flood Elevations  
  - NRI API → Coastal, Riverine, and Hurricane risk levels  
- **AI-Powered Image Analysis**
  - Uses **Google Gemini** to assess uploaded property or aerial images for flood vulnerability  
- **Responsive UI**
  - Built with **Tailwind CSS** + **Shadcn UI** for modern, mobile-friendly design  

---

## Tech Stack

**Frontend**  
- Next.js 15 (React 19, App Router)  
- Tailwind CSS + Shadcn UI  
- TypeScript  

**Backend**  
- Next.js API Routes  
- MongoDB + Mongoose  

**APIs & Integrations**  
- **Cloudinary** → Image upload & optimization  
- **FEMA NFHL & NRI APIs** → Flood hazard + risk data  
- **Google Maps & Elevation APIs** → Geospatial + elevation analysis  
- **Google Gemini** → AI image flood risk assessment  

**Deployment**  
- Dockerized for portability  
- Runs on **Vercel** or **Google Cloud Run**  

---


