const createConnection = require('../database/dbConnect');
const fs = require('fs');
const generateLeagueCode = require('../util/generateLeagueCode');
const encryptPassword = require('../util/encryptPassword');
const validator = require('validator');
const createToken = require('../util/generateJWT');
require('dotenv').config();

//utility function for loginUser
async function validateUser(username, password) {
    const db = await createConnection();

    const values = [username, password, username, password]; //fields for prepared statement in query

    const query = fs.readFileSync('./database/queries/validateUsernameAndPassword.sql', 'utf8');

    try {
        const [result] = await db.execute(query, values, (error, result, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(query);
        db.end();

        if (result.length === 1)
            return result[0];

        else if (result.length === 0) {
            return { errorMessage: "Incorrect Username or Password." };
        }
        else {
            return { errorMessage: "Something went wrong." }
        }
    }
    catch (error) {
        return { errorMessage: error.message };
    } finally {
        await db.end();
    }

}

async function setLeagueAdmin(username, leagueID) {

    const db = await createConnection();

    const query = fs.readFileSync('./database/queries/setLeagueAdmin.sql', 'utf8')
    try {
        db.execute(query, [username, leagueID], (error, result, field) => {
            if (error) {
                console.log(error);
            }
        });

        db.unprepare(query);

    } catch (error) {
        console.log(error);
    } finally {
        await db.end();
    }
}


async function loginUser(request, response) {
    const { username, password } = request.body;

    //if username or password fields aren't filled
    if (Object.values(request.body).includes("") || Object.values(request.body).includes(null)) {
        response.status(400).json({ errorMessage: "All fields must be filled" });
    } else {
        //SHA-256 encryption
        const passwordHash = encryptPassword(password);
        const user = await validateUser(username, passwordHash);
        
        if (user.user_id) {

            //JSON Web Token will be used to authenticate users in frontend
            const token = createToken(user.league_id, user.user_id);
            const db = await createConnection();

            try {
                //get leagueName to add to UserContext in frontend
                const getLeagueByID = fs.readFileSync('./database/queries/getLeagueByID.sql', 'utf8');
                const [result] = await db.execute(getLeagueByID, [user.league_id], (error, result, field) => {
                    if (error) console.log(error);
                });
                const leagueName = result[0].league_name;
                //this information is kept in the UserContext that React uses throughout components in frontend
                const userContext = { leagueID: user.league_id, userID: user.user_id, leagueName: leagueName, username: user.username, userToken: token, message: "Successful login" };
                response.status(200).json(userContext);

            } catch (error) {
                response.status(400).json({ error: error, message: error.message });
            } finally {
                await db.end();
            }
        }
        else { response.status(400).json({ errorMessage: user.errorMessage }) }

    }

};

async function joinLeague(request, response) {

    const { leagueID, fname, lname, username, password, email, userType } = request.body;

    const db = await createConnection();

    //validate information (league_id, email, and strong password) first
    if (Object.values(request.body).includes("")) {
        response.status(400).json({ errorMessage: "empty-fields", message: "All fields must be filled" });
    }
    else if (!validator.isEmail(email)) {
        response.status(400).json({ errorMessage: "invalid-email", message: "Email is not valid." });
    }
    else if (!validator.isStrongPassword(password)) {
        response.status(400).json({ errorMessage: "invalid-password", message: "Password is not strong enough" });
    }
    else if (leagueID.length !== 6) {
        response.status(400).json({ errorMessage: "invalid-leagueID", message: "League ID invalid, must be 6 characters" });
    }

    else { //if information given is valid

        //get existing username and email info to make sure user doesn't already exist
        const getUsersQuery = fs.readFileSync('./database/queries/getEmailAndUsernames.sql', 'utf8');
        const [userResults] = await db.execute(getUsersQuery, [], (error, result, fields) => {
            if (error)
                console.log(error);
        });
        db.unprepare(getUsersQuery);

        //get league information to make sure league exists before adding user to the league
        const getLeaguesQuery = fs.readFileSync('./database/queries/getLeagues.sql', 'utf8');
        const [leagueResults] = await db.execute(getLeaguesQuery, [], (error, result, fields) => {
            if (error)
                console.log(error);
        });
        //compare what new user gave vs database
        if (userResults.some((element) => username === element.username || email === element.email)) {
            response.status(400).json({ errorMessage: "user-already-exists", message: "User already exists with this username and/or email" });
        }
        else if (!leagueResults.some((element) => leagueID === element.league_id)) {
            response.status(400).json({ errorMessage: "league-not-exist", message: "Invalid League ID, league does not exist" });
        }

        //if username/email is available and league exists
        else {

            const setQuery = fs.readFileSync('./database/queries/addUser.sql', 'utf8');
            const getLeagueByID = fs.readFileSync('./database/queries/getLeagueByID.sql', 'utf8');
            const values = [leagueID, fname, lname, username, encryptPassword(password), email, userType];
            try {
                const [result] = await db.execute(setQuery, values, (error, result, field) => {
                    if (error) console.log(error);
                });

                db.unprepare(setQuery);
                if (userType === 'admin') {
                    setLeagueAdmin(username, leagueID);
                }

                const [leagueResult] = await db.execute(getLeagueByID, [leagueID], (error, result, field) => {
                    if (error) console.log(error);
                });

                const leagueName = leagueResult.league_name;
                const userID = result.insertId;

                //JSON Web Token will be used to authenticate users in frontend
                const token = createToken(leagueID, userID);
                response.status(200).json({ leagueID: leagueID, userID: userID, leagueName: leagueName, username: username, userToken: token, message: 'User Successfully Joined!' });
            } catch (error) {
                response.status(400).json({ error: error, message: error.message });
            } finally {
                await db.end();
            }
        }
    }
};

async function createLeague(request, response) {

    const { leagueName } = request.body;
    if (leagueName !== null && leagueName !== "") {
        const db = await createConnection();

        //get league IDs to check if league already exists
        const getQuery = fs.readFileSync('./database/queries/getLeagues.sql', 'utf8');
        const [leagueResults] = await db.execute(getQuery, [], (error, result, fields) => {
            if (error)
                console.log(error);
        });

        db.unprepare(getQuery);


        if (leagueResults.some((element) => leagueName === element.league_name)) {
            response.status(400).json({ teamExists: true, message: "League already exists with this name" })
        } else {
            const setQuery = fs.readFileSync('./database/queries/addLeague.sql', 'utf8');

            let leagueID = generateLeagueCode(); //generates random 6-character code
            while (leagueResults.some((element) => leagueID === element.league_id)) //if the random code generated is already used in the database, generate a new one.
                leagueID = generateLeagueCode();

            try {
                const [result, fields] = await db.execute(setQuery, [leagueID, leagueName], (error) => {
                    if (error)
                        console.log(error);
                });
                db.unprepare(setQuery);


                response.status(200).json({ message: 'Created a League!', leagueID: leagueID, result: result });
            } catch (error) {
                res.status(400).json({ errorMessage: error });
            } finally {
                await db.end();
            }
        }
    } else {
        response.status(400).json({ errorMessage: "empty-fields", message: "All fields must be filled" });
    }

};

module.exports = { loginUser, joinLeague, createLeague };