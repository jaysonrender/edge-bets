const Rules = () => {
    return (
        <div className="modal " id='rules'>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content text-bg-light">
                    <div className="modal-header">
                        <h2>NFL Pick Em Rules</h2>
                        <button className='btn-close' data-bs-dismiss='modal' data-bs-target='#rules' />

                    </div>
                    <div className="modal-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">You pick two separate NFL teams every week</li>
                            <li className="list-group-item">The teams cannot play each other that week</li>
                            <li className="list-group-item">You must pick every team once throughout the season. (You’ll have <strong>4</strong> duplicate picks you can pick anytime throughout the season) </li>
                            <li className="list-group-item">If your pick wins, you gain the difference in points by how much they won by (i.e. final score is 14 to 7 the difference is 7 which is added to your overall score)</li>
                            <li className="list-group-item">If your pick loses, you lose the difference in points by how much they lost by (i.e. final score is 3 to 7 the difference is -4 which is deducted from your overall score) </li>
                            <li className="list-group-item">Season rankings at the end of the season determines winners and payouts</li>
                            <li className="list-group-item">Picks are due before the first snap of every Sunday. Any games beforehand (Thursday Night) must be chosen before the snap of that game </li>
                            <li className="list-group-item">MISSED PICKS: If picks are not submitted before the start of the first game on Sunday then missing pick will be chosen alphabetically and be given a zero for that week. You can respond afterwards and choose the afternoon, late or MNF game if possible. If some reason I mistakenly allow a duplicate pick and no flex picks are available, the pick is removed and an alphabetical pick occurs and awarded 0 points. (Recommendation: this is not a good strategy to try and schedule around, this will only hurt you in the long run)
                            </li>

                        </ul>

                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Rules;