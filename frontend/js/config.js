// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'auth_token';

// Helper function to get JWT token
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Helper function to save JWT token
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Helper function to clear JWT token
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Helper function to get current user from token
function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
}

// Helper function to check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API Error');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Logout function
function logout() {
  clearToken();
  window.location.href = 'index.html';
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Redirect to login if not authenticated (for protected pages)
  const protectedPages = ['dashboard.html', 'results.html', 'courses.html', 'payments.html', 'profile.html', 'admin-dashboard.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = 'index.html';
  }
});
