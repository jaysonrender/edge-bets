import { useUserContext } from "./useUserContext";

export const useLogout = () => {
    //get dispatch function to change UserContext state
    const {dispatch} = useUserContext();

    const logout = () => {
        //remove user token from local storage
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'})

    }
    
    return {logout};
}