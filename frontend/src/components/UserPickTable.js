import {useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
// import {useTable} from 'react-table';
import axios from 'axios';

const UserPickTable = () => {
    const [picks, setPicks] = useState(null);
    const {userID, userToken} = useUserContext();

    useEffect(() => {
        const fetchUserPicks = async () => {
            const url = `/api/pick/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            setPicks(data);
        }
        fetchUserPicks();
    }, [userID, userToken]);

    const UserPicksHeader = () => {
        return (
            <>
                    <th>Week</th>
                    <th>Pick #1</th>
                    <th className='table-score-column'>Score</th>
                    <th>Pick #2</th>
                    <th className='table-score-column'>Score</th>
                    <th className='table-total-column'>Week Total</th>
            </>
        )
    }

    const UserPickRows = () => {
        return picks.map((pick) => (
            <tr>
                <td>{pick.pick_week}</td>
                <td>{pick.pick1_name}</td>
                <td className='table-score-column'>{pick.pick1_score}</td>
                <td>{pick.pick2_name}</td>
                <td className='table-score-column'>{pick.pick2_score}</td>
                <td>{pick.week_total}</td>

            </tr>
        ));
    }

  
 

    return (
        <div className='container'>
            <table border='1' style={{'borderCollapse' : 'collapse'}} >
                <thead>
                   <tr>{picks && <UserPicksHeader />}</tr> 
                </thead>
                <tbody>
                    {picks && <UserPickRows />}
                </tbody>
            </table>
        </div>
    );
}

export default UserPickTable;