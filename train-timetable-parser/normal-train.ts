import { parseVerticalTableTextWithHeaders } from "./utils.ts";

const raw_호남선 = {
    departure:
        `광주	서대전	용산	용산	부전	용산	용산	용산	용산	서대전	용산	용산	익산	용산	익산	용산	용산	서대전	용산	용산	용산	용산
光 州	西大田	龍 山	龍 山	釜 田	龍 山	龍 山	龍 山	龍 山	西大田	龍 山	龍 山	益 山	龍 山	益 山	龍 山	龍 山	西大田	龍 山	龍 山	龍 山	龍 山
Gwangju	Seodaejeon	Yongsan	Yongsan	Bujeon	Yongsan	Yongsan	Yongsan	Yongsan	Seodaejeon	Yongsan	Yongsan	Iksan	Yongsan	Iksan	Yongsan	Yongsan	Seodaejeon	Yongsan	Yongsan	Yongsan	Yongsan
06:43	06:13	06:25	07:34	06:16	08:44	09:47	09:56	09:56	12:56	12:07	13:34	16:40	15:14	18:35	16:15	17:18	19:35	18:10	19:11	20:03	21:22
무궁화	무궁화	무궁화	무궁화	무궁화	ITX-새마을	ITX-마음	ITX-마음	ITX-마음	무궁화	ITX-새마을	ITX-새마을	무궁화	ITX-새마을	무궁화	무궁화	ITX-마음	무궁화	무궁화	ITX-새마을	ITX-새마을	무궁화
1981	1461	1421	1401	1951	1071	1161	1141	9941	1463	1061	1073	1473	1075	1469	1423	1163	1465	1403	1063	1077	1443`,
    arrival:
        `목포	광주	광주	목포	목포	광주	목포	익산	익산	광주	목포	광주	목포	광주	목포	광주	목포	광주	목포	목포	광주	익산
木 浦	光 州	光 州	木 浦	木 浦	光 州	木 浦	益 山	益 山	光 州	木 浦	光 州	木 浦	光 州	木 浦	光 州	木 浦	光 州	木 浦	木 浦	光 州	益 山
Mokpo	Gwangju	Gwangju	Mokpo	Mokpo	Gwangju	Mokpo	Iksan	Iksan	Gwangju	Mokpo	Gwangju	Mokpo	Gwangju	Mokpo	Gwangju	Mokpo	Gwangju	Mokpo	Mokpo	Gwangju	Iksan
08:04	08:44	11:07	12:48	12:59	12:45	14:12	12:54	12:54	15:33	16:56	17:45	18:47	19:29	20:44	20:57	21:38	21:59	23:30	23:55	00:08	00:38`,
};

const raw_전라선 = {
    departure:
        `익산	익산	용산	용산	용산	용산	익산	용산	익산	용산	용산	익산	익산	용산
益 山	益 山	龍 山	龍 山	龍 山	龍 山	益 山	龍 山	益 山	龍 山	龍 山	益 山	益 山	龍 山
Iksan	Iksan	Yongsan	Yongsan	Yongsan	Yongsan	Iksan	Yongsan	Iksan	Yongsan	Yongsan	Iksan	Iksan	Yongsan
06:43	07:34	05:44	07:14	09:47	09:38	15:40	15:04	18:55	16:38	17:18	20:25	21:13	19:15
무궁화	무궁화	무궁화	ITX-새마을	ITX-마음	무궁화	무궁화	무궁화	무궁화	ITX-새마을	ITX-마음	무궁화	무궁화	무궁화
1531	1533	1501	1081	1181	1503	1535	1505	1537	1083	1183	1539	1541	1507`,
    arrival:
        `여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포	여수엑스포
麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo	麗水Expo
Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo	Yeosu-Expo
08:41	09:32	11:05	11:56	14:26	15:13	17:43	20:20	21:01	21:22	21:43	22:32	23:26	00:26`,
};

function parseTimeTable(rawDepartureData: string, rawArrivalData: string) {
    const departureHeader = [
        "departureStation",
        null,
        null,
        "departureTime",
        "trainName",
        "trainNumber",
    ] as const;
    const arrivalHeaders = [
        "arrivalStation",
        null,
        null,
        "arrivalTime",
    ] as const;

    const departures = parseVerticalTableTextWithHeaders(
        rawDepartureData,
        departureHeader,
    );
    const arrivals = parseVerticalTableTextWithHeaders(
        rawArrivalData,
        arrivalHeaders,
    );

    return departures.map((departure, i) => ({
        departure: {
            station: departure.departureStation,
            time: departure.departureTime,
        },
        arrival: {
            station: arrivals[i].arrivalStation,
            time: arrivals[i].arrivalTime,
        },
        trainName: departure.trainName,
        trainNumber: departure.trainNumber,
    }));
}

const 호남선_timetable = parseTimeTable(
    raw_호남선.departure,
    raw_호남선.arrival,
).map((train) => ({
    ...train,
    mainline: "호남선",
}));

const 전라선_timetable = parseTimeTable(
    raw_전라선.departure,
    raw_전라선.arrival,
).map((train) => ({
    ...train,
    mainline: "전라선",
}));

const 호남선_경유_전라선 = 전라선_timetable.filter((train) =>
    train.departure.station === "용산"
);

const fullTimetable = [
    ...호남선_timetable,
    ...호남선_경유_전라선,
].map((train) => ({
    ...train,
    runningDay: [1, 2, 3, 4, 5, 6, 7],
}));

await Deno.writeTextFile(
    "../src/service/train-timetable/korail-normal-train.json",
    JSON.stringify(fullTimetable, null, 2),
);
