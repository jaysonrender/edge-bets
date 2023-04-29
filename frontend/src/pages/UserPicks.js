import {useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
// import {useTable} from 'react-table';
// import axios from 'axios';
import UserPickTable from '../components/UserPickTable';
import UserStats from '../components/UserStats';

const UserPicks = () => {

    return (
        <div>
            <UserStats />
            <UserPickTable />
        </div>
        
    );
}

export default UserPicks;