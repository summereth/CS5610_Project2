// Hardcoded list of muscle groups
const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

// DOM Elements
const addExerciseBtn = document.getElementById("add-exercise-btn");
const exerciseSelectionArea = document.getElementById(
  "exercise-selection-area",
);
const muscleGroupSelect = document.getElementById("muscle-group-select");
const exerciseCardsContainer = document.getElementById(
  "exercise-cards-container",
);
const exerciseDetailsForm = document.getElementById("exercise-details-form");
const selectedExercisesContainer = document.getElementById(
  "selected-exercises-container",
);
const addToPlanBtn = document.getElementById("add-to-plan-btn");
const cancelAddBtn = document.getElementById("cancel-add-btn");
const createPlanForm = document.getElementById("create-plan-form");

let selectedExercise = null;

// Initialize muscle group dropdown
function initializeMuscleGroups() {
  muscleGroups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    muscleGroupSelect.appendChild(option);
  });
}

// Create exercise card HTML
function createExerciseCard(exercise) {
  return `
      <div class="card mb-3 exercise-card" data-exercise="${exercise.name}">
        <div class="card-body">
          <h5 class="card-title">${exercise.name}</h5>
          <p class="card-text">${exercise.description}</p>
          <button type="button" class="btn btn-primary select-exercise-btn">Select</button>
        </div>
      </div>
    `;
}

// request server for exercises data
async function fetchExercises(muscleGroup) {
  try {
    const url = new URL("http://localhost:3000/api/exercises");

    if (!muscleGroup) {
      console.error("Muscle group not provided");
    }
    url.searchParams.append("muscleGroup", muscleGroup);

    const response = await fetch(url);
    const exercises = await response.json();

    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
}

// Display exercises for selected muscle group
async function displayExercises(muscleGroup) {
  const exercises = await fetchExercises(muscleGroup);
  exerciseCardsContainer.innerHTML = "";

  exercises.forEach((exercise) => {
    exerciseCardsContainer.innerHTML += createExerciseCard(exercise);
  });

  // Add event listeners to select buttons
  document.querySelectorAll(".select-exercise-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".exercise-card");
      card.classList.add("selected");
      selectedExercise = exercises.find(
        (ex) => ex.name === card.dataset.exercise,
      );
      exerciseDetailsForm.classList.remove("d-none");
      // Scroll to exercise details form
      exerciseDetailsForm.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Create selected exercise HTML
function createSelectedExerciseHTML(exercise, details) {
  const exerciseId = Date.now(); // Generate unique ID for the exercise
  return `
      <div class="card mb-3 selected-exercise" data-exercise-id="${exerciseId}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="card-title">${exercise.name}</h5>
              <p class="card-text mb-1">Weight: ${details.weight} lbs</p>
              <p class="card-text mb-1">Sets: ${details.sets}</p>
              <p class="card-text">Reps: ${details.reps}</p>
              <input type="hidden" name="exercises[${exerciseId}][name]" value="${exercise.name}">
              <input type="hidden" name="exercises[${exerciseId}][weight]" value="${details.weight}">
              <input type="hidden" name="exercises[${exerciseId}][sets]" value="${details.sets}">
              <input type="hidden" name="exercises[${exerciseId}][reps]" value="${details.reps}">
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-exercise">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
}

// Reset exercise selection area
function resetExerciseSelection() {
  exerciseDetailsForm.classList.add("d-none"); // hide exercise details form
  muscleGroupSelect.value = ""; // reset muscle group dropdown
  exerciseCardsContainer.innerHTML = ""; // clear exercise cards
  document.getElementById("weight-input").value = "";
  document.getElementById("sets-input").value = "4";
  document.getElementById("reps-input").value = "8";
  selectedExercise = null;
}

// Validate exercise details
function validateExerciseDetails() {
  const weightInput = document.getElementById("weight-input");
  const setsInput = document.getElementById("sets-input");
  const repsInput = document.getElementById("reps-input");

  if (!weightInput.value || weightInput.value < 0) {
    alert("Please enter a valid weight");
    return false;
  }

  if (!setsInput.value || setsInput.value < 1 || setsInput.value > 10) {
    alert("Please enter a valid number of sets (1-10)");
    return false;
  }

  if (!repsInput.value || repsInput.value < 1 || repsInput.value > 20) {
    alert("Please enter a valid number of reps (1-20)");
    return false;
  }

  return true;
}

// Event Listeners
addExerciseBtn.addEventListener("click", () => {
  exerciseSelectionArea.classList.add("active");
  resetExerciseSelection();
});

muscleGroupSelect.addEventListener("change", (e) => {
  if (e.target.value) {
    displayExercises(e.target.value);
    exerciseDetailsForm.classList.add("d-none");
  }
});

addToPlanBtn.addEventListener("click", () => {
  if (!selectedExercise) return;

  if (!validateExerciseDetails()) return;

  const details = {
    weight: document.getElementById("weight-input").value,
    sets: document.getElementById("sets-input").value,
    reps: document.getElementById("reps-input").value,
  };

  selectedExercisesContainer.innerHTML += createSelectedExerciseHTML(
    selectedExercise,
    details,
  );

  // Add event listener to remove button
  const removeButtons = document.querySelectorAll(".remove-exercise");
  removeButtons[removeButtons.length - 1].addEventListener("click", (e) => {
    e.target.closest(".selected-exercise").remove();
  });

  resetExerciseSelection();
  exerciseSelectionArea.classList.remove("active");
});

cancelAddBtn.addEventListener("click", () => {
  resetExerciseSelection();
});

createPlanForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const planName = document.getElementById("plan-name").value;
  if (!planName) {
    alert("Please enter a plan name");
    return;
  }

  const selectedExercises = document.querySelectorAll(".selected-exercise");
  if (selectedExercises.length === 0) {
    alert("Please add at least one exercise to your plan");
    return;
  }

  const workoutPlan = {
    name: planName,
    exercises: Array.from(selectedExercises).map((exerciseEl) => {
      const exerciseId = exerciseEl.dataset.exerciseId;
      return {
        name: exerciseEl.querySelector(
          `input[name="exercises[${exerciseId}][name]"]`,
        ).value,
        weight: exerciseEl.querySelector(
          `input[name="exercises[${exerciseId}][weight]"]`,
        ).value,
        sets: exerciseEl.querySelector(
          `input[name="exercises[${exerciseId}][sets]"]`,
        ).value,
        reps: exerciseEl.querySelector(
          `input[name="exercises[${exerciseId}][reps]"]`,
        ).value,
      };
    }),
  };

  console.log("Workout Plan Created:", workoutPlan);
  // Here you would typically send the workout plan to your backend

  // Optional: Redirect to home page or show success message
  alert("Workout plan created successfully!");
  window.location.href = "/";
});

// Initialize the page
initializeMuscleGroups();
