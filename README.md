# Expense-Tracker

A full-stack web application that allows users to set a budget, track expenses and income, categorize transactions, and view detailed analytics through interactive charts. Users can also export their financial reports to PDF and CSV formats. The app features a clean, responsive UI and now supports backend integration for persistent data storage and user authentication.

![Screenshot](https://github.com/user-attachments/assets/bdb80009-582b-40fc-9127-2a5ef335f348)

---

## 🚀 Features

- Set and manage your **budget**.
- Add, edit, and delete **income** and **expense** entries.
- Categorize transactions (e.g., Food, Travel, Rent, Salary, etc.).
- Interactive charts: **Doughnut**, **Bar**, and **Line** to visualize data.
- **Real-time updates** to charts and dashboard on data changes.
- **Authentication system** for secure user login and registration.
- Export your expense reports to **PDF** and **CSV**.
- **Mobile-responsive** design with modern UI.
- **Persistent backend storage** using MongoDB.
- Organized transaction history with filtering by date and category.

---

## 🛠 Technologies Used

### Frontend
- **HTML5** & **CSS3**
- **TailwindCSS** — utility-first CSS framework for styling
- **JavaScript (ES6+)** — DOM manipulation and client-side logic
- **Chart.js** — for rendering charts
- **Html2Canvas** & **jsPDF** — for PDF export

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — lightweight backend framework
- **MongoDB** — NoSQL database for user and transaction data
- **Mongoose** — ODM for MongoDB

---

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- Basic understanding of HTML, CSS, JS, Node.js, and MongoDB

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arghya-Dutta1/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root with the following:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the App**

   Open your browser and go to: `http://localhost:5000`

---

## 📂 Project Structure

```
expense-tracker/
├── index.html        # Main HTML file
├── style.css         # CSS styles
├── script.js         # JavaScript for frontend logic
├── login.html        
├── register.html     
|── models/           # Mongoose models
│── server.js         # Main Express server
├── .env              # Environment variables
├── package.json
└── README.md
```

---

## 🙌 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.
Feel free to use, modify, and distribute this project as per the terms of the license.

---

## 🙏 Acknowledgements

- **TailwindCSS** — for rapid and responsive UI development
- **Chart.js** — for intuitive chart rendering
- **Html2Canvas** and **jsPDF** — for document generation
- **MongoDB + Mongoose** — for data storage and management
- Ben Franklin — for the inspirational quote used in the app
