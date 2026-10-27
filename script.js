
/* =====================================================
   GROUP 9: STUDENT ATTENDANCE AND PARTICIPATION CALCULATOR
   Browser-side JavaScript using sample data
   ===================================================== */

/* 1. Application settings and sample records */

const DEFAULT_REQUIREMENT = 75;

let attendanceRequirement = DEFAULT_REQUIREMENT;

const courses = [
  "Web Development",
  "Database Systems",
  "Computer Networks",
  "Software Engineering"
];

// Each student has a total number of sessions and
// a number of sessions attended.

let students = [
  {
    id: "STU001",
    name: "Sarah Atim",
    course: "Web Development",
    attended: 9,
    total: 10,
    lastStatus: "Present",
    participation: "Excellent"
  },
  {
    id: "STU002",
    name: "John Okello",
    course: "Database Systems",
    attended: 7,
    total: 10,
    lastStatus: "Late",
    participation: "Good"
  },
  {
    id: "STU003",
    name: "Grace Auma",
    course: "Computer Networks",
    attended: 6,
    total: 10,
    lastStatus: "Absent",
    participation: "Fair"
  },
  {
    id: "STU004",
    name: "Peter Draku",
    course: "Software Engineering",
    attended: 10,
    total: 10,
    lastStatus: "Present",
    participation: "Excellent"
  },
  {
    id: "STU005",
    name: "Mary Adong",
    course: "Web Development",
    attended: 8,
    total: 10,
    lastStatus: "Present",
    participation: "Good"
  },
  {
    id: "STU006",
    name: "David Ojara",
    course: "Database Systems",
    attended: 5,
    total: 10,
    lastStatus: "Absent",
    participation: "Poor"
  },
  {
    id: "STU007",
    name: "Esther Anyeko",
    course: "Computer Networks",
    attended: 8,
    total: 10,
    lastStatus: "Late",
    participation: "Good"
  },
  {
    id: "STU008",
    name: "Michael Laker",
    course: "Software Engineering",
    attended: 7,
    total: 10,
    lastStatus: "Present",
    participation: "Fair"
  },
  {
    id: "STU009",
    name: "Rebecca Abalo",
    course: "Web Development",
    attended: 6,
    total: 10,
    lastStatus: "Absent",
    participation: "Fair"
  },
  {
    id: "STU010",
    name: "Daniel Eton",
    course: "Database Systems",
    attended: 9,
    total: 10,
    lastStatus: "Present",
    participation: "Excellent"
  }
];

/* Store individual sample session records for demonstration. */

let sessionRecords = [];

/* 2. Helper functions */

function getAttendancePercentage(student) {
  if (student.total === 0) {
    return 0;
  }

  return (student.attended / student.total) * 100;
}

function meetsRequirement(student) {
  return getAttendancePercentage(student) >= attendanceRequirement;
}

