document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/reports");
    const data = await res.json();

    document.getElementById("studentCount").textContent = data.students;
    document.getElementById("companyCount").textContent = data.companies;
    document.getElementById("opportunityCount").textContent = data.opportunities;
    document.getElementById("applicationCount").textContent = data.applications;
  } catch (err) {
    console.error("❌ Failed to load reports:", err);
  }
});
