document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("form");
    if (!form) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); 
  
      const data = new FormData(form);
  
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
  
        if (res.ok) {
          // optional: keep your alert if you want
          // alert("Thanks! Your booking request is being sent.");
          window.location.href = "confirmation.html";
        } else {
          // Formspree returns JSON with errors on failure
          alert("Sorry—something went wrong sending your request. Please try again.");
        }
      } catch (err) {
        alert("Network error. Please check your connection and try again.");
      }
    });
  });
  