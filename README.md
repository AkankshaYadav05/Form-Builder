# 🧩 FormBuilder — Dynamic Form Creation & Response Management (MERN Stack)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)]()
[![Render Deployment](https://img.shields.io/badge/Deployed%20On-Render-blue)]()

FormBuilder is a full-stack web application built with the **MERN stack (MongoDB, Express, React, Node.js)** that allows users to easily **create, customize, and manage interactive forms**, similar to Google Forms. Users can build forms with multiple question types, share them, and view collected responses in real time.

---

## 🚀 Live Demo
👉 **[https://form-builder-o2wt.onrender.com](https://form-builder-o2wt.onrender.com)**  

---

## ✨ Features

- 🧱 **Dynamic Form Creation** – Add multiple question types like MCQ, Long Answer, Rating, Checkbox, Comprehension, etc.  
- 🖼️ **Image Upload Support** – Upload images for comprehension questions or options.  
- 💾 **Persistent Storage** – All data stored securely in **MongoDB Atlas**.  
- 👤 **User Authentication** – Session-based login using `express-session` and `connect-mongo`.  
- 📊 **Form & Response Management** – View all your created forms and responses in the Profile section.  
- 🎨 **Modern UI** – Built with **React + Tailwind CSS** for a sleek and responsive interface.  
- ☁️ **Fully Deployed on Render** – Both frontend and backend hosted seamlessly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | express-session, connect-mongo |
| Deployment | Render |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AkankshaYadav05/formbuilder.git
cd formbuilder
```

### Install root dependencies
npm install

### Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### Configure Environment Variables
   Create a .env file in the backend directory with the following:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

### Run the App Locally
```bash
npm run dev
```
This runs both frontend and backend concurrently (if configured) or individually:
```bash
# Backend only
npm start

# Frontend only
cd frontend && npm start
```


### 🧠 Future Enhancements
```bash
📧 Public form sharing via link or email

📊 Dashboard analytics for form responses

👥 Multi-user collaboration on forms

📤 Export responses as CSV or Excel
```

### 💙 Author
Akanksha Yadav
🔗 [Live App](https://form-builder-o2wt.onrender.com)

📧 Contributions and suggestions are always welcome!
