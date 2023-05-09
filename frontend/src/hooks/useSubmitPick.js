import { useState } from 'react';

import axios from 'axios';


export const useSubmitPick = () => {
    const [error, setError] = useState(null)

    const submitPick = async ({ userToken, userID, pickWeek, pick1, pick2, flexPickStatus }) => {
        
            const requestBody = { userID, pickWeek, pick1, pick2, flexPickStatus } ;

            await axios.post(`${process.env.REACT_APP_BACKEND}/api/pick/submitPick`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).then(response => setError(response.data.message))
                .catch((error) => {
                    setError(error.response.data.message);
                });

            //TODO: HANDLE FLEX PICKS
            //get users picks
            //if user already made pick, response has message/alert
            //do you want to use flex pick?
            //if yes
            //setFlexPickStatus(true)
            //resend post request
            //else
            //message: select other team
            //reset pick1 or pick2 (which ever pick triggered flex pick) 
        }

        return {submitPick, error}
    }

