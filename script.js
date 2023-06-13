let allEpisodes;

function setup() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", makePageForMatchingEpisodes);

  fetchShowsData();
}

function fetchShowsData() {
  fetch("https://api.tvmaze.com/shows")
    .then(response => response.json())
    .then(handleShowsData);
}

function handleShowsData(data) {
  const allShows = data;
  sortShowsByName(allShows);
  makeShowSelector(allShows);
  fetchEpisodesForShow(allShows[0].id);
}

function sortShowsByName(shows) {
  shows.sort((a, b) => a.name.localeCompare(b.name));
}

function fetchEpisodesForShow(showId) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then(response => response.json())
    .then(handleEpisodesData);
}

function handleEpisodesData(data) {
  allEpisodes = data;
  makePageForEpisodes(allEpisodes);
}

function makePageForMatchingEpisodes(event) {
  const query = document.getElementById("searchInput").value;
  const filteredEpisodes = allEpisodes.filter(episode =>
    episodeMatchesQuery(episode, query)
  );
  makePageForEpisodes(filteredEpisodes);
}

function episodeMatchesQuery(episode, query) {
  const nameContainsQuery = contains(episode.name, query);
  const summaryContainsQuery = contains(episode.summary, query);
  return nameContainsQuery || summaryContainsQuery;
}

function contains(str, target) {
  return str.toLowerCase().includes(target.toLowerCase());
}

function handleChosenEpisode(event) {
  const selectedOption = event.target.selectedOptions[0];
  if (!selectedOption) {
    return;
  }
  const id = selectedOption.value;
  document.location.assign(`#${id}`);
}

function handleChosenShow(event) {
  const selectedOption = event.target.selectedOptions[0];
  if (!selectedOption) {
    return;
  }
  const id = selectedOption.value;
  fetchEpisodesForShow(Number(id));
}

function makeShowSelector(shows) {
  const showSelect = document.getElementById("showSelect");
  showSelect.textContent = "";
  showSelect.onchange = handleChosenShow;
  shows.forEach(show => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
}

function makeEpisodeSelector(episodes) {
  const episodeSelect = document.getElementById("episodeSelect");
  episodeSelect.textContent = "";
  episodeSelect.onchange = handleChosenEpisode;
  episodes.forEach(episode => {
    const option = document.createElement("option");
    const code = makeEpisodeCode(episode);
    option.value = code;
    option.textContent = `${code} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

function pad(number) {
  return number.toString().padStart(2, "0");
}

function makeEpisodeCode(episode) {
  const seasonCode = pad(episode.season);
  const episodeCode = pad(episode.number);
  return `S${seasonCode}E${episodeCode}`;
}

function makePageForEpisodes(episodes) {
  makeEpisodeSelector(episodes);

  const countDisplay = document.getElementById("countDisplay");
  countDisplay.textContent = `Displaying ${episodes.length}/${allEpisodes.length} episodes.`;

  const episodesContainer = document.getElementById("episodes");
  episodesContainer.textContent = "";
  episodes.forEach(episode => {
    const card = createEpisodeCard(episode);
    episodesContainer.appendChild(card);