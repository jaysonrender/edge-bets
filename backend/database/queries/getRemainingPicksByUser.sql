SELECT * from teams 
	WHERE alias NOT IN (
		SELECT pick1 from pick_list
			WHERE user_id = ?
		UNION
		SELECT pick2 from pick_list
			WHERE user_id = ?);