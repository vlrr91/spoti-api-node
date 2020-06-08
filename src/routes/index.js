const { Router } = require('express');

const {
  getNewReleases,
  getTracksAlbum,
  getArtistById,
  getTopTracksByArtist,
  searchByType
} = require('../controllers/spotify');

const router = Router();

router.get('/new-releases', getNewReleases);
router.get('/album/:id/tracks', getTracksAlbum);
router.get('/artists/:id', getArtistById);
router.get('/artists/:id/top-tracks', getTopTracksByArtist);
router.get('/search', searchByType);

module.exports = router;