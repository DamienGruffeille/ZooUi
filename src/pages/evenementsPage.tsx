import { useEffect, useState } from "react";
import Header from "../components/Header";
import Employee from "../interfaces/employee";
import IEvent from "../interfaces/event";
import Zone from "../interfaces/zone";
import { getEventsByZone } from "../fetchers/getEvents";
import { useQuery } from "@tanstack/react-query";
import { getAllZones } from "../fetchers/zones";
import { fetchEnclosuresByZone } from "../fetchers/enclosures";
import Enclosure from "../interfaces/enclosures";

const EvenementsPage = () => {
    /** Récupération des zones de l'employé */
    const employeeLocalStorage = localStorage.getItem("employee");
    const nbResultats = [50, 30, 25, 20, 15, 10, 5, 1];
    const [employee, setEmployee] = useState<Employee>();

    const [zonesList, setZonesList] = useState<Zone[] | null | undefined>([]);
    const [selectedZone, setSelectedZone] = useState<string>();

    const [enclosuresList, setEnclosuresList] = useState([
        { _id: "tous", name: "Tous" }
    ]);
    const [selectedEnclosure, setSelectedEnclosure] = useState<string>();

    const [selectedRange, setSelectedRange] = useState<number>();

    const [eventsToDisplay, setEventsToDisplay] = useState<IEvent[]>([]);

    useEffect(() => {
        if (employeeLocalStorage) {
            setEmployee(JSON.parse(employeeLocalStorage));
        }
    }, [employeeLocalStorage]);

    const { data: zones } = useQuery({
        queryKey: ["Zones"],
        queryFn: () => getAllZones()
        // enabled: employee?.zone === "toutes"
    });

    useEffect(() => {
        setZonesList(zones);
        setSelectedZone(employee?.zone);
    }, [zones, employee]);

    const { data: enclosures } = useQuery({
        queryKey: ["Enclosures", zones],
        queryFn: () => fetchEnclosuresByZone(employee?.zone),
        enabled: !!employee
    });

    const { data: eventsByZone } = useQuery({
        queryKey: ["EventsByZone", employee],
        queryFn: () => getEventsByZone(employee?.zone),
        enabled: !!employee
    });

    const handleZoneChange = (e: any) => {
        console.log("Changement de zone");
        setSelectedZone(e.target.value);
        setEnclosuresList([{ _id: "tous", name: "Tous" }]);
        setEventsToDisplay([]);
    };

    useEffect(() => {
        console.log(selectedZone);
        if (selectedZone === "toutes") {
            enclosures?.map((enclosure: Enclosure) =>
                setEnclosuresList((prev) => [
                    ...prev,
                    { _id: enclosure._id, name: enclosure.name }
                ])
            );
            if (eventsByZone) {
                setEventsToDisplay(eventsByZone);
            }
        } else {
            let enclos: string[] = [];
            enclosures
                ?.filter(
                    (enclosure: Enclosure) => enclosure.zone === selectedZone
                )
                .map((enclosure: Enclosure) => {
                    enclos.push(enclosure._id);
                    setEnclosuresList((prev) => [
                        ...prev,
                        { _id: enclosure._id, name: enclosure.name }
                    ]);
                });
            eventsByZone
                ?.filter((event: IEvent) => enclos.includes(event.enclosure))
                .map((event: IEvent) => {
                    setEventsToDisplay((prev) => [...prev, event]);
                });
        }
    }, [selectedZone, enclosures, eventsByZone]);

    const handleEnclosureChange = (e: any) => {
        console.log("Changement d'enclos");
        setSelectedEnclosure(e.target.value);
        setEventsToDisplay([]);
    };

    useEffect(() => {
        if (selectedEnclosure === "tous") {
            let enclos: string[] = [];
            enclosuresList.forEach((enclosure) => {
                if (enclosure._id !== "tous") {
                    enclos.push(enclosure._id);
                }
            });
            eventsByZone
                ?.filter((event: IEvent) => enclos.includes(event.enclosure))
                .map((event: IEvent) =>
                    setEventsToDisplay((prev) => [...prev, event])
                );
        } else {
            eventsByZone
                ?.filter(
                    (event: IEvent) => event.enclosure === selectedEnclosure
                )
                .map((event: IEvent) =>
                    setEventsToDisplay((prev) => [...prev, event])
                );
        }
    }, [selectedEnclosure, eventsByZone]);

    return (
        <>
            <Header />
            <main>
                <div>
                    <h4>Filtres</h4>
                    <select
                        name="nbResultats"
                        id="resultats"
                        title="nbResultats"
                        onChange={(choice) =>
                            setSelectedRange(+choice.target.value)
                        }
                    >
                        {nbResultats.map((nb) => {
                            return (
                                <option value={nb} key={nb}>
                                    {nb}
                                </option>
                            );
                        })}
                    </select>
                    <select
                        name="Zones"
                        id="zones"
                        title="zones"
                        value={selectedZone}
                        onChange={(e) => handleZoneChange(e)}
                    >
                        {employee?.zone === "toutes"
                            ? zonesList?.map((zone) => {
                                  return (
                                      <option key={zone._id} value={zone._id}>
                                          {zone.name}
                                      </option>
                                  );
                              })
                            : zonesList?.map((zone) => {
                                  return zone._id === employee?.zone ? (
                                      <option key={zone._id} value={zone._id}>
                                          {zone.name}
                                      </option>
                                  ) : null;
                              })}
                    </select>
                    <select
                        name="Enclos"
                        id="enclos"
                        title="enclos"
                        onChange={(e) => handleEnclosureChange(e)}
                    >
                        {enclosuresList?.map((enclosure) => {
                            return (
                                <option
                                    value={enclosure._id}
                                    key={enclosure._id}
                                >
                                    {enclosure.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <ul className="eventList">
                    {eventsToDisplay

                        // ?.filter(
                        //     (event: IEvent) =>
                        //         event.enclosure === selectedEnclosure
                        // )
                        ?.slice(0, selectedRange)
                        .map((event: IEvent) => {
                            return (
                                <li
                                    key={event._id}
                                    className="eventList__event"
                                >
                                    <span>Enclos : {event.enclosure}</span>
                                    <br />
                                    <span>Espèce : {event.specie}</span>
                                    <br />
                                    <span>
                                        Type d'évènement : {event.eventType}
                                    </span>
                                    <br />
                                    <div>
                                        Animaux :{" "}
                                        {event.animal.map((animal) => {
                                            return animal + " ";
                                        })}
                                    </div>
                                    <br />
                                    <span>
                                        Créé le :{" "}
                                        {new Intl.DateTimeFormat("fr-FR", {
                                            dateStyle: "medium",
                                            timeStyle: "medium",
                                            timeZone: "Europe/Paris"
                                        }).format(
                                            Date.parse(event.createdAt)
                                        )}{" "}
                                        par {event.createdBy}
                                    </span>
                                </li>
                            );
                        })}
                </ul>
            </main>
        </>
    );
};

export default EvenementsPage;
