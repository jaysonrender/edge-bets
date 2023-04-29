import {createContext, useReducer, useEffect } from 'react';


export const UserContext = createContext();

export const userReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN':
            return {leagueID: action.leagueID, userID: action.userID, leagueName:action.leagueName, username: action.username, userToken: action.userToken};
        case 'LOGOUT':
            return {leagueID: null, userID: null, leagueName: null, username: null, userToken: null};
        default:
            return state;
        }
}


export const UserContextProvider = ({children}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [state, dispatch] = useReducer(userReducer, user);

    useEffect(() => {
        
        if(!user)
        dispatch({type: 'LOGOUT'});    

    },[]);


    return (
        <UserContext.Provider value={{...state, dispatch}}>
            { children }
        </UserContext.Provider>
    )
}