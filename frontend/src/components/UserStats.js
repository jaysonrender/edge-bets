import {useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
// import {useTable} from 'react-table';
import axios from 'axios';


const UserStats = () => {
    const {leagueID, userID, userToken } = useUserContext();

    const [name, setName] = useState(null);
    const [score, setScore] = useState(null);
    const [rank, setRank] = useState(null);
    const [flexPicks, setFlexPicks] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            const url = `${process.env.REACT_APP_BACKEND}/api/pick/stats/${leagueID}/${userID}`;
            const {data} = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            setName(data.fullname);
            setScore(data.score);
            setRank(data.rank);
            setFlexPicks(data.flexPicks);
        }

        fetchUserStats();
    }, [leagueID, userID, userToken]);
    
  
 

    return (
        <div className='container userStatContainer'>

            <span><strong>Name: </strong>{name}</span>
            <span><strong>Score: </strong>{score}</span>
            <span><strong>Rank: </strong>{rank}</span>
            <span><strong>Flex Picks Remaining: </strong>{flexPicks}/4</span>

        </div>

    );
}

export default UserStats;