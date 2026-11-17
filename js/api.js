(function () {
  'use strict';
  const API_URL = 'https://ghibliapi.vercel.app/films';
  const wrapper = document.getElementById('mvApiSection');
  if (!wrapper) return;

  const grid = document.getElementById('mvApiGrid');
  const status = document.getElementById('mvApiStatus');
  const resultCount = document.getElementById('mvApiCount');
  const search = document.getElementById('mvApiSearch');
  const directorSelect = document.getElementById('mvApiDirector');
  const sortSelect = document.getElementById('mvApiSort');
  const refresh = document.getElementById('mvApiRefresh');
  let films = [];
  let controller = null;

  function message(text, kind) {
    status.textContent = text;
    status.className = 'mv-api-status' + (kind ? ' mv-api-' + kind : '');
    status.hidden = !text;
  }

  function allowedImage(raw) {
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' ? url.href : null;
    } catch (_) { return null; }
  }

  function makeTextElement(tagName, className, text) {
    const el = document.createElement(tagName);
    if (className) el.className = className;
    el.textContent = String(text || '');
    return el;
  }

  function cardFor(film) {
    const card = makeTextElement('article', 'mv-api-card', '');
    const posterWrap = makeTextElement('div', 'mv-api-poster', '');
    const posterURL = allowedImage(film.image);
    if (posterURL) {
      const img = document.createElement('img');
      img.src = posterURL;
      img.alt = 'Poster for ' + (film.title || 'film');
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        this.remove();
        posterWrap.classList.add('mv-api-poster-fallback');
        posterWrap.appendChild(makeTextElement('span', '', '🎬'));
      }, { once: true });
      posterWrap.appendChild(img);
    } else {
      posterWrap.classList.add('mv-api-poster-fallback');
      posterWrap.appendChild(makeTextElement('span', '', '🎬'));
    }
    card.appendChild(posterWrap);
    const details = makeTextElement('div', 'mv-api-details', '');
    details.appendChild(makeTextElement('h3', '', film.title || 'Untitled'));
    details.appendChild(makeTextElement('p', 'mv-api-meta',
      (film.release_date || 'Year unknown') + ' · ' + (film.director || 'Unknown director')));
    const description = makeTextElement('p', 'mv-api-description', film.description || 'No description available.');
    details.appendChild(description);
    const score = Number(film.rt_score);
    if (Number.isFinite(score) && film.rt_score !== '') {
      details.appendChild(makeTextElement('span', 'mv-api-score', '★ ' + score + '% RT score'));
    }
    card.appendChild(details);
    return card;
  }

  function render() {
    const term = search.value.trim().toLocaleLowerCase();
    const director = directorSelect.value;
    const sortBy = sortSelect.value;
    const selected = films.filter(function (film) {
      const haystack = [film.title, film.director, film.description, film.release_date]
        .join(' ').toLocaleLowerCase();
      return haystack.includes(term) && (!director || film.director === director);
    });
    selected.sort(function (a, b) {
      if (sortBy === 'year-asc') return Number(a.release_date) - Number(b.release_date);
      if (sortBy === 'year-desc') return Number(b.release_date) - Number(a.release_date);
      if (sortBy === 'title') return String(a.title).localeCompare(String(b.title));
      return Number(b.rt_score) - Number(a.rt_score);
    });
    const fragment = document.createDocumentFragment();
    selected.forEach(function (film) { fragment.appendChild(cardFor(film)); });
    grid.replaceChildren(fragment);
    resultCount.textContent = selected.length + ' of ' + films.length + ' films';
    if (!selected.length) message('No matching movies found. Try a different search or director.', 'empty');
    else message('', '');
  }

  function updateDirectors() {
    const previous = directorSelect.value;
    const directors = Array.from(new Set(films.map(f => f.director).filter(Boolean))).sort();
    directorSelect.replaceChildren(new Option('All directors', ''));
    directors.forEach(d => directorSelect.appendChild(new Option(d, d)));
    if (directors.includes(previous)) directorSelect.value = previous;
  }

  async function loadFilms() {
    if (controller) controller.abort();
    controller = new AbortController();
    const current = controller;
    const timeout = setTimeout(() => current.abort(), 12000);
    refresh.disabled = true;
    grid.replaceChildren();
    resultCount.textContent = '';
    message('Loading movies from the Studio Ghibli API…', 'loading');
    try {
      const response = await fetch(API_URL, { signal: current.signal, headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected JSON response');
      films = data.filter(film => film && typeof film.title === 'string');
      if (!films.length) throw new Error('No movies returned');
      updateDirectors();
      render();
    } catch (error) {
      if (current !== controller) return;
      films = [];
      resultCount.textContent = '0 films';
      message('Could not load movies (' + (error.name === 'AbortError' ? 'request timed out' : error.message) + '). Check your internet connection and click Retry.', 'error');
    } finally {
      clearTimeout(timeout);
      if (current === controller) refresh.disabled = false;
    }
  }

  search.addEventListener('input', render);
  directorSelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
  refresh.addEventListener('click', loadFilms);
  loadFilms();
})();