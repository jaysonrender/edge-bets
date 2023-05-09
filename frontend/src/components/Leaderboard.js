import { useState, useEffect } from "react";
import axios from 'axios';

import { useUserContext } from "../hooks/useUserContext";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    const { leagueID, userToken } = useUserContext();


    useEffect(() => {
        const fetchLeaders = async () => {
            const url = `${process.env.REACT_APP_BACKEND}/api/pick/leagueLeaders/${leagueID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            
            setLeaders(data);
        }

        fetchLeaders();
        
    }, [leagueID, userToken]);

    return (
        <div className="container">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaders && leaders.map((leader) => {
                        return (
                            
                            <tr key={leader.user_id}>
                                <td>{leader.player_rank}</td>
                                <td>{leader.fname + " " + leader.lname}</td>
                                <td>{leader.score}</td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
            
        </div>
    )
}

export default Leaderboard;