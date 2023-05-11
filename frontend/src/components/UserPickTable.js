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
                    <th >Score</th>
                    <th>Pick #2</th>
                    <th >Score</th>
                    <th >Week Total</th>
            </>
        )
    }

    const UserPickRows = () => {
        return picks.map((pick) => (
            <tr>
                <td>{pick.pick_week}</td>
                <td>{pick.pick1_name}</td>
                <td >{pick.pick1_score}</td>
                <td>{pick.pick2_name}</td>
                <td >{pick.pick2_score}</td>
                <td>{pick.week_total}</td>

            </tr>
        ));
    }

  
 

    return (
        <div className='container'>
            <table className='table table-borderless' >
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