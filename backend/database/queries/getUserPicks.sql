SELECT p.pick_week, p.pick1, t1.team_name as pick1_name, s1.score as pick1_score, p.pick2, t2.team_name as pick2_name, s2.score as pick2_score, (s1.score + s2.score) as week_total FROM users u
	LEFT JOIN pick_list p
		ON p.user_id = u.user_id
	LEFT JOIN teams t1
		ON p.pick1 = t1.alias
	LEFT JOIN scores s1
		ON p.pick1 = s1.team_alias AND p.pick_week = s1.nfl_week
	LEFT JOIN teams t2
		ON p.pick2 = t2.alias
	LEFT JOIN scores s2
		ON p.pick2 = s2.team_alias AND p.pick_week = s2.nfl_week
	WHERE u.user_id = ?
	ORDER BY p.pick_week;