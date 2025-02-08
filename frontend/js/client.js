// Sample data - replace with your actual data
let workoutPlans = [
  {
    id: 1,
    title: "Full Body Strength",
    createDate: "2024-02-06",
    exerciseCount: 5,
    totalSets: 15,
    totalWeight: 1250,
    exercises: [
      { name: "Bench Press", weight: 135, sets: 3, reps: 10 },
      { name: "Squats", weight: 185, sets: 3, reps: 8 },
      { name: "Deadlifts", weight: 225, sets: 3, reps: 6 },
      { name: "Shoulder Press", weight: 95, sets: 3, reps: 10 },
      { name: "Barbell Rows", weight: 135, sets: 3, reps: 10 },
    ],
  },
  {
    id: 2,
    title: "Back Strength",
    createDate: "2025-02-06",
    exerciseCount: 5,
    totalSets: 15,
    totalWeight: 1250,
    exercises: [
      { name: "Bench Press", weight: 135, sets: 3, reps: 10 },
      { name: "Squats", weight: 185, sets: 3, reps: 8 },
      { name: "Deadlifts", weight: 225, sets: 3, reps: 6 },
      { name: "Shoulder Press", weight: 95, sets: 3, reps: 10 },
      { name: "Barbell Rows", weight: 135, sets: 3, reps: 10 },
    ],
  },
];

function createWorkoutCard(plan) {
  return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card workout-card">
                <div class="card-body">
                    <div class="card-header-section" data-plan-id="${plan.id}">
                        <h5 class="card-title">${plan.title}</h5>
                        <p class="card-text">
                            <small class="text-muted">Created: ${new Date(plan.createDate).toLocaleDateString()}</small>
                        </p>
                        <div class="d-flex justify-content-between">
                            <span><i class="fas fa-running me-2"></i>${plan.exerciseCount} exercises</span>
                            <span><i class="fas fa-layer-group me-2"></i>${plan.totalSets} sets</span>
                            <span><i class="fas fa-dumbbell me-2"></i>${plan.totalWeight} lbs</span>
                        </div>
                    </div>
                    
                    <!-- Expandable Details -->
                    <div class="card-details mt-3" id="details-${plan.id}">
                        <hr>
                        <h6>Exercises:</h6>
                        ${plan.exercises
                          .map(
                            (exercise) => `
                            <div class="exercise-item">
                                <div class="fw-bold">${exercise.name}</div>
                                <div class="text-muted">
                                    ${exercise.weight}lbs × ${exercise.sets} sets × ${exercise.reps} reps
                                </div>
                            </div>
                            `,
                          )
                          .join("")}
                        <button class="btn btn-danger mt-3 delete-plan-btn" data-plan-id="${plan.id}">
                            <i class="fas fa-trash me-2"></i>Delete Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderWorkoutPlans() {
  const container = document.getElementById("workoutPlans");
  container.innerHTML = workoutPlans
    .map((plan) => createWorkoutCard(plan))
    .join("");

  // Add event listeners to newly rendered cards
  attachCardEventListeners();
}

function attachCardEventListeners() {
  // Add click listeners for card headers
  document.querySelectorAll(".card-header-section").forEach((header) => {
    header.addEventListener("click", function () {
      const planId = this.dataset.planId;
      toggleCardDetails(planId);
    });
  });

  // Add click listeners for delete buttons
  document.querySelectorAll(".delete-plan-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent card toggle
      const planId = this.dataset.planId;
      deletePlan(planId);
    });
  });
}

function toggleCardDetails(planId) {
  const details = document.getElementById(`details-${planId}`);
  if (!details) {
    console.error("Could not find details element for plan:", planId);
    return;
  }

  const isCurrentlyShown = details.classList.contains("show");

  // Hide all details first
  document.querySelectorAll(".card-details").forEach((detail) => {
    detail.classList.remove("show");
  });

  // If the clicked card wasn't shown before, show it now
  if (!isCurrentlyShown) {
    details.classList.add("show");
  }
}

function sortPlans(criteria, order) {
  workoutPlans.sort((a, b) => {
    let comparison = 0;
    if (criteria === "name") {
      comparison = a.title.localeCompare(b.title);
    } else if (criteria === "date") {
      comparison = new Date(a.createDate) - new Date(b.createDate);
    }
    return order === "asc" ? comparison : -comparison;
  });
  renderWorkoutPlans();
}

function deletePlan(planId) {
  if (confirm("Are you sure you want to delete this workout plan?")) {
    workoutPlans = workoutPlans.filter((plan) => plan.id !== parseInt(planId));
    renderWorkoutPlans();
  }
}

function handleSubscribe(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector("input");
  const email = emailInput.value;

  // Here you can add your subscription logic
  console.log("Subscribe email:", email);

  // Clear the input and show success message
  emailInput.value = "";
  alert("Thank you for subscribing!");
}

// Initialize all event listeners and render initial content
function initializeApp() {
  // Initial render of workout plans
  renderWorkoutPlans();

  // Add event listeners for sort buttons
  document.querySelectorAll(".sort-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const criteria = this.dataset.sort;
      const order = this.dataset.order;
      sortPlans(criteria, order);
    });
  });

  // Add event listener for newsletter form
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleSubscribe);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
