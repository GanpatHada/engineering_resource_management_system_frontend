# 🎯 Engineering Resource Management System – Frontend

This is the frontend for the Engineering Resource Management System. It allows managers to create projects, assign engineers, and view utilization dashboards, while engineers can track their assignments and availability.

---

## 🌐 🚀 Live Demo & Documentation

<div style="border: 1px solid #ccc; padding: 16px; border-radius: 8px; background-color: #000000ff;">

🔗 <strong>Frontend Live URL:</strong>  
<a href="https://ermsgeeky.vercel.app" target="_blank">https://ermsgeeky.vercel.app</a>

🟢 <strong>Backend API (Hosted on Render):</strong><br>
<a href="https://engineering-resource-management-system-crbg.onrender.com" target="_blank">https://engineering-resource-management-system-crbg.onrender.com</a>

📬 <strong>Postman API Collection:</strong>  
<a href="https://documenter.getpostman.com/view/19675500/2sB3BAMCn8" target="_blank">https://documenter.getpostman.com/view/19675500/2sB3BAMCn8</a>

</div>


--- 
### 🔐Test Credentials
👨‍💼 Manager Login:  
- ✉ <code>alice.manager@gmail.com</code>  
- 🔑 <code>manager123</code>  

👨‍💻 Engineer Login:  
- ✉ <code>dev@example.com</code>  
- 🔑 <code>secret123</code>  

👩‍💻 Engineer Login:  
- ✉ <code>john.doe1@gmail.com</code>  
- 🔑 <code>password123</code>  

👩‍💻 Engineer Login:  
- ✉ <code>jane.smith2@gmail.com</code>  
- 🔑 <code>password123</code> 



---

## ⚙️ Tech Stack

- **React** with **TypeScript**
- **Tailwind CSS** with **ShadCN UI**
- **React Hook Form** for form handling
- **React Router DOM** for routing
- **Context API / Zustand** for state management
- **Axios / Fetch** for API calls

---

## 📁 Folder Structure

````bash
project-root/
├── public/                 # Static files (index.html, favicon, etc.)
├── src/
│   ├── assets/             # Images, logos, icons
│   ├── components/         # Reusable UI components
│   ├── context/            # Global state (Context API or Zustand)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Route-based pages
│   ├── routes/             # React Router config
│   ├── services/           # API call logic
│   ├── styles/             # Tailwind config or custom styles
│   └── utils/              # Helper functions
├── .env                    # Environment variables
├── package.json            # Project metadata
└── vite.config.ts          # Vite config
````



## 🧪 Run Locally

Follow the steps below to set up and run the backend locally:

### 1. Clone the repository

```bash
git clone https://github.com/GanpatHada/engineering_resource_management_system_frontend.git
cd engineering_resource_management_system_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root folder and add the following:

```env
VITE_API_URL=http://localhost:8000/api
```


### 4. Start the server

```bash
npm run dev
```

> By default, the server will run on `http://localhost:5173`
