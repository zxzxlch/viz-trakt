const apiBaseUrl = 'https://api.trakt.tv';

function buildRequest(endPoint: string, query?: any, opts: RequestInit = {}) {
  const headers = new Headers({
    'content-type': 'application/json',
    'trakt-api-version': process.env.TRAKT_API_VERSION,
    'trakt-api-key': process.env.TRAKT_API_ID,
  });

  // Form URL and query string
  let url = `${apiBaseUrl}${endPoint}`;
  if (query) {
    let params = new URLSearchParams();
    for (const key in query) {
      params.set(key, query[key]);
    }
    url = `${url}?${params.toString()}`;
  }

  return new Request(url, { headers, ...opts });
}

export async function search(query: string) {
  const res = await fetch(buildRequest('/search/movie,show', { query, limit: 7 }));
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

export async function getShow(id: string) {
  const res = await fetch(buildRequest(`/shows/${id}`, { extended: 'full' }));
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

export async function getSeasons(showId: string) {
  const res = await fetch(
    buildRequest(`/shows/${showId}/seasons`, { extended: 'full,episodes' }),
  );
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}
