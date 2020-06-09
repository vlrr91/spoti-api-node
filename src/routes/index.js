const { Router } = require('express');

const { getNewReleases, getTracksAlbum } = require('../controllers/album.controller');
const { getArtistById, getTopTracksByArtist } = require('../controllers/artist.controller');
const { searchByType } = require('../controllers/search.controller');

const router = Router();

// Album routes
router.get('/album/new-releases', getNewReleases);
router.get('/album/:id/tracks', getTracksAlbum);
// Artist routes
router.get('/artists/:id', getArtistById);
router.get('/artists/:id/top-tracks', getTopTracksByArtist);
// Search Routes
router.get('/search', searchByType);

module.exports = router;