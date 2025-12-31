# TechFlow - Premium Product Portfolio & Store

**TechFlow** is a modern, full-stack e-commerce and product catalog platform built with Next.js 15. It features a premium public storefront for showcasing digital and physical products (Hardware, Software, Education) and a powerful, secure Admin Dashboard for managing the catalog.

![Project Preview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop)

## 🚀 Key Features

### 🛍️ Public Storefront
*   **Modern UI/UX**: Responsive, high-performance design using Tailwind CSS and Framer Motion.
*   **Dynamic Catalog**: Filter products by Category (Hardware, Software, Education).
*   **Rich Product Details**: Full Markdown support for technical descriptions, feature highlights, and image galleries.
*   **Shopping Cart**: LocalStorage-based cart with seamless checkout flow.
*   **Secure Checkout**: Integrated Razorpay payment gateway.

### ⚡ Admin Dashboard
*   **Secure Authentication**: JWT-based login with HttpOnly cookies.
*   **Product Management**: Create, Edit, and Delete products with a rich WYSIWYG editor.
*   **Cloudinary Integration**: Drag-and-drop image uploads directly to the cloud.
*   **Markdown Support**: "Github-flavored" Markdown preview for writing technical docs.
*   **Data Persistence**: Robus MongoDB database connection (Atlas-ready).

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
*   **Authentication**: JWT + HttpOnly Cookies
*   **Storage**: Cloudinary (Image Hosting)
*   **Payments**: Razorpay

## 🏁 Getting Started

### 1. Prerequisites
*   Node.js 18+ installed.
*   MongoDB Atlas account (or local MongoDB).
*   Cloudinary account.

### 2. Installation
```bash
git clone https://github.com/mohammed-ayan-zahoor/product-portfolio.git
cd product-portfolio
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/product-db

# Authentication
JWT_SECRET=your_super_secret_key_here

# Cloudinary (Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Running Locally
```bash
npm run dev
```
Visit `http://localhost:3000` for the store, or `http://localhost:3000/login` for the admin panel.

## 📦 Deployment

This project is optimized for deployment on **Vercel** with a **MongoDB Atlas** database.

👉 **[Read the Full Deployment Guide](./DEPLOYMENT.md)** for step-by-step instructions.

## 📄 License

This project is open-source and available under the MIT License.
