/*
INSERT INTO station
VALUES(1, 'OPG1', 45.37969860, 17.83445425, 152, DATE '2021-12-22', true, false);
*/

/*
INSERT INTO recording
VALUES(TIMESTAMP '2024-10-24:23:59:59', 0, 1, INTERVAL '1 day');
*/

/*
INSERT INTO station
VALUES(10, 'Zavižan', 44.81472222, 14.97527778, 1594, NULL, true, true);

INSERT INTO recording
VALUES(TIMESTAMP '2024-10-25:08:00:00' , 8.0, 10, INTERVAL '1 day');
*/

/*
COPY (SELECT * FROM station JOIN recording ON ID=recording.stationID) To 'D:\FER\5.sem\OtvRac\OR-lab.csv'
	With CSV DELIMITER ',' HEADER;
*/

/*
SELECT station.*, json_agg(json_build_object(
	'timestamp', recording.timestamp, 'value', recording.value, 'interval', recording.interval
	)) AS recordings
	FROM station JOIN recording 
		ON station.ID = recording.stationID
	GROUP BY station.id
*/

/*
COPY (
	SELECT json_agg(row_to_json(myRows)) FROM
		(SELECT station.*, json_agg(json_build_object(
	'timestamp', recording.timestamp, 'value', recording.value, 'interval', recording.interval
	)) AS recordings
	FROM station JOIN recording 
		ON station.ID = recording.stationID
	GROUP BY station.id
			ORDER BY station.id) AS myRows
) to 'D:\FER\5.sem\OtvRac\OR-lab.json';
*/

--ALTER TABLE station
--	ADD CONSTRAINT isProperDateSetUp CHECK (DateSetUp >= TIMESTAMP '1800-01-01' AND DateSetUp <= CURRENT_TIMESTAMP);

--SELECT * FROM station JOIN recording ON station.ID = stationID

















