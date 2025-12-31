# Deployment Guide: Vercel & MongoDB Atlas

This guide will walk you through deploying your Product Portfolio to Vercel and connecting it to a live MongoDB Atlas database.

## 1. MongoDB Atlas Setup (Database)

1.  **Create Account/Cluster**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login. Create a new "Free Shared" cluster.
2.  **Create Database User**:
    *   Go to **Database Access** (sidebar).
    *   Click **Add New Database User**.
    *   Choose distinct username and password (e.g., `admin`). **Write down this password**.
    *   Role: "Read and write to any database".
3.  **Network Access (IP Whitelist)**:
    *   Go to **Network Access** (sidebar).
    *   Click **Add IP Address**.
    *   Select **Allow Access from Anywhere** (`0.0.0.0/0`).
    *   *Note: Vercel uses dynamic IPs, so this setting is required for serverless functions to connect.*
4.  **Get Connection String**:
    *   Go to **Database** (Overview).
    *   Click **Connect**.
    *   Select **Drivers** (Node.js).
    *   Copy the connection string. It looks like:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    *   Replace `<password>` with the user password you created in step 2.

## 2. Vercel Deployment

1.  **Push to GitHub**: Ensure your latest code (with the persistence fixes) is pushed to your GitHub repository.
2.  **Import to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** -> **Project**.
    *   Import your `product-portfolio` repository.
3.  **Configure Environment Variables**:
    *   In the Vercel import screen, look for **Environment Variables**.
    *   Add the following (copy values from your local `.env.local`, but update `MONGODB_URI`):

    | Name | Value |
    |---|---|
    | `MONGODB_URI` | **[Paste your Atlas Connection String here]** |
    | `JWT_SECRET` | [Generate a strong random string] |
    | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [Your Cloudinary Cloud Name] |
    | `CLOUDINARY_API_KEY` | [Your Cloudinary API Key] |
    | `CLOUDINARY_API_SECRET` | [Your Cloudinary API Secret] |
    | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | [Your Razorpay Key ID] |
    | `RAZORPAY_KEY_SECRET` | [Your Razorpay Key Secret] |

4.  **Deploy**: Click **Deploy**. Vercel will build your project.
    *   *Wait for the confetti!* 🎉

## 3. Seeding the Live Database (Optional)

If you want to populate your live Atlas database with initial data (Admin User, Categories):

1.  Open your local VS Code.
2.  Open `.env.local`.
3.  **Temporarily** replace `MONGODB_URI` with your **Atlas Connection String**.
4.  Run the seed script in your terminal:
    ```bash
    node seed.js
    ```
5.  **Revert** your local `.env.local` back to your local connection string afterwards to keep development separate.

## 4. Troubleshooting

*   **Connection Error**: Check that you allowed `0.0.0.0/0` in MongoDB Atlas Network Access.
*   **Login Fails**: Ensure `JWT_SECRET` is set in Vercel environment variables.
*   **Images Not Loading**: Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct.
