# E-Commerce Admin Panel

A full-stack e-commerce admin panel built with React, Node.js, TypeScript, and MongoDB, featuring complete CRUD operations for categories, subcategories, and products with authentication.

## 🚀 Features

### Authentication System
- **JWT-based authentication** with secure token storage
- **Password encryption** using bcrypt
- **Protected routes** with authentication guards
- **Login/Register** functionality with form validation

### Dashboard & Navigation
- **Responsive sidebar navigation** using React Bootstrap
- **Modern UI** with TailwindCSS styling
- **User session management** with Context API
- **Protected dashboard** with user information display

### Category Management
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Image upload** functionality with file validation
- **React Table** for data display with sorting
- **Modal forms** for adding/editing categories
- **Delete confirmation** dialogs

### Sub Category Management
- **Category-linked subcategories** with dropdown selection
- **Full CRUD operations** with validation
- **Image upload** support
- **React Table** integration
- **Category filtering** in forms

### Product Management
- **Comprehensive product management** with all fields
- **Multiple image uploads** (up to 5 images)
- **Category and subcategory** selection with filtering
- **Price, stock, and SKU** management
- **Advanced table display** with image previews
- **Form validation** and error handling

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Bootstrap** for UI components
- **TailwindCSS** for responsive styling
- **React Router** for navigation
- **React Table (TanStack)** for data tables
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 📁 Project Structure

```
df-hackathon/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main App component
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
├── shared/                 # Shared utilities
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd df-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-admin
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the application**
   
   **Option 1: Start both servers simultaneously**
   ```bash
   npm run dev
   ```
   
   **Option 2: Start individually**
   ```bash
   # Backend (in server directory)
   cd server && npm run dev
   
   # Frontend (in client directory)
   cd client && npm start
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Sub Categories
- `GET /api/subcategories` - Get all subcategories
- `GET /api/subcategories/:id` - Get subcategory by ID
- `POST /api/subcategories` - Create new subcategory
- `PUT /api/subcategories/:id` - Update subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Login/Register**: Users can create an account or login with existing credentials
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Protected Routes**: All API endpoints (except auth) require valid JWT
4. **Automatic Token Injection**: Axios automatically includes tokens in requests

## 📝 Usage Guide

### 1. User Registration/Login
- Visit http://localhost:3000
- Register a new account or login with existing credentials
- Successful login redirects to the dashboard

### 2. Category Management
- Navigate to "Category" from the sidebar
- Add new categories with name, description, and optional image
- Edit or delete existing categories using action buttons

### 3. Sub Category Management
- Navigate to "Sub Category" from the sidebar
- Select a parent category when creating subcategories
- Manage subcategories with full CRUD operations

### 4. Product Management
- Navigate to "Product" from the sidebar
- Create products with multiple images, pricing, and inventory
- Categories and subcategories are dynamically filtered
- View product images in the table display

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Tables**: React Table with sorting and filtering
- **Modal Forms**: Clean modal interfaces for data entry
- **Image Uploads**: Drag-and-drop or click to upload images
- **Loading States**: Spinner indicators during API calls
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation messages for actions

## 🔧 Development

### Available Scripts

**Root Directory:**
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

**Server Directory:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

**Client Directory:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📝 Notes

- **File Uploads**: Images are stored in the `server/uploads` directory
- **Database**: MongoDB is used for data persistence
- **Security**: Passwords are hashed using bcrypt
- **CORS**: Backend is configured to accept requests from frontend
- **Type Safety**: Full TypeScript implementation throughout

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
