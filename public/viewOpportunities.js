// public/viewOpportunities.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/opportunities")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(opportunities => {
            const list = document.getElementById("opportunitiesList");
            list.innerHTML = "";

            if (opportunities.length === 0) {
                list.innerHTML = "<li>No opportunities available.</li>";
                return;
            }

            opportunities.forEach(op => {
                const item = document.createElement("li");
                item.textContent = `${op.title} at ${op.company} — ${op.description} (Deadline: ${op.deadline})`;
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error("Error loading opportunities:", error);
            document.getElementById("opportunitiesList").innerHTML =
                "<li>Error loading opportunities.</li>";
        });
});
