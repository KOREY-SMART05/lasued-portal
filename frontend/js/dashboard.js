// Dashboard functions
let currentUser = null;

window.addEventListener('DOMContentLoaded', async () => {
  currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  loadDashboard();
});

async function loadDashboard() {
  try {
    // Set student name
    document.getElementById('studentName').textContent = currentUser.email;

    // Fetch dashboard data
    const dashboardData = await apiCall('/student/dashboard');
    
    if (dashboardData.student) {
      const student = dashboardData.student;
      document.getElementById('studentName').textContent = student.name || currentUser.email;
      document.getElementById('matricNo').textContent = `Matric: ${student.matric_no}`;
      document.getElementById('dashMatricNo').textContent = student.matric_no || '--';
      document.getElementById('department').textContent = student.department || '--';
      document.getElementById('level').textContent = student.level || '--';
    }

    // Update courses info
    if (dashboardData.courses) {
      document.getElementById('courseCount').textContent = dashboardData.courses.length;
    }

    // Fetch GPA summary
    try {
      const gpaSummary = await apiCall('/results/gpa/summary');
      document.getElementById('gpa').textContent = gpaSummary.overall_gpa ? gpaSummary.overall_gpa.toFixed(2) : '--';
    } catch (e) {
      document.getElementById('gpa').textContent = '--';
    }

    // Update payment info
    if (dashboardData.payments) {
      const payments = dashboardData.payments;
      document.getElementById('paidAmount').textContent = (payments.paid_amount || 0).toFixed(2);
      document.getElementById('pendingAmount').textContent = (payments.pending_amount || 0).toFixed(2);
    }

    // Populate recent results
    if (dashboardData.recentResults && dashboardData.recentResults.length > 0) {
      const tbody = document.getElementById('recentResultsBody');
      tbody.innerHTML = dashboardData.recentResults.map(result => `
        <tr>
          <td>${result.code}</td>
          <td>${result.title}</td>
          <td>${result.score || '--'}</td>
          <td><span class="badge badge-success">${result.grade || '--'}</span></td>
          <td>Sem ${result.semester}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}
