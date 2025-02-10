import getApiBaseUrl from "./getApiBaseUrl.js";

const baseUrl = getApiBaseUrl();

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
  if (planDetails) {
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
    <button class="btn btn-danger mt-3 delete-plan-btn">
      <i class="fas fa-trash me-2"></i>Delete Plan
    </button>
    <button class="btn mt-3 btn-outline-primary edit-name-btn">
        <i class="fas fa-edit me-2"></i>Edit Name
    </button>

    <!-- Simple Modal for Edit Name -->
    <div class="edit-name-modal d-none" id="editNameModal-${planDetails._id}">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Edit Plan Name</h5>
            <button type="button" class="btn-close close-modal"></button>
          </div>
          <div class="card-body">
            <form id="editNameForm-${planDetails._id}">
              <div class="mb-3">
                <label for="newPlanName-${planDetails._id}" class="form-label">New Plan Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="newPlanName-${planDetails._id}" 
                  value="${planDetails.name}"
                  required
                >
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2 close-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  } else {
    return `
    <p>Error loading plan details</p>
    <button class="btn btn-danger mt-3 delete-plan-btn">
      <i class="fas fa-trash me-2"></i>Delete Plan
    </button>
  `;
  }
}

async function fetchWorkoutPlans(sort) {
  try {
    const url = new URL(`${baseUrl}/plans`);

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
    const response = await fetch(`${baseUrl}/plans/${planId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch plan details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching plan details:", error);
    return null;
  }
}

async function updatePlanName(planId, newName) {
  try {
    const response = await fetch(`${baseUrl}/plans/${planId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      throw new Error("Failed to update plan name");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating plan name:", error);
    throw error;
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

    // Render details
    detailsElement.innerHTML = createDetailsContent(planDetails);

    // Add delete button listener
    const deleteButton = detailsElement.querySelector(".delete-plan-btn");
    if (deleteButton) {
      deleteButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent card toggle
        deletePlan(planId);
      });
    }

    // Add edit name button listener
    const editButton = detailsElement.querySelector(".edit-name-btn");
    const editModal = document.getElementById(`editNameModal-${planId}`);

    if (editButton && editModal) {
      // Show modal
      editButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent card toggle
        editModal.classList.remove("d-none");
      });

      // Hide modal
      const closeButtons = editModal.querySelectorAll(".close-modal");
      closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          editModal.classList.add("d-none");
        });
      });

      // Close modal when clicking overlay
      const overlay = editModal.querySelector(".modal-overlay");
      overlay.addEventListener("click", () => {
        editModal.classList.add("d-none");
      });
    }

    // Add form submission listener
    const editForm = document.getElementById(`editNameForm-${planId}`);
    if (editForm) {
      editForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const newName = document
          .getElementById(`newPlanName-${planId}`)
          .value.trim();

        if (newName) {
          try {
            await updatePlanName(planId, newName);
            // Close the modal
            document
              .getElementById(`editNameModal-${planId}`)
              .classList.add("d-none");
            // Refresh the workout plans to show the updated name
            renderWorkoutPlans();
            alert("Plan name updated successfully!");
          } catch (error) {
            console.log("Error updating plan name:", error);
            alert("Failed to update plan name. Please try again.");
          }
        }
      });
    }
  }
}

async function deletePlan(planId) {
  if (confirm("Are you sure you want to delete this workout plan?")) {
    try {
      const response = await fetch(`${baseUrl}/plans/${planId}`, {
        method: "DELETE",
      });

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
