-- Users table (students and admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student', -- 'student', 'admin', 'staff'
  matric_no VARCHAR(50) UNIQUE,
  phone VARCHAR(20),
  department VARCHAR(100),
  level INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  credits INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  department VARCHAR(100),
  lecturer_id INTEGER REFERENCES users(id),
  capacity INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Registration table
CREATE TABLE IF NOT EXISTS course_registration (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  semester INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'dropped', 'completed'
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id, semester)
);

-- Results/Grades table
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  semester INTEGER NOT NULL,
  score DECIMAL(5,2),
  grade VARCHAR(2), -- A, B, C, D, E, F
  gpa DECIMAL(3,2),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id, semester)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_method VARCHAR(50), -- 'bank_transfer', 'card', 'cash'
  reference_no VARCHAR(100) UNIQUE,
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_course_registration_student ON course_registration(student_id);
CREATE INDEX IF NOT EXISTS idx_course_registration_course ON course_registration(course_id);
CREATE INDEX IF NOT EXISTS idx_results_student ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
