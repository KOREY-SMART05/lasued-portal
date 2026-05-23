// Results page functions
window.addEventListener('DOMContentLoaded', async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  loadResults();
});

async function loadResults() {
  try {
    // Load GPA summary
    const gpaSummary = await apiCall('/results/gpa/summary');
    document.getElementById('overallGpa').textContent = gpaSummary.overall_gpa ? gpaSummary.overall_gpa.toFixed(2) : '--';
    document.getElementById('coursesCompleted').textContent = gpaSummary.courses_completed || 0;
    document.getElementById('highestGpa').textContent = gpaSummary.highest_gpa ? gpaSummary.highest_gpa.toFixed(2) : '--';
    document.getElementById('lowestGpa').textContent = gpaSummary.lowest_gpa ? gpaSummary.lowest_gpa.toFixed(2) : '--';

    // Load all results
    const results = await apiCall('/results');
    
    const tbody = document.getElementById('resultsBody');
    const noResults = document.getElementById('noResults');

    if (results.length === 0) {
      noResults.style.display = 'block';
      document.getElementById('resultsTable').style.display = 'none';
    } else {
      noResults.style.display = 'none';
      document.getElementById('resultsTable').style.display = 'table';
      tbody.innerHTML = results.map(result => `
        <tr>
          <td>Semester ${result.semester}</td>
          <td>${result.code}</td>
          <td>${result.title}</td>
          <td>${result.credits || '--'}</td>
          <td>${result.score || '--'}</td>
          <td><span class="badge badge-success">${result.grade || '--'}</span></td>
          <td>${result.gpa ? result.gpa.toFixed(2) : '--'}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load results:', error);
  }
}
