document.addEventListener("DOMContentLoaded", async () => {
    document.querySelectorAll(".my-stars").forEach(async (el) => {
      const pid = el.dataset.productId;
  
      const res = await fetch(`/apps/reviews/rating?pid=${pid}`);
      const data = await res.json();
  
      el.innerHTML = `
        <div class="stars">
          ${"★".repeat(data.average)}${"☆".repeat(5 - data.average)}
          <span class="count">(${data.count})</span>
        </div>
      `;
    });
  });
  