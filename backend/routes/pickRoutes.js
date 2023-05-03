const express = require('express');
const createConnection = require('../database/dbConnect');
const { submitPick, getAllPlayersPicksAndScores, getUserPicks, getUserStats, getGamesByWeek, getLeagueLeaders } = require('../controllers/picksController');
const requireAuth = require('../middleware/requireAuth');

const fs = require('fs');
const router = express.Router();

//require authorization for all pick/game related routes
router.use(requireAuth);

//HTTP GET requests
router.get('/games/:pickWeek', getGamesByWeek);
router.get('/scoreboard/:leagueID', getAllPlayersPicksAndScores);
router.get('/:userID', getUserPicks);
router.get('/stats/:leagueID/:userID', getUserStats);
router.get('/leagueLeaders/:leagueID', getLeagueLeaders);

//POST restquests
router.post('/submitPick', submitPick);

router.delete('/', (req, res) => {
    //TODO: api route for deleting picks from database
    res.json({mssg: 'DELETE request'})
});

router.patch('/:id', (req, res) => {
    //TODO: api route for editing picks from database
    res.json({mssg: 'PATCH request'})
});

module.exports = router;