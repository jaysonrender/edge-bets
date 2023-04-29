import {useState, useEffect} from 'react';
import axios from 'axios';
import getCurrentWeek from '../util/getCurrentWeek';
import WeekOptions from './WeekOptions';
import { useUserContext } from '../hooks/useUserContext';



const PickForm = () => {
    //const [userID, setUserID] = useState(1); //TODO: use user context
    const [pickWeek, setPickWeek] = useState(1); //TODO: reset to getCurrentWeek() at start of season;
    const [pick1, setPick1] = useState(null);
    const [pick2, setPick2] = useState(null);
    const [games, setGames] = useState(null);
    const [flexPickStatus, setFlexPickStatus] = useState(false);
    const [response, setResponse] = useState(null);

    const {userID, userToken} = useUserContext();

    function isSameGame(pick1, pick2){
        for(const game of games){
            if ((pick1 === game.home && pick2 === game.away) ||
                (pick2 === game.home && pick1 === game.away))
    
                return true;
        }

        return false;
    }

    const handleSumbit = async (e) => {
        e.preventDefault();


        if (isSameGame(pick1, pick2)) {
            setResponse('You cannot pick two teams that are playing against each other')
        }
        else {
            const picks = { userID, pickWeek, pick1, pick2, flexPickStatus };

            await axios.post('/api/pick/submitPick', picks, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).then(response => setResponse(response.data.message))
                .catch((error) => {
                    setResponse(error.response.data.message);
                });
            
                //
            //get users picks
            //if user already made pick, response has message/alert
            //do you want to use flex pick?
            //if yes
            //setFlexPickStatus(true)
            //resend post request
            //else
            //message: select other team
            //reset pick1 or pick2 (which ever is illegal pick) 
        }
    }

    useEffect(() => {
        const fetchGames = async () => {
            
            const url = `/api/pick/games/${pickWeek}`;
            const response = await axios.get(url,{
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) =>{
                console.log(error);
            });
            const data = response.data;
            
            setGames(data);  
        }
        
        
        fetchGames();
    }, [pickWeek, userToken]);

    return (
        <div className="container pickFormContainer">
        <form className='pickForm' onSubmit={handleSumbit}>
            <h3>Submit A Pick</h3>
            <label>Week</label>
            <select id='pickWeek' name='Pick Week' onInput={(event) => {
                setPickWeek(event.target.value)
            }}>
                <option key={pickWeek} value={pickWeek}>NFL Week</option>
                <WeekOptions />

            </select>
            <label>Pick 1</label>
            <select id='pick1' name='Pick 1' onInput={(event) => { 
                        setPick1(event.target.value);}
                        }>
                <option key="pick1" value="">Pick 1</option>
                {games && games.map((game) => (
                    <>
                    <option key={game.home} value={game.home} >{game.home} - {game.home_name}</option>
                    <option key={game.away} value={game.away} >{game.away} - {game.away_name}</option>
                    </>
                ))}
            </select>
            <label>Pick 2</label>
            <select id='pick2' title='Pick 2' name='Pick 2' onInput={(event) => setPick2(event.target.value)}>
                <option key="pick2" value="">Pick 2</option>
                {games && games.map((game) => (
                    <>
                    <option key={game.home} value={game.home} >{game.home} - {game.home_name} </option>
                    <option key={game.away} value={game.away} >{game.away} - {game.away_name}</option>
                    </>
                ))}
            </select>
            <button type='submit'>Submit Pick</button>
        </form>
        {response && <div>{response}</div>}
        </div>
    )
}

export default PickForm;