# 🧩 FormBuilder — Dynamic Form Creation & Response Management (MERN Stack)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)]()
[![Render Deployment](https://img.shields.io/badge/Deployed%20On-Render-blue)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

FormBuilder is a full-stack web application built with the **MERN stack (MongoDB, Express, React, Node.js)** that allows users to easily **create, customize, and manage interactive forms**, similar to Google Forms. Users can build forms with multiple question types, upload images, and view collected responses in real time.

---

## 🚀 Live Demo
👉 **[https://form-builder-production-cee9.up.railway.app/](https://form-builder-production-cee9.up.railway.app/)**  

---

## ✨ Features

- 🧱 **Dynamic Form Creation** – Add question types like MCQ, Long Answer, Rating, Checkbox, and Comprehension  
- 🖼️ **Image Uploads** – Supports uploading images for comprehension passages and MCQ options  
- 💾 **Persistent Storage** – Data stored securely in **MongoDB Atlas**  
- 👤 **User Authentication** – Session-based authentication with `express-session` + `connect-mongo`  
- 📊 **Form Management** – Create, edit, and view responses for each form  
- 🎨 **Modern UI** – Built with **React** and **Tailwind CSS** for a clean, responsive interface  
- ☁️ **Fully Deployed on Render** – Backend and frontend integrated on a single live domain  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | express-session, connect-mongo |
| Deployment | Railway |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/formbuilder.git
cd formbuilder
```

2️⃣ Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
cd ..
```

3️⃣ Add Environment Variables
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

4️⃣ Run the Application
```bash
# Start backend
cd backend
npm start

# In another terminal, start frontend
cd frontend
npm run dev
```

Then open your browser at http://localhost:5173
 (or the port shown in the terminal).

 ---
 

## ⭐ How to Contribute

Fork this repo

Create a new branch (feature/new-question-type)

Commit your changes

Push and open a Pull Request

---

## Author

Akanksha
MERN Stack Developer

📧 Email: rd.akanksha05@gmail.com

📧 Contributions and suggestions are always welcome!
