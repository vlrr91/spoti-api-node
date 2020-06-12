const { getDataSpotify } = require('../services/spotify');

async function getArtistById(req, res, next) {
  const id = req.params.id;
  const url = `https://api.spotify.com/v1/artists/${id}`;

  try {
    const data = await getDataSpotify(url);
    const {
      id,
      name,
      images,
      external_urls
    } = data;
    res.json({
      id,
      name,
      images,
      externalUrl: external_urls.spotify
    });
  } catch (error) {
    return next(error);
  }
}

async function getTopTracksByArtist(req, res, next) {
  const id = req.params.id;
  const country = req.query.country || 'US';
  const url = `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${country}`;

  try {
    const data = await getDataSpotify(url);
    console.log(data)
    const topTracks = data.tracks.map(track => {
      const {
        id,
        name,
        artists,
        preview_url,
        album
      } = track;
      return {
        id,
        name,
        artists,
        previewUrl: preview_url,
        album
      };
    });
    res.json(topTracks);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getArtistById,
  getTopTracksByArtist,
};
