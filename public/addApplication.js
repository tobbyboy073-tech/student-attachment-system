document.getElementById("applicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const application = {
    studentName: document.getElementById("studentName").value,
    companyName: document.getElementById("companyName").value,
    opportunityTitle: document.getElementById("opportunityTitle").value
  };

  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application)
  });

  const result = await response.json();
  document.getElementById("message").innerText = result.message;
});
