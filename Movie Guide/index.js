const movieNameRef = document.getElementById("movie-name");
const searchBtn = document.getElementById("search-btn");
const result = document.getElementById("result");

const key = "5fe1d97b";

async function getMovie() {
  const movieName = movieNameRef.value.trim();

  if (!movieName) {
    result.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
    return;
  }

  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${key}&plot=full`;

  result.innerHTML = `<h3 class="msg">Loading...</h3>`;

  try {
    const resp = await fetch(url);

    // If the request itself failed (rare but possible)
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();

    // OMDb returns Response:"False" with an Error message
    if (data.Response !== "True") {
      result.innerHTML = `<h3 class="msg">${data.Error || "Movie not found"}</h3>`;
      return;
    }

    const rated = data.Rated && data.Rated !== "N/A" ? data.Rated : "N/A";

    const genresHTML =
      data.Genre && data.Genre !== "N/A"
        ? data.Genre.split(",").map(g => `<div>${g.trim()}</div>`).join("")
        : `<div>N/A</div>`;

    const posterHTML =
      data.Poster && data.Poster !== "N/A"
        ? `<img src="${data.Poster}" class="poster" alt="Poster of ${data.Title}">`
        : `<div class="poster placeholder">No poster</div>`;

    // Plot at bottom under the photo (spans full width)
    result.innerHTML = `
      <div class="info">
        ${posterHTML}

        <div class="movie-meta">
          <h2>${data.Title}</h2>

          <div class="details">
            <span>${data.Year} • ${rated}</span>
          </div>

          <div class="genre">
            ${genresHTML}
          </div>
        </div>

        <p class="plot">
    <span class="plot-title">Plot:</span>
        ${data.Plot}
        </p>
      </div>
    `;
  } catch (err) {
    console.error("Fetch/API error:", err);
    result.innerHTML = `<h3 class="msg">API error: ${err.message}</h3>`;
  }
}

searchBtn.addEventListener("click", getMovie);
movieNameRef.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getMovie();
});
window.addEventListener("load", getMovie);
