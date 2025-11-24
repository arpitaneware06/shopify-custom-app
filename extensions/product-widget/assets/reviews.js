document.addEventListener("DOMContentLoaded", async () => {
    document.querySelectorAll(".my-review-widget").forEach(async (el) => {
      const pid = el.dataset.productId;
  
      // Load reviews
      const reviews = await fetch(`/apps/reviews/list?pid=${pid}`).then(r => r.json());
  
      el.querySelector(".review-list").innerHTML =
        reviews.map(r => `
          <div class="review-card">
            <div class="stars">${"★".repeat(r.rating)}</div>
            <p>${r.text}</p>
          </div>
        `).join("");
  
      // Load review form
      el.querySelector(".review-form").innerHTML = `
        <textarea id="review-text-${pid}" placeholder="Write your review"></textarea>
        <select id="review-rating-${pid}">
          <option value="5">⭐ 5</option>
          <option value="4">⭐ 4</option>
          <option value="3">⭐ 3</option>
          <option value="2">⭐ 2</option>
          <option value="1">⭐ 1</option>
        </select>
        <button class="submit-review">Submit Review</button>
      `;
  
      el.querySelector(".submit-review").addEventListener("click", async () => {
        await fetch(`/apps/reviews/submit`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            pid,
            text: document.getElementById(`review-text-${pid}`).value,
            rating: document.getElementById(`review-rating-${pid}`).value
          })
        });
  
        alert("Review submitted!");
        location.reload();
      });
    });
  });
  