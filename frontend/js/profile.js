// Profile page functions
window.addEventListener('DOMContentLoaded', async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  loadProfile();

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await updateProfile();
    });
  }
});

async function loadProfile() {
  try {
    const profile = await apiCall('/student/profile');
    
    document.getElementById('name').value = profile.name || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('matricNo').value = profile.matric_no || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('department').value = profile.department || '';
    document.getElementById('level').value = profile.level || '';
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

async function updateProfile() {
  const errorEl = document.getElementById('profileError');
  const successEl = document.getElementById('profileSuccess');
  errorEl.classList.remove('show');
  successEl.classList.remove('show');

  const phone = document.getElementById('phone').value;
  const department = document.getElementById('department').value;
  const level = parseInt(document.getElementById('level').value) || null;

  try {
    await apiCall('/student/profile', 'PUT', { phone, department, level });
    successEl.textContent = 'Profile updated successfully!';
    successEl.classList.add('show');
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.add('show');
  }
}
