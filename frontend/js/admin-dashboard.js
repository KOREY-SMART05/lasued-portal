// Admin Dashboard functions
window.addEventListener('DOMContentLoaded', async () => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  loadAdminDashboard();
});

async function loadAdminDashboard() {
  try {
    // Load students count
    const students = await apiCall('/admin/students');
    document.getElementById('totalStudents').textContent = students.length;

    // Load pending payments (simplified - in production would be a dedicated endpoint)
    document.getElementById('pendingPayments').textContent = '0';
    document.getElementById('totalCourses').textContent = '0';
  } catch (error) {
    console.error('Failed to load admin dashboard:', error);
  }
}
