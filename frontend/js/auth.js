// Authentication functions
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.classList.remove('show');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      
      if (data.user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.classList.add('show');
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.classList.remove('show');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const matric_no = document.getElementById('matric_no').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      errorMsg.textContent = 'Passwords do not match';
      errorMsg.classList.add('show');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, matric_no })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      alert('Registration successful! Please login.');
      window.location.href = 'index.html';
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.classList.add('show');
    }
  });
}
