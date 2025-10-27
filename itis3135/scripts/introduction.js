const nameInput = document.querySelector("[name='name']");
const mascotInput = document.querySelector("[name='mascot']");
const imageInput = document.getElementById("image");
const imageCaptionInput = document.querySelector("[name='imageCaption']");
const personalBackgroundInput = document.querySelector("[name='personalBackground']");
const professionalBackgroundInput = document.querySelector("[name='professionalBackground']");
const academicBackgroundInput = document.querySelector("[name='academicBackground']");
const backgroundWebDevInput = document.querySelector("[name='webDevBackground']");
const computerInput = document.querySelector("[name='primaryPlatform']");
const coursesRepeater = document.getElementById("coursesRepeater");
const addCourseBtn = document.getElementById("addCourse");
const quoteInput = document.querySelector("[name='quote']");
const quoteAuthorInput = document.querySelector("[name='quoteAuthor']");
const funnyThingInput = document.querySelector("[name='interestingFact']");
const anythingInput = document.querySelector("[name='anythingElse']");
const submitBtn = document.querySelector("button[type='submit']");
const resetBtn = document.getElementById("resetBtn");
const clearBtn = document.getElementById("clearBtn");
const form = document.getElementById("introForm");
let outputDiv = document.getElementById("result");

const resultResetWrap = document.getElementById("resultResetWrap");
const resultResetLink = document.getElementById("resultResetLink");

// Required fields (leave "Anything Else?" optional)
const fields = [
  nameInput, mascotInput, imageInput, imageCaptionInput,
  personalBackgroundInput, professionalBackgroundInput,
  academicBackgroundInput, backgroundWebDevInput,
  computerInput, quoteInput, quoteAuthorInput, funnyThingInput
];

function getCourses() {
  const rows = Array.from(coursesRepeater.querySelectorAll(".course"));
  return rows.map((row) => {
    const dept = row.querySelector("[name='courseDept']").value.trim();
    const num  = row.querySelector("[name='courseNumber']").value.trim();
    const name = row.querySelector("[name='courseName']").value.trim();
    const reason = row.querySelector("[name='courseReason']").value.trim();
    return { dept, num, name, reason };
  });
}

function coursesValid() {
  const list = getCourses();
  if (list.length === 0) return false;
  return list.every((c) => c.dept && c.num && c.name && c.reason);
}

const emptyFields = () => {
  const baseEmpty = fields.some((field) => {
    if (field === imageInput) return imageInput.files.length === 0;
    return (field.value || "").trim() === "";
  });
  return baseEmpty || !coursesValid();
};

const resetToForm = () => {
  outputDiv.innerHTML = "";
  outputDiv.hidden = true;
  resultResetWrap.hidden = true;
  form.style.display = "grid";
};

// Add/Remove course row wiring
function wireRemoveButtons() {
  const rows = coursesRepeater.querySelectorAll(".course");
  rows.forEach((row, idx) => {
    let btn = row.querySelector(".removeCourse");
    if (!btn) return;
    // Show remove button only when there is more than one row and not the first row
    btn.style.display = (rows.length > 1 && idx > 0) ? "inline-block" : "none";
    btn.onclick = () => {
      row.remove();
      wireRemoveButtons();
    };
  });
}

// Add course row
if (addCourseBtn) {
  addCourseBtn.addEventListener("click", () => {
    const first = coursesRepeater.querySelector(".course");
    if (!first) return;
    const clone = first.cloneNode(true);
    clone.querySelectorAll("input").forEach((i) => { i.value = ""; });
    coursesRepeater.appendChild(clone);
    wireRemoveButtons();
  });
}

// Initialize remove button state
wireRemoveButtons();

// Submit handler (no optional chaining)
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    outputDiv.innerHTML = "";

    if (emptyFields()) {
      alert("One or more required fields is empty.");
      return;
    }

    const file = imageInput.files[0];
    if (!file || !["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      alert("Invalid file upload, try again!");
      return;
    }

    const imgURL = URL.createObjectURL(file);

    // Build structured Courses HTML (bullets + sub-bullets)
    const courses = getCourses();
    const coursesHTML = `
      <li><strong>Courses I'm Taking:</strong>
        <ul>
          ${courses.map((c) => `
            <li>
              <strong>${c.dept} ${c.num} — ${c.name}:</strong>
              <ul>
                <li>Department: ${c.dept}</li>
                <li>Number: ${c.num}</li>
                <li>Name: ${c.name}</li>
                <li>Reason: ${c.reason}</li>
              </ul>
            </li>
          `).join("")}
        </ul>
      </li>
    `;

    outputDiv.hidden = false;
    outputDiv.innerHTML = `
      <h2>Introduction</h2>
      <h3>${nameInput.value} ★ ${mascotInput.value}</h3>
      <figure>
        <img src="${imgURL}" alt="${imageCaptionInput.value}" style="max-width: 320px; height: auto;">
        <figcaption><i>${imageCaptionInput.value}</i></figcaption>
      </figure>
      <ul>
        <li><strong>Personal Background:</strong> ${personalBackgroundInput.value}</li>
        <li><strong>Professional Background:</strong> ${professionalBackgroundInput.value}</li>
        <li><strong>Academic Background:</strong> ${academicBackgroundInput.value}</li>
        <li><strong>Background in Web Development:</strong> ${backgroundWebDevInput.value}</li>
        <li><strong>Primary Computer Platform:</strong> ${computerInput.value}</li>
        ${coursesHTML}
        <li><strong>Favorite Quote:</strong> ${quoteInput.value}</li>
        <li><strong>Quote Author:</strong> ${quoteAuthorInput.value}</li>
        <li><strong>Interesting Fact:</strong> ${funnyThingInput.value}</li>
        <li><strong>Anything Else:</strong> ${anythingInput.value || ""}</li>
      </ul>
    `;

    form.style.display = "none";
    resultResetWrap.hidden = false;
  });
}

// Reset button
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (!confirm("Do you want to reset the form?")) return;
    form.reset();
    resetToForm();
  });
}

// Clear button (keeps one empty course row)
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    // Clear the basic fields
    fields.forEach((input) => { input.value = ""; });
    imageInput.value = "";

    // Clear courses: keep only the first row and empty its inputs
    const rows = Array.from(coursesRepeater.querySelectorAll(".course"));
    rows.slice(1).forEach((r) => { r.remove(); });
    const first = coursesRepeater.querySelector(".course");
    if (first) first.querySelectorAll("input").forEach((i) => { i.value = ""; });
    wireRemoveButtons();
  });
}

// "Show form again" link in result area
if (resultResetLink) {
  resultResetLink.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    // Also reset courses to one empty row
    const rows = Array.from(coursesRepeater.querySelectorAll(".course"));
    rows.slice(1).forEach((r) => { r.remove(); });
    const first = coursesRepeater.querySelector(".course");
    if (first) first.querySelectorAll("input").forEach((i) => { i.value = ""; });
    wireRemoveButtons();
    resetToForm();
  });
}
