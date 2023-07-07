import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import getCurrentWeek from '../util/getCurrentWeek';
import WeekOptions from './WeekOptions';
import { useUserContext } from '../hooks/useUserContext';
import { useSubmitPick } from '../hooks/useSubmitPick';



const PickForm = () => {
    
    const [pickWeek, setPickWeek] = useState(null); //TODO: reset to getCurrentWeek() at start of season;
    const [pick1, setPick1] = useState(null);
    const [pick2, setPick2] = useState(null);
    const [games, setGames] = useState(null);
    const [flexPickStatus, setFlexPickStatus] = useState(0);
    const [flexPicksRemaining, setRemainingFlex] = useState(null);
    const [showFlexWarning, setShow] = useState(false);

    const { submitPick, error, setError } = useSubmitPick();
    const { leagueID, userID, userToken } = useUserContext();

    const FlexWarningModal = (props) => {
        return (
            <Modal
                {...props}
                id="flexWarningModal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{flexPickStatus ? "Flex Pick Warning" : "Review Picks"}</Modal.Title>
                </Modal.Header>
                <WarningModalBody />
            </Modal>
        )
    }
    
    const WarningModalBody = () => {
        if (flexPicksRemaining === 0 && flexPickStatus > 0) {
            return (
                <>
                    <Modal.Body>
                        This pick contains a team you have already picked before. You do not have any flex picks remaining. Please choose different team(s) for your pick.
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' onClick={resetPicks}>Reset Picks</button>
                    </Modal.Footer>
                </>
            )
        }
        else if (flexPicksRemaining < flexPickStatus) {
            return (
                <>
                    <Modal.Body>
                        This pick contains a team you have already picked before. You do not have enough flex picks remaining to pick these. Please choose different team(s) for your pick.
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' data-bs-dismiss="modal" onClick={resetPicks}>Reset Picks</button>
                    </Modal.Footer>
                </>
            )
        } else if (flexPickStatus >= 1) {
            return (
                <>
                    <Modal.Body>
                        Warning! This pick contains a team you have already picked before. Submitting this pick will require the use of <strong>{flexPickStatus}</strong> flex pick(s).
                        You currently have <strong>{flexPicksRemaining}</strong> remaining. Do you wish to continue?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' data-bs-dismiss="modal" onClick={resetPicks}>Reset Picks</button>
                        <button className='btn btn-primary' data-bs-dismiss="modal" onClick={handleSubmit}>Use Flex Pick</button>

                    </Modal.Footer>
                </>
            )
        } else {
            return (
                <>
                    <Modal.Body>
                        You picked <strong>{pick1}</strong> and <strong>{pick2}</strong> as your two picks for Week {pickWeek}. <br /> Are you sure?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' data-bs-dismiss="modal" onClick={resetPicks}>Reset Picks</button>
                        <button className='btn btn-primary' data-bs-dismiss="modal" onClick={handleSubmit}>Submit Pick</button>
                    </Modal.Footer>
                </>
            )
        }
    }


    const handlePicks = async (e) => {
        e.preventDefault();
        if (pick1 == null || pick2 == null) {
            setError("You must pick two teams");
        }
        else if (isSameGame(pick1, pick2)) {
            setError('You cannot pick two teams that are playing against each other');
        }
        else if (pick1 === pick2) {
            setError('You must pick two seperate teams');
        }
        else {
            const duplicates = await findDuplicatePick();
            setFlexPickStatus(duplicates);
            setShow(true);
        }
    }

    async function findDuplicatePick() {

        const url = `/api/pick/${userID}`;
        const { data } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        let count = 0;


        if (data.some(pick => Object.values(pick).includes(pick1))) {
            count++;
        }

        if (data.some(pick => Object.values(pick).includes(pick2))) {
            count++;
        }

        return count;
        // if(data.some(pick => Object.values(pick).includes(pick1) ||
        //                      Object.values(pick).includes(pick2))){
        //     return 2;

        // }
        // return false;
    }
    function isSameGame(pick1, pick2) {
        for (const game of games) {
            if ((pick1 === game.home && pick2 === game.away) ||
                (pick2 === game.home && pick1 === game.away))

                return true;
        }

        return false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitPick({ userToken, userID, pickWeek, pick1, pick2, flexPickStatus });
        setShow(false);

    }

    const resetPicks = () => {
        document.getElementById('pickForm').reset();
        setPick1(null);
        setPick2(null);
        setFlexPickStatus(0);
        setShow(false);
    }

    useEffect(() => {
        const fetchGames = async () => {

            const url = `/api/pick/games/${pickWeek}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                console.log(error);
            });
            const data = response.data;

            setGames(data);
        }

        const getRemainingFlexPicks = async () => {
            const url = `/api/pick/stats/${leagueID}/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                console.log(error);
            });

            setRemainingFlex(data.flexPicks);
        }

        fetchGames();
        getRemainingFlexPicks();

    }, [pickWeek, userToken, userID, leagueID]);

    return (
        < >
            <div className="container pickFormContainer">
                <form className='pickForm' id="pickForm" >
                    <h3>Submit A Pick</h3>
                    <label>Week</label>
                    <select id='pickWeek' name='Pick Week' onInput={(event) => {
                        setPickWeek(event.target.value)
                    }}>
                        <option key={pickWeek} value={pickWeek}>NFL Week</option>
                        <WeekOptions />

                    </select>
                    <br />
                    <label>Pick 1</label>
                    <select id='pick1' name='Pick 1' onInput={(event) => {
                        setPick1(event.target.value);
                        console.log(event.target.value + " | " + pick1);

                    }
                    }>
                        <option key="pick1" value="">Pick 1</option>
                        {games && games.map((game) => (
                            <>
                                <option key={game.home} value={game.home} >{game.home} - {game.home_name}</option>
                                <option key={game.away} value={game.away} >{game.away} - {game.away_name}</option>
                            </>
                        ))}
                    </select>
                    <br />
                    <label>Pick 2</label>
                    <select id='pick2' title='Pick 2' name='Pick 2' onInput={(event) => {
                        setPick2(event.target.value);

                    }
                    }>
                        <option key="pick2" value="">Pick 2</option>
                        {games && games.map((game) => (
                            <>
                                <option key={game.home} value={game.home} >{game.home} - {game.home_name} </option>
                                <option key={game.away} value={game.away} >{game.away} - {game.away_name}</option>
                            </>
                        ))}
                    </select>
                    <br />
                    <button type='button' onClick={handlePicks}>Submit Pick</button>
                </form>
                {error && <div>{error}</div>}


            </div>
            <button onClick={handlePicks}>TEST</button>
            <FlexWarningModal show={showFlexWarning} onHide={() => setShow(false)} />
        </>
    )
}

export default PickForm;