function escapeHTML(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(value).replace(/[&<>"']/g, character => characters[character]);
}

function getStatusClass(status) {
  const statusClasses = {
    Present: "status-present",
    Late: "status-late",
    Absent: "status-absent"
  };

  return statusClasses[status] || "";
}

function getEligibilityClass(student) {
  return meetsRequirement(student)
    ? "status-eligible"
    : "status-ineligible";
}

function formatPercentage(student) {
  return `${getAttendancePercentage(student).toFixed(1)}%`;
}

/* 3. Calculate and display dashboard statistics */

function updateDashboard() {
  const totalStudents = students.length;

  const averageAttendance = totalStudents === 0
    ? 0
    : students.reduce(
        (sum, student) => sum + getAttendancePercentage(student),
        0
      ) / totalStudents;

  const eligibleCount = students.filter(meetsRequirement).length;

  const belowRequirementCount = totalStudents - eligibleCount;

  document.getElementById("total-students").textContent =
    totalStudents;

  document.getElementById("average-attendance").textContent =
    `${averageAttendance.toFixed(1)}%`;

  document.getElementById("eligible-students").textContent =
    eligibleCount;

  document.getElementById("below-requirement").textContent =
    belowRequirementCount;

  const summary = document.getElementById("dashboard-summary");

  if (totalStudents === 0) {
    summary.textContent = "No student records are available yet.";
    return;
  }

  summary.innerHTML = `
    <p>
      <strong>${eligibleCount}</strong> out of
      <strong>${totalStudents}</strong> students meet the
      minimum attendance requirement of
      <strong>${attendanceRequirement}%</strong>.
    </p>
    <p>
      The class average attendance is
      <strong>${averageAttendance.toFixed(1)}%</strong>.
    </p>
  `;
}

/* 4. Populate course and student dropdowns */

function populateDropdowns() {
  const courseFilter = document.getElementById("course-filter");
  const sessionCourse = document.getElementById("session-course");
  const studentSelect = document.getElementById("student-select");

  courseFilter.innerHTML = '<option value="">All courses</option>';
  sessionCourse.innerHTML = '<option value="">Select a course</option>';
  studentSelect.innerHTML = '<option value="">Select a student</option>';

  courses.forEach(course => {
    const filterOption = document.createElement("option");
    filterOption.value = course;
    filterOption.textContent = course;
    courseFilter.appendChild(filterOption);

    const sessionOption = document.createElement("option");
    sessionOption.value = course;
    sessionOption.textContent = course;
    sessionCourse.appendChild(sessionOption);
  });

  students.forEach(student => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.id} — ${student.name}`;
    studentSelect.appendChild(option);
  });
}

/* 5. Search and filter attendance records */

function filterAttendanceRecords() {
  const searchTerm = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();

  const selectedCourse =
    document.getElementById("course-filter").value;

  const selectedStatus =
    document.getElementById("status-filter").value;

  return students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm) ||
      student.id.toLowerCase().includes(searchTerm) ||
      student.course.toLowerCase().includes(searchTerm);

    const matchesCourse =
      selectedCourse === "" || student.course === selectedCourse;

    const matchesStatus =
      selectedStatus === "" || student.lastStatus === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });
}

/* 6. Display attendance records in the table */

function renderAttendanceRecords() {
  const tableBody =
    document.getElementById("attendance-table-body");

  const recordsCount =
    document.getElementById("records-count");

  const recordsMessage =
    document.getElementById("records-message");

  const filteredStudents = filterAttendanceRecords();

  recordsCount.textContent =
    `Showing ${filteredStudents.length} of ${students.length} student records`;

  recordsMessage.textContent = "";

  if (filteredStudents.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          No matching records found. Try changing your search or filters.
        </td>
      </tr>
    `;

    recordsMessage.textContent = "No matching student records found.";
    return;
  }

  tableBody.innerHTML = filteredStudents.map(student => {
    const percentage = getAttendancePercentage(student);

    return `
      <tr>
        <td>
          <strong>${escapeHTML(student.name)}</strong><br>
          <small>${escapeHTML(student.id)}</small>
        </td>
        <td>${escapeHTML(student.course)}</td>
        <td>${student.attended} / ${student.total}</td>
        <td>
          <strong>${percentage.toFixed(1)}%</strong>
        </td>
        <td>
          <span class="status-badge ${getStatusClass(student.lastStatus)}">
            ${escapeHTML(student.lastStatus)}
          </span>
        </td>
        <td>
          <span class="status-badge ${getEligibilityClass(student)}">
            ${meetsRequirement(student) ? "Meets requirement" : "Below requirement"}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

/* 7. Render the attendance calculator results */

function renderCalculator() {
  const result = document.getElementById("calculator-result");

  const requirementInput =
    document.getElementById("requirement-input");

  const rawRequirement = requirementInput.value.trim();
  const requirement = Number(rawRequirement);

  if (
    rawRequirement === "" ||
    !Number.isFinite(requirement) ||
    requirement < 1 ||
    requirement > 100
  ) {
    result.className = "message-error";
    result.textContent =
      "Enter a minimum attendance requirement between 1% and 100%.";
    return;
  }

  attendanceRequirement = requirement;

  const eligible = students.filter(meetsRequirement);
  const below = students.filter(student => !meetsRequirement(student));

  result.className = "";

  result.innerHTML = `
    <h3>Eligibility results</h3>
    <p>
      Minimum required attendance:
      <strong>${attendanceRequirement}%</strong>
    </p>
    <p>
      Students meeting the requirement:
      <strong>${eligible.length}</strong>
    </p>
    <p>
      Students below the requirement:
      <strong>${below.length}</strong>
    </p>
  `;

  updateDashboard();
  renderAttendanceRecords();
}

/* 8. Record attendance for a sample session */

function recordAttendance(event) {
  event.preventDefault();

  const form = document.getElementById("attendance-form");
  const message = document.getElementById("form-message");

  message.textContent = "";
  message.className = "";

  if (!form.checkValidity()) {
    form.reportValidity();
    message.className = "message-error";
    message.textContent = "Please complete all required fields correctly.";
    return;
  }

  const formData = new FormData(form);

  const studentId = formData.get("studentId");
  const course = formData.get("course");
  const sessionDate = formData.get("sessionDate");
  const status = formData.get("status");
  const participation = formData.get("participation");

  const student = students.find(item => item.id === studentId);

  if (!student) {
    message.className = "message-error";
    message.textContent = "The selected student could not be found.";
    return;
  }

  if (student.course !== course) {
    message.className = "message-error";
    message.textContent =
      "The selected course does not match the student's registered course.";
    return;
  }

  const duplicate = sessionRecords.some(record =>
    record.studentId === studentId &&
    record.course === course &&
    record.sessionDate === sessionDate
  );

  if (duplicate) {
    message.className = "message-error";
    message.textContent =
      "Attendance has already been recorded for this student, course, and date.";
    return;
  }

  // Save the individual session in browser memory.
  sessionRecords.push({
    studentId,
    course,
    sessionDate,
    status,
    participation
  });

  // Update the student's cumulative attendance.
  student.total += 1;

  if (status === "Present" || status === "Late") {
    student.attended += 1;
  }

  student.lastStatus = status;
  student.participation = participation;

  updateDashboard();
  renderAttendanceRecords();

  message.className = "message-success";
  message.textContent =
    `Attendance successfully recorded for ${student.name}.`;

  form.reset();
  document.getElementById("session-date").value =
    new Date().toLocaleDateString("en-CA");
}

/* 9. Initialise the application */

function initialiseApp() {
  populateDropdowns();
  updateDashboard();
  renderAttendanceRecords();

  // Default the session date to today.
  document.getElementById("session-date").value =
    new Date().toLocaleDateString("en-CA");

  // Search and filter events.
  document.getElementById("search-input")
    .addEventListener("input", renderAttendanceRecords);

  document.getElementById("course-filter")
    .addEventListener("change", renderAttendanceRecords);

  document.getElementById("status-filter")
    .addEventListener("change", renderAttendanceRecords);

  // Attendance form submission.
  document.getElementById("attendance-form")
    .addEventListener("submit", recordAttendance);

  // Recalculate when the button is clicked.
  document.getElementById("calculate-button")
    .addEventListener("click", renderCalculator);

  // Also recalculate when Enter is pressed in the requirement field.
  document.getElementById("requirement-input")
    .addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        renderCalculator();
      }
    });

  // Refresh eligibility whenever the threshold changes.
  document.getElementById("requirement-input")
    .addEventListener("change", renderCalculator);
}

document.addEventListener("DOMContentLoaded", initialiseApp);
