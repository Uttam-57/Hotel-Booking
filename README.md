# 🏨 WanderLust - A Full-Stack Hotel Booking Platform

WanderLust is a dynamic and full-featured web application designed to simulate a real-world hotel and vacation rental booking platform. This project showcases a complete CRUD (Create, Read, Update, Delete) application, complete with user authentication, image uploads, and reviews. It's a robust demonstration of modern web development principles and practices.

**Live Demo:** [Link to your deployed website here] *(If you don't have one, you can remove this line)*

---

## 📸 Project Screenshots

| Home Page | Listing Details | Create New Listing |
| :---: | :---: | :---: |
| ![Home Page Screenshot](path/to/your/screenshot1.png) | ![Listing Details Screenshot](path/to/your/screenshot2.png) | ![Create Listing Screenshot](path/to/your/screenshot3.png) |

*(**Note:** Replace `path/to/your/screenshot.png` with the actual paths to your project images.)*

---

## ✨ Key Features

-   **Full User Authentication:** Secure user registration, login, and logout functionality.
-   **CRUD Operations:** Users can Create, Read, Update, and Delete hotel/property listings.
-   **Image Uploads:** Seamless image uploading for property listings, handled via a cloud service.
-   **Interactive Reviews:** Authenticated users can post reviews and ratings for properties.
-   **RESTful API Design:** Follows RESTful principles for a clean and predictable API structure.
-   **Responsive Design:** A clean and modern UI that works across different devices.
-   **Protected Routes:** Middleware ensures that only authenticated and authorized users can perform certain actions (like creating or deleting listings).

---

## 🛠️ Tech Stack & Skills

This project was built using the MERN stack and other modern technologies:

-   **Frontend:** EJS (Embedded JavaScript templates), HTML5, CSS3, Bootstrap
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose ODM (Object Data Modeling)
-   **Authentication:** Passport.js for session-based authentication.
-   **Image Handling:** Multer for file handling & Cloudinary for cloud-based image storage.
-   **Architecture:** Follows the MVC (Model-View-Controller) architectural pattern.
-   **Deployment:** [Mention your deployment platform, e.g., Render, Vercel, AWS]

---

## 🚀 Getting Started & Local Setup

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have the following software installed on your machine:
-   [Node.js](https://nodejs.org/en/) (which includes npm)
-   [Git](https://git-scm.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas account for a cloud database.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR_GITHUB_USERNAME]/[YOUR_REPOSITORY_NAME].git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd [YOUR_REPOSITORY_NAME]
    ```

3.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Environment Variable Setup (.env)

This project uses environment variables to handle sensitive information like database connection strings and API keys.

1.  **Create a `.env` file** in the root of the project directory.

2.  **Copy the contents** from the example file into your new `.env` file. A `.env.example` file is included in the repository.
    ```
    # MongoDB Connection String
    MONGO_URL="your_mongodb_connection_string"

    # Cloudinary API Credentials (for image uploads)
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

    # Session Secret for Express Session
    SESSION_SECRET="a_strong_random_secret_string"
    ```

3.  **Fill in your personal credentials:**
    -   Replace `"your_mongodb_connection_string"` with your actual MongoDB connection URI.
    -   Add your Cloudinary credentials.
    -   Change `SESSION_SECRET` to any random string for securing user sessions.

### Running the Application

Once the setup is complete, you can start the development server:
```bash
npm start