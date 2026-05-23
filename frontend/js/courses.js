// Courses page functions
let allCourses = [];

window.addEventListener('DOMContentLoaded', async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  loadCourses();
});

async function loadCourses() {
  try {
    // Load registered courses
    const registeredCourses = await apiCall('/courses/registered');
    populateRegisteredCourses(registeredCourses);

    // Load all available courses
    allCourses = await apiCall('/courses');
    populateAvailableCourses(allCourses);
  } catch (error) {
    console.error('Failed to load courses:', error);
  }
}

function populateRegisteredCourses(courses) {
  const tbody = document.getElementById('registeredCoursesBody');
  const noReg = document.getElementById('noRegistered');

  if (courses.length === 0) {
    noReg.style.display = 'block';
    document.getElementById('registeredCoursesTable').style.display = 'none';
  } else {
    noReg.style.display = 'none';
    document.getElementById('registeredCoursesTable').style.display = 'table';
    tbody.innerHTML = courses.map(course => `
      <tr>
        <td>${course.code}</td>
        <td>${course.title}</td>
        <td>${course.credits}</td>
        <td>Semester ${course.semester}</td>
        <td><span class="badge badge-info">${course.status}</span></td>
        <td><button class="btn-secondary" onclick="dropCourse(${course.id})">Drop</button></td>
      </tr>
    `).join('');
  }
}

function populateAvailableCourses(courses) {
  const tbody = document.getElementById('availableCoursesBody');
  const noAvail = document.getElementById('noAvailable');

  if (courses.length === 0) {
    noAvail.style.display = 'block';
    document.getElementById('availableCoursesTable').style.display = 'none';
  } else {
    noAvail.style.display = 'none';
    document.getElementById('availableCoursesTable').style.display = 'table';
    tbody.innerHTML = courses.map(course => `
      <tr>
        <td>${course.code}</td>
        <td>${course.title}</td>
        <td>${course.credits}</td>
        <td>Semester ${course.semester}</td>
        <td>${course.department || '--'}</td>
        <td><button class="btn-primary" onclick="registerCourse(${course.id}, ${course.semester})">Register</button></td>
      </tr>
    `).join('');
  }
}

function filterCourses() {
  const semester = document.getElementById('semesterFilter').value;
  if (semester === '') {
    populateAvailableCourses(allCourses);
  } else {
    const filtered = allCourses.filter(c => c.semester === parseInt(semester));
    populateAvailableCourses(filtered);
  }
}

async function registerCourse(courseId, semester) {
  try {
    await apiCall('/courses/register', 'POST', { course_id: courseId, semester });
    alert('Course registered successfully!');
    loadCourses();
  } catch (error) {
    alert('Failed to register course: ' + error.message);
  }
}

async function dropCourse(registrationId) {
  if (confirm('Are you sure you want to drop this course?')) {
    try {
      await apiCall(`/courses/${registrationId}`, 'DELETE');
      alert('Course dropped successfully!');
      loadCourses();
    } catch (error) {
      alert('Failed to drop course: ' + error.message);
    }
  }
}
