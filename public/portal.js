document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("exam-buttons-container");

  try {
    const response = await fetch("/api/exams/available");
    if (!response.ok) throw new Error("Failed to load exams");

    const result = await response.json();
    const config = result.data;

    const exams = config.exams || {};
    const autoRedirect = config.auto_redirect;

    container.innerHTML = "";

    // --- AUTO REDIRECT LOGIC ---
    if (autoRedirect && autoRedirect.enabled && autoRedirect.url) {
      const redirectUrl = autoRedirect.url;
      const delay = autoRedirect.delay || 5;

      container.innerHTML = `
            <div style="text-align: center; padding: 18px 10px; background: rgba(0,51,102,0.03); border-radius: 60px;">

              <p style="font-size: 1.1rem; color: var(--text-muted);">
                Redirecting in <span id="countdown-timer" style="font-weight:800; color:var(--danger); font-size:2.2rem; padding:0 6px;">${delay}</span> seconds
              </p>

            </div>
          `;

      let timeleft = delay;
      const timerInterval = setInterval(() => {
        timeleft--;
        const timerSpan = document.getElementById("countdown-timer");
        if (timerSpan) timerSpan.innerText = timeleft;
        if (timeleft <= 0) {
          clearInterval(timerInterval);
          window.location.href = `/api/exams/select/auto_redirect`;
        }
      }, 1000);
      return;
    }

    // --- NORMAL MENU ---
    if (Object.keys(exams).length === 0) {
      container.innerHTML = `
            <div class="status-message">
              <span class="icon"><i class="fas fa-exclamation-triangle" style="color:var(--danger);"></i></span>
              No exams are currently configured.
            </div>
          `;
      return;
    }

    // build exam buttons with nice icons and colors
    for (const [id, exam] of Object.entries(exams)) {
      const link = document.createElement("a");
      link.href = `/api/exams/select/${id}`;
      link.className = "exam-btn";
      // use exam.color or fallback to primary
      link.style.backgroundColor = exam.color || "#003366";
      // add a subtle accent border
      link.style.borderBottom = `4px solid ${exam.color ? "#00000030" : "rgba(212,175,55,0.3)"}`;

      // icon based on exam name (simple mapping)
      let icon = "fa-hand-pointer";

      link.innerHTML = `<i class="fas ${icon}"></i> ${exam.name}`;
      container.appendChild(link);
    }
  } catch (error) {
    console.error("Error fetching exams:", error);
    container.innerHTML = `
          <div class="status-message" style="color:var(--danger); border-color:var(--danger);">
            <span class="icon"><i class="fas fa-times-circle"></i></span>
            Error loading exams. Please contact administrator.
          </div>
        `;
  }
});
