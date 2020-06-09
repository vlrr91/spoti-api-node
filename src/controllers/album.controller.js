const { getDataSpotify } = require('../services/spotify');

async function getNewReleases(req, res, next) {
  const country = req.query.country || 'US';
  const url = `https://api.spotify.com/v1/browse/new-releases?country=${country}`;

  try {
    const data = await getDataSpotify(url);
    const newReleases = data.albums.items.map(release => ({
      id: release.id,
      name: release.name,
      artists: release.artists,
      images: release.image
    }));

    res.json(newReleases);
  } catch (error) {
    return next(error);
  }
}

async function getTracksAlbum(req, res, next) {
  const id = req.params.id;
  const url = `https://api.spotify.com/v1/albums/${id}/tracks`;

  try {
    const data = await getDataSpotify(url);
    const tracks = data.items.map(track => {
      const { id, name, artists } = track;
      return { id, name, artists }
    });

    res.json(tracks);
  } catch(error) {
    return next(error);
  }
}

module.exports = {
  getNewReleases,
  getTracksAlbum,
};

