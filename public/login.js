document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errBox = document.getElementById("error-msg");
  errBox.style.display = "none";

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/admin-manager.html";
    } else {
      errBox.textContent = data.message || "Login failed";
      errBox.style.display = "block";
    }
  } catch (err) {
    errBox.textContent = "Network error. Please try again.";
    errBox.style.display = "block";
  }
});
