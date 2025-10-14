// applyAttachment.js

// Fetch opportunities when page loads
fetch("/api/opportunities")
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    console.log("✅ Opportunities loaded:", data);
    const select = document.getElementById("opportunity");

    if (data.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No opportunities available";
      select.appendChild(option);
      return;
    }

    data.forEach(op => {
      const option = document.createElement("option");
      option.value = op.id;
      option.textContent = `${op.title} (${op.company_name || 'Unknown Company'})`;
      select.appendChild(option);
    });
  })
  .catch(error => {
    console.error("❌ Fetch error:", error);
    document.getElementById("message").textContent = "❌ Failed to load opportunities.";
  });

// Handle form submission
document.getElementById("applicationForm").addEventListener("submit", e => {
  e.preventDefault();

  const application = {
    student: document.getElementById("studentName").value,
    opportunityId: document.getElementById("opportunity").value,
    coverLetter: document.getElementById("coverLetter").value
  };

  fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application)
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Application response:", data);
      document.getElementById("message").textContent = "✅ Application submitted successfully!";
      document.getElementById("applicationForm").reset();
    })
    .catch(err => {
      console.error("❌ Submission error:", err);
      document.getElementById("message").textContent = "❌ Failed to submit application.";
    });
});
