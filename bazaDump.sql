--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-10-25 22:35:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16680)
-- Name: recording; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recording (
    "timestamp" timestamp without time zone NOT NULL,
    value double precision NOT NULL,
    stationid integer NOT NULL,
    "interval" interval,
    CONSTRAINT notinfuture CHECK (("timestamp" <= CURRENT_TIMESTAMP)),
    CONSTRAINT valuenotnegative CHECK ((value >= (0)::double precision))
);


ALTER TABLE public.recording OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16675)
-- Name: station; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    elevation integer NOT NULL,
    datesetup timestamp without time zone,
    isactive boolean NOT NULL,
    isautomatic boolean NOT NULL,
    CONSTRAINT isproperdatesetup CHECK (((datesetup >= '1800-01-01 00:00:00'::timestamp without time zone) AND (datesetup <= CURRENT_TIMESTAMP))),
    CONSTRAINT isproperelevation CHECK (((elevation >= '-1000'::integer) AND (elevation <= 10000))),
    CONSTRAINT isproperlatitude CHECK (((latitude >= ('-90'::integer)::double precision) AND (latitude <= (90)::double precision))),
    CONSTRAINT isproperlongitude CHECK (((longitude >= ('-180'::integer)::double precision) AND (longitude <= (180)::double precision)))
);


ALTER TABLE public.station OWNER TO postgres;

--
-- TOC entry 4844 (class 0 OID 16680)
-- Dependencies: 216
-- Data for Name: recording; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recording ("timestamp", value, stationid, "interval") FROM stdin;
2024-09-29 23:59:59	0.3	1	7 days
2024-10-24 23:59:59	0	1	1 day
2024-10-25 08:00:00	0.1	2	1 day
2024-10-25 08:00:00	0.1	3	1 day
2024-10-25 08:00:00	0.2	4	1 day
2024-10-25 08:00:00	2.4	5	1 day
2024-10-25 08:00:00	4	6	1 day
2024-10-25 08:00:00	2.8	7	1 day
2024-10-25 08:00:00	5.9	8	1 day
2024-10-25 08:00:00	5	9	1 day
2024-10-25 08:00:00	8	10	1 day
\.


--
-- TOC entry 4843 (class 0 OID 16675)
-- Dependencies: 215
-- Data for Name: station; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.station (id, name, latitude, longitude, elevation, datesetup, isactive, isautomatic) FROM stdin;
1	OPG1	45.37969860588225	17.834454255068945	152	2021-12-22 00:00:00	t	f
2	Kutjevo	45.42333333	17.88083333	236	\N	t	t
3	Feričanci	45.51666667	17.95	127	\N	t	t
4	Pleternica	45.28861111	17.80138889	153	\N	t	t
5	Zagreb-aerodrom	45.72916667	16.05388889	106	\N	t	t
6	Pazin	45.24083333	13.94527778	291	\N	t	t
7	Šibenik	43.72805556	15.90638889	77	\N	t	t
8	Ogulin	45.26277778	15.22222222	328	\N	t	t
9	Mali Lošinj	44.5325	14.47194444	53	\N	t	t
10	Zavižan	44.81472222	14.97527778	1594	\N	t	t
\.


--
-- TOC entry 4698 (class 2606 OID 16679)
-- Name: station station_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station
    ADD CONSTRAINT station_pkey PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 16683)
-- Name: recording recording_stationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recording
    ADD CONSTRAINT recording_stationid_fkey FOREIGN KEY (stationid) REFERENCES public.station(id);


-- Completed on 2024-10-25 22:35:50

--
-- PostgreSQL database dump complete
--

