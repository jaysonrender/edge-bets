require('dotenv').config();

const mysql2 = require('mysql2');
const createConnection = require('../database/dbConnect');
const fs = require('fs');
const axios = require('axios');

//TODO: need to integrate into backend server
    // add query to update scores, not just insert scores
    // how to start updating scores when games start?
    // update in real time or periodically?
    // refactor with new API
        //include logo image url?
async function getScoresFromAPI(week){
    // const results = await axios.get(`https://api.sportradar.us/nfl/official/trial/v7/en/games/2022/REG/schedule.json?api_key=${process.env.API_KEY}`);
    // let parsedResult = [];
    
    // let games = [...results.data.weeks[week - 1].games];
    

    // for(let i = 0, length = games.length; i < length; i++) {
    //     const homeAlias = games[i].home.alias;
    //     let homePointDiff = 0;
    //     if(games[i].hasOwnProperty('scoring'))
    //         homePointDiff = games[i].scoring.home_points - games[i].scoring.away_points;
    //     let entry = {'nfl_week': week, 'team_alias': homeAlias, 'score': homePointDiff}
    //     parsedResult.push(entry);

    //     const awayAlias = games[i].away.alias;
    //     let awayPointDiff = 0;
    //     if(games[i].hasOwnProperty('scoring'))
    //         awayPointDiff = games[i].scoring.away_points - games[i].scoring.home_points;
        
    //     entry = {'nfl_week': week, 'team_alias': awayAlias, 'score': awayPointDiff};
    //     parsedResult.push(entry);

    // }
    const parsedResult = []
    const {data} = await axios.get(`https://api.mysportsfeeds.com/v2.1/pull/nfl/2022-2023-regular/week/${week}/games.json`, 
    {
        headers: {
            'Authorization': `Basic ZWVhZjhkZmYtNjIzOC00MDJjLWJhOTMtYzg3NGM1Ok1ZU1BPUlRTRkVFRFM=`
        }
    });

    for (game of data.games) {

        const homeAlias = game.schedule.homeTeam.abbreviation;
        let homePointDiff = 0;

        const awayAlias = game.schedule.awayTeam.abbreviation;
        let awayPointDiff = 0;

        if (game.score.homeScoreTotal != null && game.score.awayScoreTotal != null) {
            
            homePointDiff = game.score.homeScoreTotal - game.score.awayScoreTotal;
            awayPointDiff = game.score.awayScoreTotal - game.score.homeScoreTotal;
        }

        let homeEntry = {'nfl_week': week, 'team_alias': homeAlias, 'score': homePointDiff};
        parsedResult.push(homeEntry);

        let awayEntry = {'nfl_week': week, 'team_alias': awayAlias, 'score': awayPointDiff};
        parsedResult.push(awayEntry);

    }

    return parsedResult;

}

async function insertOrUpdateScores() {
    const scores = await getScoresFromAPI(1);
    const db = await createConnection()
    // const db = await mysql2.createConnection({
    //     host: '127.0.0.1',
    //     port: 3306,
    //     user: 'jayson',
    //     password: 'dirigible',
    //     database: 'babb_picks',
    //     namedPlaceholders: true
    // });
    

    const scoreQuery = fs.readFileSync('../database/queries/insertOrUpdateScores.sql', 'utf8');

    for (score of scores){
        try{
            db.execute(scoreQuery, [score.nfl_week, score.team_alias, score.score, score.score], (error, rows, fields) => {
                if (error)
                    throw error;
            });
            console.log('success');
        }catch (error) {
            console.log(error)
        }
    }
    
    db.unprepare(scoreQuery);
    
    await db.end();
}

insertOrUpdateScores()