const WeekOptions = () => {
    let options = [];
    for(let i = 1; i < 19; i++){
        options.push(
            (<option key={"week" + i} value={i}>Week {i}</option>)
        )
    }

    return options;
}

export default WeekOptions;