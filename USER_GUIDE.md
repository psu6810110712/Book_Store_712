# 📚 Book Store Application - User Guide

## 🎯 Overview
A full-stack Book Store Management System with React frontend and NestJS backend featuring authentication, CRUD operations, charts, and dark mode.

---

## ✨ Features Implemented

### 🔐 Authentication
- Login screen with username/password
- "Remember Me" checkbox for token persistence
- Auto-login on app refresh (if token exists)
- Secure logout with confirmation dialog

### 📖 Book Management
- **View**: Table with pagination, sorting, and filtering
- **Add**: Modal form with all book details (title, author, description, price, stock, category, ISBN, cover URL)
- **Edit**: Modal form pre-populated with existing data
- **Delete**: Confirmation dialog before deletion
- **Like**: Like counter for each book
- **Search**: Real-time search by title, author, or ISBN
- **Filter**: Multi-select category filter with colored tags

### 📊 Dashboard
- **Statistics Cards**:
  - Total Books
  - Total Inventory Value
  - Total Stock
  - Total Likes
- **Charts** (Chart.js):
  - **Bar Chart**: Stock levels by book
  - **Pie Chart**: Books distribution by category
  - **Line Chart**: Price distribution across books

### 🎨 UI/UX Features
- **Dark/Light Mode**: Toggle with persistent preference
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Horizontal Scrollbar**: Clean layout without side scroll
- **Wide Table**: 1600px max width for better data visibility
- **Multi-line Descriptions**: Text wrapping in table cells
- **Custom Scrollbars**: Styled scrollbars matching theme
- **Ant Design Components**: Professional UI components

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend server running on `http://localhost:3000`
- Backend should have these endpoints:
  - `POST /api/auth/login` - Login
  - `GET /api/book` - Get all books
  - `POST /api/book` - Create book
  - `PATCH /api/book/:id` - Update book
  - `DELETE /api/book/:id` - Delete book
  - `POST /api/book/:id/like` - Like a book
  - `GET /api/book-category` - Get categories

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:5173` (or another port if 5173 is in use).

---

## 📝 Usage Guide

### 1. **Login**
- Enter your credentials (username and password)
- Check "Remember Me" to stay logged in
- Click "Login"

**Default Test Credentials** (if applicable):
- Username: `admin` or `user1`
- Password: `password` or `1234`

### 2. **Book Store Page**
- **Filter by Category**: Use the dropdown to select one or more categories
- **Search**: 
  - Select search type (Title, Author, or ISBN)
  - Type in the search box
  - Results update in real-time
- **Add New Book**: Click "Create New Book" button
- **Like a Book**: Click the "Like" button on any row
- **Edit a Book**: Click the "Edit" button on any row
- **Delete a Book**: Click "Delete" and confirm

### 3. **Dashboard**
- Click "Dashboard" in the menu
- View statistics cards at the top
- Scroll down to see charts:
  - Stock levels
  - Category distribution
  - Price trends

### 4. **Dark Mode**
- Click the sun/moon toggle in the header
- Theme switches immediately
- Preference is saved automatically

### 5. **Logout**
- Click the logout button (red icon)
- Confirm logout in the dialog
- You'll be redirected to the login page

---

## 🏗️ Project Structure

```
frontend_book_store_712/
├── src/
│   ├── components/
│   │   ├── AddBook.jsx          # Add book form component
│   │   ├── BookList.jsx         # Book table with actions
│   │   ├── EditBook.jsx         # Edit book modal
│   │   └── Clock.jsx            # Clock component (if used)
│   ├── App.jsx                  # Main app layout & navigation
│   ├── App.css                  # App-specific styles
│   ├── index.css                # Global styles & scrollbar
│   ├── main.jsx                 # App entry point
│   ├── LoginScreen.jsx          # Login page
│   ├── BookScreen.jsx           # Book management page
│   └── DashboardScreen.jsx      # Dashboard with charts
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
├── FEATURE_CHECKLIST.md        # Feature implementation status
└── README.md                    # Project documentation
```

---

## 🔧 Configuration

### Backend URL
Edit in `src/BookScreen.jsx` and `src/App.jsx`:
```javascript
axios.defaults.baseURL = "http://localhost:3000";
```

### Theme Colors
Edit in `src/App.jsx`:
```javascript
colorPrimary: '#1890ff', // Change primary color
```

### Table Page Size
Edit in `src/components/BookList.jsx`:
```javascript
pagination={{ pageSize: 5 }} // Change items per page
```

---

## 🐛 Troubleshooting

### Problem: Cannot login
- **Check**: Backend server is running
- **Check**: Correct credentials
- **Check**: Network tab in browser DevTools for API errors

### Problem: Books not loading
- **Check**: Backend `/api/book` endpoint is accessible
- **Check**: Token is valid (logout and login again)
- **Check**: Console for error messages

### Problem: Charts not showing
- **Check**: Chart.js installed: `npm install chart.js react-chartjs-2`
- **Check**: Books data exists in database
- **Check**: Console for errors

### Problem: Dark mode not working
- **Check**: Browser localStorage is enabled
- **Check**: CSS variables in `index.css`

### Problem: Horizontal scrollbar appears
- **Already Fixed**: All overflow-x set to hidden
- **If issue persists**: Check custom components for fixed widths

---

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "antd": "^5.x",
  "axios": "^1.x",
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x"
}
```

---

## 🎓 Learning Outcomes

By completing this project, you've learned:
1. **React Fundamentals**: Components, Hooks (useState, useEffect), Props
2. **State Management**: Managing complex application state
3. **API Integration**: Axios for HTTP requests, async/await
4. **Form Handling**: Ant Design forms, validation
5. **Authentication**: Token-based auth, localStorage
6. **Data Visualization**: Chart.js integration
7. **UI Libraries**: Ant Design components
8. **Responsive Design**: Mobile-first approach
9. **Theming**: Dark/Light mode implementation
10. **Code Organization**: Component separation, reusability

---

## 🚀 Next Steps (Optional Enhancements)

1. **React Router**: Add proper routing with `react-router-dom`
2. **Category Management**: CRUD for categories
3. **Image Upload**: Replace URL input with file upload
4. **Advanced Filters**: Date range, price range, stock alerts
5. **Export Data**: CSV/Excel export functionality
6. **Print**: Print book list
7. **User Roles**: Admin vs Regular user permissions
8. **Gemini AI**: Book recommendations and details
9. **Notifications**: Toast messages for actions
10. **Testing**: Unit tests with Jest and React Testing Library

---

## 📄 License
Educational project for PSU CS course.

## 👨‍💻 Author
Student ID: 6810110712

## 📧 Support
For questions or issues, please contact your instructor or TA.

---

**Happy Coding! 🎉**
