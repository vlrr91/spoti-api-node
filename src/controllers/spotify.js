// Read .env file
require('dotenv').config();

const fetch = require('node-fetch');

let tokenAPI;

async function fetchSpotify(url, headers, method = 'get', body) {
  try {
    if (method === 'get') {
      const response = await fetch(url, { headers });
      return await response.json();
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    });
    return await response.json();
  } catch(error) {
    console.log(`Error fetchSpotify ${error}`);
  }
}

async function generateToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const headerAuthorization = `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const url = 'https://accounts.spotify.com/api/token';
  const headers = { 'Authorization': headerAuthorization };
  const body = params;
  const method = 'post';

  const { access_token: token } = await fetchSpotify(url, headers, method, body);
  return token;
}

function destructuringNewReleases(newReleases) {
  return newReleases.map(release => {
    const {
      id,
      name,
      artists,
      images
    } = release;
    return {
      id,
      name,
      artists,
      images
    }
  });
}

async function getNewReleases(req, res) {
  const country = req.query.country || 'US';
  
  const url = `https://api.spotify.com/v1/browse/new-releases?country=${country}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenAPI}`
  };
  try {
    const data = await fetchSpotify(url, headers);

    if (data.error && data.error.status === 401) {
      tokenAPI = await generateToken();
      headers['Authorization'] = `Bearer ${tokenAPI}`;
  
      const data = await fetchSpotify(url, headers);
      const newReleases = destructuringNewReleases(data.albums.items);
      res.json(newReleases);
      return;
    }

    const newReleases = destructuringNewReleases(data.albums.items);
    res.json(newReleases);
  } catch (error) {
    return error;
  }
}

function destructuringTracksAlbum(tracks) {
  return tracks.map(track => {
    const { id, name, artists } = track;
    return { id, name, artists }
  });   
}

async function getTracksAlbum(req, res) {
  const id = req.params.id;
  const url = `https://api.spotify.com/v1/albums/${id}/tracks`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenAPI}`
  };

  const data = await fetchSpotify(url, headers);

  if (data.error && data.error.status === 401) {
    tokenAPI = await generateToken();
    headers['Authorization'] = `Bearer ${tokenAPI}`;

    const data = await fetchSpotify(url, headers);
    const tracks = destructuringTracksAlbum(data.items);
    res.json(tracks);
    return;
  }

  const tracks = destructuringTracksAlbum(data.items);
  res.json(tracks);
}

function destructuringArtist(artist) {
  const {
    id,
    name,
    images,
    external_urls
  } = artist;
  return {
    id,
    name,
    images,
    externalUrl: external_urls.spotify
  }
}

async function getArtistById(req, res) {
  const id = req.params.id;
  const url = `https://api.spotify.com/v1/artists/${id}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenAPI}`
  };

  const data = await fetchSpotify(url, headers);

  if (data.error && data.error.status === 401) {
    tokenAPI = await generateToken();
    headers['Authorization'] = `Bearer ${tokenAPI}`;

    const data = await fetchSpotify(url, headers);
    const artist = destructuringArtist(data);
    res.json(artist);
    return;
  }

  const artist = destructuringArtist(data);
  res.json(artist);
}

function destructuringTopTracks(topTracks) {
  return topTracks.map(track => {
    const { id, name, artists} = track;
    return { id, name, artists };
  })
  
}

async function getTopTracksByArtist(req, res) {
  const id = req.params.id;
  const country = req.query.country || 'US';

  const url = `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${country}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenAPI}`
  };

  const data = await fetchSpotify(url, headers);

  if (data.error && data.error.status === 401) {
    tokenAPI = await generateToken();
    headers['Authorization'] = `Bearer ${tokenAPI}`;

    const data = await fetchSpotify(url, headers);
    const topTracks = destructuringTopTracks(data.tracks);
    res.json(topTracks);
    return;
  }
  const topTracks = destructuringTopTracks(data.tracks);
  res.json(topTracks);
}

function destructuringSearchArtists(artists) {
  return artists.map(artist => destructuringArtist(artist));
}

async function searchByType(req, res) {
  const query = req.query.q;
  const type = req.query.type || 'artist';

  const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenAPI}`
  };

  const data = await fetchSpotify(url, headers);

  if (data.error && data.error.status === 401) {
    tokenAPI = await generateToken();
    headers['Authorization'] = `Bearer ${tokenAPI}`;

    const data = await fetchSpotify(url, headers);
    const artists = destructuringSearchArtists(data.artists.items);
    res.json(artists);
    return;
  }
  const artists = destructuringSearchArtists(data.artists.items);
  res.json(artists);
}

module.exports = {
  getNewReleases,
  getTracksAlbum,
  getArtistById,
  getTopTracksByArtist,
  searchByType
}