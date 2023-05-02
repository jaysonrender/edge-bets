
const createConnection = require('../database/dbConnect');
const fs = require('fs');
const getCurrentWeek = require('../util/getCurrentWeek');

//GET methods
async function getUserStats(request, response) {
    const { leagueID, userID } = request.params;

    const db = await createConnection();
    const statsQuery = fs.readFileSync('./database/queries/getUserByID.sql', 'utf8');
    try {
        const [result] = await db.execute(statsQuery, [leagueID, userID], (error, rows, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(statsQuery);

        response.status(200).json({
            fullname: result[0].fname + ' ' + result[0].lname,
            score: result[0].score,
            rank: result[0].player_rank,
            flexPicks: result[0].flex_picks
        })
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getUserPicks(request, response) {
    const { userID } = request.params;

    const db = await createConnection();
    const picksQuery = fs.readFileSync('./database/queries/getUserPicks.sql', 'utf8');
    try {
        const [pickResults] = await db.execute(picksQuery, [userID], (error, rows, fields) => {
            if (error)
                console.log(error);
        });

        db.unprepare(picksQuery);
        response.status(200).json(pickResults);
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getAllPlayersPicksAndScores(request, response) {
    const { leagueID } = request.params;

    const db = await createConnection();

    const scoreQuery = fs.readFileSync('./database/queries/getUserScoreRank.sql', 'utf8');
    const picksQuery = fs.readFileSync('./database/queries/getUserPicks.sql', 'utf8');


    try {
        //first query pulls user's name score and rank
        const [scoreResults, fields] = await db.execute(scoreQuery, [leagueID], (error, rows, fields) => {
            if (error)
                console.log(error);
        });

        db.unprepare(scoreQuery);


        let formattedResult = [...scoreResults];
        for (let i = 0, length = formattedResult.length; i < length; i++) {
            let userID = formattedResult[i].user_id

            const [pickResults, fields] = await db.execute(picksQuery, [userID], (error, rows, fields) => {
                if (error)
                    console.log(error);
            });
            Object.assign(formattedResult[i], { picks: pickResults })

        }
        db.unprepare(picksQuery);


        response.status(200).json(formattedResult);
        /*
            EXAMPLE JSON OF formattedResult
            {
                "user_id": 126,
                "username": "jayson",
                "fullname": "Jayson Render",
                "score": -16,
                "player_rank": 3,
                "picks": [
                    {
                        "pick_week": 4,
                        "pick1": "ATL",
                        "pick1_name": "Atlanta Falcons",
                        "pick1_score": 3,
                        "pick2": "BAL",
                        "pick2_name": "Baltimore Ravens",
                        "pick2_score": -3,
                        "week_total": 0
                    },
                    {
                        "pick_week": 5,
                        "pick1": "MIA",
                        "pick1_name": "Miami Dolphins",
                        "pick1_score": -23,
                        "pick2": "MIN",
                        "pick2_name": "Minnesota Vikings",
                        "pick2_score": 7,
                        "week_total": -16
                    }
                ]
            }
        
        */

    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}

async function getGamesByWeek(request, response) {
    const { pickWeek } = request.params;
    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/getGamesByWeek.sql', 'utf8');

    const currentDate = new Date('2022-09-06T00:00:00'); //TODO: update this to be actual current date when new season starts
    try {
        const [results, fields] = await db.execute(query, [pickWeek, currentDate], (err, result, fields) => { });

        for (let i = 0, j = results.length; i < j; i++) {
            results[i].game_time = results[i].game_time.toLocaleString();
        }

        db.unprepare(query);
        response.status(200).json(results);

    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }


}

async function getLeagueLeaders(request, response) {
    const { leagueID } = request.params;

    const db = await createConnection();
    const query = fs.readFileSync('./database/queries/getLeagueLeaders.sql', 'utf8');

    try {
        //prepared statement needs leagueID 4 times
        const [result] = await db.execute(query, [leagueID, leagueID, leagueID, leagueID], (error, rows, fields) => {
            if (error)
                console.log(error);
        })

        db.unprepare(query);
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json(error.message)
    } finally {
        await db.end();
    }
}


//POST methods
async function submitPick(request, response) {
    const { userID, pickWeek, pick1, pick2, flexPickStatus } = request.body;
    const db = await createConnection();


    //TODO: CHECK IF PLAYER IS ABOUT TO MAKE A DUPLICATE PICK AND ASK USER IF THEY WANT TO USE FLEX PICK, IF NOT RESET PICK

    //first check if pick already exist
    // const picksQuery = fs.readFileSync('./database/queries/getUserPicks.sql', 'utf8');

    //query all users picks
    //if pick1 or pick2 in results
    //send bad response
    //if flexPickStatus = false;

    const query = fs.readFileSync('./database/queries/insertPicks.sql', 'utf8');
    try {
        await db.execute(query, [userID, pickWeek, pick1, pick2], (error, rows, fields) => {
            if (error)
                throw error;
        });
        db.unprepare(query);
        db.end((error) => {
            if (error)
                response.status(400).json({ errorMessage: error.message })
        });
        response.status(200).json({ message: 'Pick successfully submitted!' });
    } catch (error) {
        response.status(400).json(error);
    } finally {
        await db.end();
    }
}

//DELETE methods

//delete a pick

//delete a user

//delete a league


//PATCH methods
//change user information

//change picks


module.exports = { submitPick, getAllPlayersPicksAndScores, getUserPicks, getUserStats, getGamesByWeek, getLeagueLeaders };