import { useState, useEffect /*, useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import axios from 'axios';

// might use react-table for table building down the line but having trouble getting to work right now
// import { useTable } from 'react-table';


const Scoreboard = () => {
    const [scores, setScores] = useState(null);
    const { leagueID, userID, userToken } = useUserContext();
    
    const ScoreboardHeaders = () => {
      
        const lengths = scores.map(player => player.picks.length);
        const maxLength = Math.max(...lengths);
        let headers = [];
        headers.push((
            <>
                <th className='table-name-column'>Name</th>
                <th >Rank</th>
                <th className="table-name-column">Score</th>
                <th className='table-total-column'>Flex Picks</th>
            </>
            ));
        for (let i = 0; i < maxLength; i++){
            headers.push((
                <>
                    <th>Week</th>
                    <th>Pick #1</th>
                    <th>Score</th>
                    <th>Pick #2</th>
                    <th >Score</th>
                    <th className='table-total-column'>Week Total</th>
                </>
            ))
        }
        return headers;
    }
    

    const ScoreboardRows = () => {


        //name rank and score as usual
        //like headers find max length
        const lengths = scores.map(player => player.picks.length);
        const maxLength = Math.max(...lengths);
        let rows = scores.map((player) => {
            
            let row = [];
            row.push((
                <>
                    <td className='border-end border-2 border-black' style = {{"whiteSpace": "nowrap"}}>{player.fullname}</td>
                    <td className='border-end border-2 border-black'>{player.player_rank}</td>
                    <td className='border-end border-2 border-black'>{player.score}</td>
                    <td className='table-total-column'>{player.flex_picks}</td>
                </>
            ));


            //iterate through loop
            //add data from scores if pick_week === i+1 
            //else render null in that week.
            
            for (let i = 0; i < maxLength; i++) {

                //if pick exists for that week and is in the expected spot in the array
                if (player.picks[i] && player.picks[i].pick_week === i + 1) {
                    row.push(
                        <>
                            <td className='table-week-column'>{player.picks[i].pick_week}</td>
                            <td><strong>{player.picks[i].pick1}</strong></td>
                            <td className='table-score-column'>{player.picks[i].pick1_score}</td>
                            <td><strong>{player.picks[i].pick2}</strong></td>
                            <td className='table-score-column'>{player.picks[i].pick2_score}</td>
                            <td className='table-total-column'>{player.picks[i].week_total}</td>
                        </>
                    )
                //if pick exists for that week but is not in the expected spot in the array
                } else if(!player.picks[i] && player.picks.some((pick) => pick.pick_week === i + 1)){
                    const index = player.picks.findIndex((pick) => pick.pick_week === i + 1);

                    row.push(
                        <>
                            <td className='table-week-column'>{player.picks[index].pick_week}</td>
                            <td><strong>{player.picks[index].pick1}</strong></td>
                            <td className='table-score-column'>{player.picks[index].pick1_score}</td>
                            <td><strong>{player.picks[index].pick2}</strong></td>
                            <td className='table-score-column'>{player.picks[index].pick2_score}</td>
                            <td className='table-total-column'>{player.picks[index].week_total}</td>

                        </>
                    )
                //if no pick exists for that week
                } else {
                    row.push(
                        <>
                            <td className='table-week-column'>{i + 1}</td>
                            <td>{null}</td>
                            <td className='table-score-column'>{null}</td>
                            <td>{null}</td>
                            <td className='table-score-column'>{null}</td>
                            <td className='table-total-column'>{null}</td>
                        </>
                        
                    )
                }
            }
            //highlight users row in the table 
            if (player.user_id === userID){
                return (<tr className='table-success border-black'>{row}</tr>);
            }
            else{
                return (<tr key={player.user_id}>{row}</tr>);
            }
            

        })
        
        return rows;       
    }

    //useEffect is call right when this element renders
    useEffect(() => {
        const fetchScores = async () => {
            const url = `/api/pick/scoreboard/${leagueID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            setScores(data);
        }

        fetchScores();
        
        
    }, [leagueID, userToken]);

    return (
        <div className='overflow-auto ' >   
        
        <table className='table table-hover' border='1' style={{'borderCollapse' : 'collapse'}} >
                <thead>
                    <tr>
                        {scores && <ScoreboardHeaders /> }
                    </tr>
                </thead>
                <tbody>
                    {scores && <ScoreboardRows />}
                    
                </tbody>
            </table>
        </div>

        
    );


}

export default Scoreboard;