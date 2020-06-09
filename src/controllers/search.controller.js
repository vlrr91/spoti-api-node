const { getDataSpotify } = require('../services/spotify');

async function searchByType(req, res) {
  const query = req.query.q;
  const type = req.query.type || 'artist';
  const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}`;

  try {
    const data = await getDataSpotify(url);
    const artists = data.artists.items.map(artist => ({
      id: artist.id,
      name: artist.name,
      images: artist.images,
      externalUrl: artist.external_urls.spotify
    }));
    
    res.json(artists);
  } catch (error) {
    return error;
  }
}

module.exports = {
  searchByType,
};
