import {useState, useEffect } from 'react';
import axios from 'axios';
import GameDetails from '../components/GameDetails';
import WeekOptions from '../components/WeekOptions';
import { useUserContext } from '../hooks/useUserContext';

const Games = () => {

    const [games, setGames] = useState(null);
    const [pickWeek, setPickWeek] = useState(1);
    
    const { userToken } = useUserContext();

    useEffect(() => {

        const fetchGames = async () => {
            const url = `${process.env.REACT_APP_BACKEND}/api/pick/games/${pickWeek}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            const data = response.data;
            
            setGames(data);  
        }

        fetchGames();
    }, [pickWeek, userToken]);

    return (
        <div className="container">
            <h1>Games</h1>
            <form id="week-select">
            
            <select id='pickWeek' name='Pick Week' onInput={(event) => {
                setPickWeek(event.target.value)
            }}>
                <option value={pickWeek}>NFL Week</option>
                <WeekOptions />
            </select>
            </form>
            
            <h3>Week {pickWeek} </h3>
            
            <div className='games'>
                {games && games.map((game) => (
                <GameDetails key={game.game_id} home={game.home} away={game.away} time= {game.game_time} />
                ))}
            </div>
        </div>
    )
}

export default Games;