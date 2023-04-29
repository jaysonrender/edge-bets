SELECT game_id, home, t1.team_name as home_name, away, t2.team_name as away_name, game_time  FROM game_schedule
    JOIN teams t1 
        ON home = t1.alias
    JOIN teams t2
        ON away = t2.alias
    WHERE nfl_week = ? AND game_time > ?
    ORDER BY game_time;