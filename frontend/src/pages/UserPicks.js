import { useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import { useLogout } from '../hooks/useLogout'
// import {useTable} from 'react-table';
import axios from 'axios';
import UserPickTable from '../components/UserPickTable';
import UserStats from '../components/UserStats';
import RemainingPicks from '../components/RemainingPicks';

const UserPicks = () => {
    const [picks, setPicks] = useState(null);
    const { userID, userToken } = useUserContext();
    const { logout } = useLogout();

    useEffect(() => {
        const fetchUserPicks = async () => {
            const url = `/api/pick/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                if (error.response)
                    logout();
            });
            setPicks(data);
            console.log(data);
        }
        fetchUserPicks();
    }, [userID, userToken]);

    return (
        <div>
            <div className='container border'>
                <UserStats />
                
                <div className='row'>
                    <div className='col'>
                        <UserPickTable />
                    </div>
                    <div className='col'>
                        <RemainingPicks />
                    </div>
                </div>
            </div>


        </div>

    );
}

export default UserPicks;