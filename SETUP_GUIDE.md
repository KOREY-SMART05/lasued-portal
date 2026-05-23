# LASUED E-Portal Setup Guide

## Quick Start (5 minutes)

### Prerequisites Check
```bash
node --version  # Should be v14+
npm --version   # Should be v6+
psql --version  # Should be v12+
```

### Step 1: Clone and Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

### Step 2: Setup Database
```bash
# Create database
creatdb lasued_portal

# Import schema
psql -U your_username -d lasued_portal -f database/schema.sql
```

### Step 3: Start Backend
```bash
npm start
# Should show: LASUED Portal Backend running on port 5000
```

### Step 4: Start Frontend
In a new terminal:
```bash
cd frontend
python -m http.server 8000
# or: npx http-server
```

### Step 5: Access Portal
Open browser to: `http://localhost:8000`

## Default Test Accounts

### Create Test Student
```sql
INSERT INTO users (email, password, name, matric_no, role)
VALUES ('student@test.com', '$2a$10$jKkLmN.oP1q2R3sTuVwXyZaBcDeFghIjKlMnOpQrStUvWxYzAbCdE', 'Test Student', 'MAT001', 'student');
```

### Create Test Admin
```sql
INSERT INTO users (email, password, name, role)
VALUES ('admin@test.com', '$2a$10$jKkLmN.oP1q2R3sTuVwXyZaBcDeFghIjKlMnOpQrStUvWxYzAbCdE', 'Admin User', 'admin');
```

Password for both: `password123`

## API Testing with cURL

### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "name": "John Doe",
    "matric_no": "MAT12345"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Get Student Profile (with token)
```bash
curl -X GET http://localhost:5000/api/student/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Solutions

### Issue: "Port 5000 already in use"
**Solution**: 
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or use different port in .env
PORT=5001
```

### Issue: "ECONNREFUSED" when accessing API
**Solution**:
- Ensure backend is running: `npm start`
- Check database connection string in .env
- Verify PostgreSQL is running: `sudo service postgresql status`

### Issue: "Cannot find module 'express'"
**Solution**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection failed
**Solution**:
```bash
# Test PostgreSQL connection
psql -U postgres -d lasued_portal

# Recreate database
dropdb lasued_portal
createdb lasued_portal
psql -U postgres -d lasued_portal -f backend/database/schema.sql
```

## Environment Variables Reference

```env
# Server Configuration
PORT=5000                    # Backend port
NODE_ENV=development         # Environment mode

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/lasued_portal

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production

# Admin Credentials (optional)
ADMIN_EMAIL=admin@lasued.edu.ng
ADMIN_PASSWORD=admin123
```

## File Modifications for Production

### 1. Update frontend/js/config.js
```javascript
// Development
const API_BASE_URL = 'http://localhost:5000/api';

// Production (change to your deployed URL)
const API_BASE_URL = 'https://your-api.herokuapp.com/api';
```

### 2. Enable CORS for production
In backend/server.js:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## Next Steps

1. **Customize**: Modify colors, add logo in CSS/HTML
2. **Add Data**: Create courses and upload results via admin
3. **Test**: Try all student features
4. **Deploy**: Follow deployment section in README.md
5. **Secure**: Change JWT_SECRET and admin passwords

## Database Backup

```bash
# Backup database
pg_dump -U postgres lasued_portal > backup.sql

# Restore database
psql -U postgres lasued_portal < backup.sql
```

## Performance Optimization

1. Add indexes (already in schema.sql)
2. Use connection pooling in production
3. Implement caching for frequently accessed data
4. Minify CSS and JavaScript for frontend
5. Use CDN for static assets

---

For more details, see the main README.md
