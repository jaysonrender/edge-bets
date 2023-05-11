//Form for creating a league
//Once league is created renders a SignupForm component

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import SignupForm from './SignupForm';



const LeagueForm = () => {

    const [leagueName, setLeagueName] = useState(null);
    const [leagueID, setLeagueID] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestBody = { leagueName };

        await axios.post(`/api/user/create-league`, requestBody).then(response => {
            if (response.status === 200) {
                setLeagueID(response.data.leagueID);
                setError(null);
            }
            else {
                setError(response.data.message)
            }
        }

        ).catch(error => {

            setError(error.response.data.message)
            console.log(error);
        });

        

    }
    const navigateLogin = () => {
        navigate('/');
    }

    const navigateSignUp = () => {
        navigate('/signup');
    }

    return (

        <div className="container" >

            <h3>Create a Pick 'Em League</h3>
            <div className="container border rounded-2" style={{ "padding": "10px" }} >
                {!leagueID &&
                    <form className="leagueForm" onSubmit={handleSubmit}>
                        <label>Enter a name for your league</label>
                        <div className='row'>
                            <div className='col'>

                                <input type="text" className='form-control' onChange={(event) => setLeagueName(event.target.value)}></input>
                            </div>
                        </div>
                        {error && <div>{error}</div>}
                        <br />
                        <div className='row'>
                            <div className='col'>
                                <button type="submit" className='btn btn-primary text-nowrap'>Create League</button>
                            </div>
                            <div className='col'>
                                <button type="button" className='btn btn-outline-primary text-nowrap' onClick={navigateLogin}>Login</button>
                            </div>
                            <div className='col'>
                                <button type="button" className='btn btn-outline-primary text-nowrap' onClick={navigateSignUp}>Sign Up</button>
                            </div>

                        </div>

                    </form>
                }



                

                {/*if league is successfully created display League ID and how to share */}
                {leagueID &&
                    <div className="createLeagueResponse">
                        <h3>
                            Congratulations! Your league, "{leagueName}", has been created!</h3>
                        <h4>Your league code is {leagueID}.</h4>
                        <h4>Use this code to invite others to join your league!</h4>
                        <br />
                        <h4>Now we just need your information:</h4>
                        <br />
                    </div>
                }
                {/*if league is successfully created render the SignUpForm */}
                {leagueID &&
                    <SignupForm leagueID={leagueID} userType="admin" newLeague={true} />
                    
                }

            </div>

        </div>

    )
}

export default LeagueForm;