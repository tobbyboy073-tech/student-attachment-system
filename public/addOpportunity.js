const form = document.getElementById("opportunityForm");
const message = document.getElementById("message");
const companySelect = document.getElementById("companySelect");

// Load companies
async function loadCompanies() {
  try {
    const res = await fetch("/api/companies");
    const companies = await res.json();
    companySelect.innerHTML = '<option value="">--Select Company--</option>';
    companies.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      companySelect.appendChild(opt);
    });
  } catch {
    message.textContent = "❌ Failed to load companies";
  }
}

loadCompanies();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const companyId = companySelect.value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!companyId || !title || !description) {
    message.textContent = "❌ All fields are required";
    return;
  }

  try {
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, title, description })
    });
    const data = await res.json();
    if (res.ok) {
      message.textContent = "✅ Opportunity added successfully!";
      form.reset();
    } else {
      message.textContent = "❌ " + data.error;
    }
  } catch {
    message.textContent = "❌ Network error";
  }
});
