import {useState} from 'react';
import {useUserContext} from './useUserContext';
import axios from 'axios';

export const useLogin = () => {
    const [error, setError] = useState(null);
    
    const {dispatch} = useUserContext();

    const login = async ({username, password}) => {
        
        const requestBody = {username, password};
        
        await axios.post(`${process.env.REACT_APP_BACKEND}/api/user/login`, requestBody).then(response => {
            
            if (response.status === 200){
                localStorage.setItem('user', JSON.stringify(response.data));
                
                //dispatch updates UserContext
                dispatch({type: 'LOGIN', leagueID: response.data.leagueID, userID: response.data.userID, leagueName: response.data.leagueName, username: response.data.username, userToken: response.data.userToken});
                setError(response.data.message);

                
            }
        }).catch((error) =>{
            setError(error.response.data.message)
        });
    }
    

    return {login, error}
} 