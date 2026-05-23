# LASUED E-Portal

A comprehensive school management system for Lagos State University of Education (LASUED) where students can check results, register for courses, make payments, and manage their academic profile.

## Features

### Student Features
- **User Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Overview of academic information and quick access to key features
- **Results Management**: View academic records, grades, and GPA summary
- **Course Registration**: Register for semester courses, view registered courses, and drop courses
- **Payment Tracking**: View school fees, payment history, and make payments
- **Profile Management**: Update personal information and academic details

### Admin Features
- **Student Management**: View all registered students
- **Results Management**: Upload and manage student grades
- **Course Management**: Create and manage courses
- **Payment Approval**: Monitor and approve student payments
- **Admin Dashboard**: Overview statistics and system metrics

## Tech Stack

### Backend
- **Server**: Node.js with Express.js framework
- **Database**: PostgreSQL (relational database)
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **API**: RESTful API architecture

### Frontend
- **HTML5** for semantic markup
- **CSS3** for responsive styling
- **Vanilla JavaScript** for client-side logic
- **Fetch API** for server communication

## Project Structure

```
lasued-portal/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── studentController.js # Student operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── student.js           # Student profile routes
│   │   ├── course.js            # Course registration routes
│   │   ├── result.js            # Results viewing routes
│   │   ├── payment.js           # Payment routes
│   │   └── admin.js             # Admin routes
│   ├── database/
│   │   └── schema.sql           # Database schema and migrations
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
├── frontend/
│   ├── css/
│   │   └── styles.css           # Responsive styling
│   ├── js/
│   │   ├── config.js            # API configuration and helpers
│   │   ├── auth.js              # Authentication logic
│   │   ├── dashboard.js         # Dashboard functionality
│   │   ├── courses.js           # Course management
│   │   ├── results.js           # Results viewing
│   │   ├── payments.js          # Payment functions
│   │   ├── profile.js           # Profile management
│   │   └── admin-dashboard.js   # Admin dashboard
│   ├── index.html               # Login page
│   ├── register.html            # Registration page
│   ├── dashboard.html           # Student dashboard
│   ├── courses.html             # Course registration
│   ├── results.html             # View results
│   ├── payments.html            # Payment management
│   ├── profile.html             # Student profile
│   └── admin-dashboard.html     # Admin dashboard
└── README.md                    # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (copy from example):
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/lasued_portal
   JWT_SECRET=your_secure_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Create PostgreSQL database**:
   ```bash
   createdb lasued_portal
   ```

6. **Run database migrations** (execute schema.sql):
   ```bash
   psql -U username -d lasued_portal -f database/schema.sql
   ```

7. **Start the backend server**:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The backend should be running at: `http://localhost:5000`

### Frontend Setup

1. **Start a local web server** (from the `frontend` directory):
   
   Using Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Or using Node.js (with http-server):
   ```bash
   npx http-server
   ```

2. **Access the portal**:
   Open your browser and navigate to: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Student login
- `POST /api/auth/refresh-token` - Refresh JWT token

### Student Profile
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/dashboard` - Get dashboard data

### Courses
- `GET /api/courses` - Get all available courses
- `GET /api/courses/registered` - Get student's registered courses
- `POST /api/courses/register` - Register for a course
- `DELETE /api/courses/:registration_id` - Drop a course

### Results
- `GET /api/results` - Get student results
- `GET /api/results/gpa/summary` - Get GPA summary

### Payments
- `GET /api/payments` - Get payment history
- `GET /api/payments/summary` - Get payment summary
- `POST /api/payments` - Create payment record

### Admin
- `GET /api/admin/students` - Get all students (admin only)
- `POST /api/admin/results/upload` - Upload results (admin only)
- `POST /api/admin/courses` - Create course (admin only)
- `PUT /api/admin/payments/:payment_id` - Approve payment (admin only)

## Database Schema

The database includes the following tables:
- **users** - Student and admin accounts
- **courses** - Available courses
- **course_registration** - Student course enrollments
- **results** - Student grades and academic records
- **payments** - Student payment transactions
- **admin_logs** - Admin action audit trail

## Default Credentials

After running the schema.sql, you can create test users:

**Student Account**:
- Email: `student@lasued.edu.ng`
- Password: `password123`

**Admin Account** (create via database or use registration):
- Email: `admin@lasued.edu.ng`
- Password: `admin123`
- Role: `admin`

## Testing the Application

### Manual Testing

1. **Register a new student**:
   - Go to register page and create an account
   - Fill in all required fields

2. **Login**:
   - Use credentials to access the dashboard

3. **Dashboard**:
   - View academic overview and quick stats

4. **Course Registration**:
   - View available courses
   - Register for courses
   - Drop courses as needed

5. **Check Results**:
   - View grades (admin must upload first)
   - Check GPA and performance

6. **Payments**:
   - Initiate payment transactions
   - View payment history

### Testing Admin Features

1. **Create admin account** (via database):
   ```sql
   INSERT INTO users (email, password, name, role) 
   VALUES ('admin@lasued.edu.ng', '$2a$10$hashedpassword', 'Admin User', 'admin');
   ```

2. **Upload results** (POST to `/api/admin/results/upload`)
3. **Create courses** (POST to `/api/admin/courses`)
4. **View all students** (GET `/api/admin/students`)

## Deployment

### Backend Deployment (Heroku)

1. Create a Procfile:
   ```
   web: node backend/server.js
   ```

2. Push to Heroku:
   ```bash
   heroku create lasued-portal
   git push heroku main
   ```

3. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL=your_production_db_url
   heroku config:set JWT_SECRET=your_secure_secret
   ```

### Frontend Deployment (GitHub Pages / Netlify)

1. **GitHub Pages**:
   ```bash
   git subtree push --prefix frontend origin gh-pages
   ```

2. **Netlify**:
   - Connect GitHub repository
   - Set build command: (none needed)
   - Set publish directory: `frontend`

## Security Considerations

1. **Password Security**: Passwords are hashed using bcryptjs before storage
2. **JWT Tokens**: Implement token expiration and refresh mechanism
3. **CORS**: Configure CORS properly in production
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: Validate all user inputs on both frontend and backend
6. **SQL Injection**: Use parameterized queries (pg library handles this)
7. **Authentication**: Verify tokens on protected routes

## Troubleshooting

### Backend Connection Issues

**Problem**: Cannot connect to database
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Check connection string in .env
echo $DATABASE_URL
```

**Problem**: Port 5000 already in use
```bash
# Change port in .env
PORT=5001
```

### Frontend API Errors

**Problem**: "API Error" in console
1. Check backend is running on port 5000
2. Verify API_BASE_URL in `frontend/js/config.js`
3. Check CORS is enabled in backend

**Problem**: "Invalid token" error
1. Clear browser localStorage: `localStorage.clear()`
2. Login again
3. Check JWT_SECRET matches in backend

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT License - feel free to use this project as a base for your needs.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@lasued.edu.ng

## Future Enhancements

- [ ] Email notifications for results and payments
- [ ] SMS alerts for payment deadlines
- [ ] PDF grade transcript download
- [ ] Payment gateway integration (Paystack, Flutterwave)
- [ ] Mobile app (React Native or Flutter)
- [ ] Advanced analytics dashboard
- [ ] Student feedback system
- [ ] Course evaluation forms

---

**Version**: 1.0.0
**Last Updated**: May 2026
