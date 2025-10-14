const form = document.getElementById("companyForm");
const message = document.getElementById("message");
const addOpportunityBtn = document.getElementById("addOpportunityBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!name || !location) {
    message.textContent = "❌ All fields are required";
    return;
  }

  try {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location })
    });
    const data = await res.json();
    if (res.ok) {
      message.textContent = "✅ Company added successfully!";
      addOpportunityBtn.style.display = "inline-block";
    } else {
      message.textContent = "❌ " + data.error;
    }
  } catch (err) {
    message.textContent = "❌ Network error";
  }
});

// Redirect to Add Opportunity
addOpportunityBtn.addEventListener("click", () => {
  window.location.href = "addOpportunity.html";
});
