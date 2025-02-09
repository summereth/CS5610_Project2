function createWorkoutCard(plan) {
  return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card workout-card">
                <div class="card-body">
                    <div class="card-header-section" data-plan-id="${plan._id}">
                        <h5 class="card-title">${plan.name}</h5>
                        <p class="card-text">
                            <small class="text-muted">Created: ${new Date(plan.createdAt).toLocaleDateString()}</small>
                        </p>
                        <div class="d-flex justify-content-between">
                            <span><i class="fas fa-running me-2"></i>${plan.exerciseCount} exercises</span>
                            <span><i class="fas fa-layer-group me-2"></i>${plan.totalSets} sets</span>
                            <span><i class="fas fa-dumbbell me-2"></i>${plan.totalWeight} lbs</span>
                        </div>
                    </div>
                    
                    <!-- Placeholder for expandable details -->
                    <div class="card-details mt-3" id="details-${plan._id}">
                      <!-- Details will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDetailsContent(planDetails) {
  return `
    <hr>
    <h6>Exercises:</h6>
    ${planDetails.exercises
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
    <button class="btn btn-danger mt-3 delete-plan-btn" data-plan-id="${planDetails._id}">
      <i class="fas fa-trash me-2"></i>Delete Plan
    </button>
  `;
}

async function fetchWorkoutPlans(sort) {
  try {
    const url = new URL("http://localhost:3000/api/plans");

    if (sort) {
      url.searchParams.append("sortBy", sort.sortBy);
      url.searchParams.append("sortOrder", sort.sortOrder);
    }

    const res = await fetch(url);
    const plans = await res.json();

    return plans;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    document.getElementById("exerciseList").innerHTML =
      "<p>Error loading exercises. Please try again.</p>";
  }
}

async function fetchPlanDetails(planId) {
  try {
    const response = await fetch(`http://localhost:3000/api/plans/${planId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch plan details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching plan details:", error);
    return null;
  }
}

async function renderWorkoutPlans(sort = {}) {
  const container = document.getElementById("workoutPlans");

  const workoutPlans = await fetchWorkoutPlans(sort);
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

async function toggleCardDetails(planId) {
  const detailsElement = document.getElementById(`details-${planId}`);
  if (!detailsElement) {
    console.error("Could not find details element for plan:", planId);
    return;
  }

  const isCurrentlyShown = detailsElement.classList.contains("show");

  // Hide all details first
  document.querySelectorAll(".card-details").forEach((detail) => {
    detail.classList.remove("show");
  });

  // If the clicked card wasn't shown before, fetch and show its details
  if (!isCurrentlyShown) {
    // Show loading state
    detailsElement.innerHTML =
      '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
    detailsElement.classList.add("show");

    // Fetch plan details
    const planDetails = await fetchPlanDetails(planId);

    if (planDetails) {
      // Render details and add delete button listener
      detailsElement.innerHTML = createDetailsContent(planDetails);

      // Add delete button listener
      const deleteButton = detailsElement.querySelector(".delete-plan-btn");
      if (deleteButton) {
        deleteButton.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent card toggle
          deletePlan(planId);
        });
      }
    } else {
      detailsElement.innerHTML = "<p>Error loading plan details</p>";
    }
  }
}

async function deletePlan(planId) {
  if (confirm("Are you sure you want to delete this workout plan?")) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/plans/${planId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        alert("Workout plan deleted successfully");
      } else {
        alert("Failed to delete workout plan");
      }
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      alert("Failed to delete workout plan");
    }

    renderWorkoutPlans();
  }
}

function handleSubscribe(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector("input");
  const email = emailInput.value;

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
      const sortBy = this.dataset.sort;
      const sortOrder = this.dataset.order;
      renderWorkoutPlans({ sortBy, sortOrder });
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
