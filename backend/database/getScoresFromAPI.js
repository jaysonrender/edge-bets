require('dotenv').config();
//TODO: need to integrate into backend server
    // add query to update scores, not just insert scores
    // how to start updating scores when games start?
    // update in real time or periodically?
async function getScoresFromAPI(week){
    const results = await axios.get(`https://api.sportradar.us/nfl/official/trial/v7/en/games/2022/REG/schedule.json?api_key=${process.env.API_KEY}`);
    let parsedResult = [];
    
    let games = [...results.data.weeks[week - 1].games];
    

    for(let i = 0, length = games.length; i < length; i++) {
        const homeAlias = games[i].home.alias;
        let homePointDiff = 0;
        if(games[i].hasOwnProperty('scoring'))
            homePointDiff = games[i].scoring.home_points - games[i].scoring.away_points;
        let entry = {'nfl_week': week, 'team_alias': homeAlias, 'score': homePointDiff}
        parsedResult.push(entry);

        const awayAlias = games[i].away.alias;
        let awayPointDiff = 0;
        if(games[i].hasOwnProperty('scoring'))
            awayPointDiff = games[i].scoring.away_points - games[i].scoring.home_points;
        
        entry = {'nfl_week': week, 'team_alias': awayAlias, 'score': awayPointDiff};
        parsedResult.push(entry);

    }

    return parsedResult;

}