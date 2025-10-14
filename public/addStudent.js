document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const course = document.getElementById("course").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const year = document.getElementById("year").value;

  if (!name || !course || !phone || !year) {
    document.getElementById("message").textContent = "❌ All fields are required.";
    return;
  }

  const student = { name, course, phone, year };

  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("message").textContent = "✅ " + data.message;
      document.getElementById("studentForm").reset();
      document.getElementById("applyBtn").style.display = "inline-block";
    } else {
      document.getElementById("message").textContent = "❌ " + data.error;
    }
  } catch (err) {
    document.getElementById("message").textContent = "❌ Network error.";
  }
});
