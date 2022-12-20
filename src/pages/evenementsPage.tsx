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
    const [zonesAvailable, setZonesAvailable] = useState<
        Zone[] | null | undefined
    >([]);
    const [enclosuresAvailable, setEnclosuresAvailable] = useState<
        Enclosure[] | null | undefined
    >([]);
    const [selectedZone, setSelectedZone] = useState<string>();
    const [selectedRange, setSelectedRange] = useState<number>();
    const [selectedEnclosure, setSelectedEnclosure] = useState<string>();

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
        setZonesAvailable(zones);
    }, [zones]);

    const { data: enclosures } = useQuery({
        queryKey: ["Enclosures", zones],
        queryFn: () => fetchEnclosuresByZone(employee?.zone),
        enabled: !!employee
    });

    useEffect(() => {
        setEnclosuresAvailable(enclosures);
        enclosures?.forEach((enclosure) => {
            console.log(enclosure._id);
        });
    }, [enclosures]);

    const { data: eventsByZone } = useQuery({
        queryKey: ["EventsByZone", employee],
        queryFn: () => getEventsByZone(employee?.zone),
        enabled: !!employee
    });

    // useEffect(() => {
    //     eventsByZone?.forEach((event) => {
    //         console.log(event.enclosure);
    //     });
    // }, [eventsByZone]);

    useEffect(() => {
        console.log(selectedZone);
    }, [selectedZone]);

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
                            return <option value={nb}>{nb}</option>;
                        })}
                    </select>
                    <select
                        name="Zones"
                        id="zones"
                        title="zones"
                        onChange={(choice) =>
                            setSelectedZone(choice.target.value)
                        }
                    >
                        {employee?.zone === "toutes"
                            ? zonesAvailable?.map((zone) => {
                                  return zone.name === "toutes" ? (
                                      <option
                                          key={zone._id}
                                          value={zone._id}
                                          selected
                                      >
                                          {zone.name}
                                      </option>
                                  ) : (
                                      <option key={zone._id} value={zone._id}>
                                          {zone.name}
                                      </option>
                                  );
                              })
                            : zonesAvailable?.map((zone) => {
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
                        onChange={(e) => setSelectedEnclosure(e.target.value)}
                    >
                        {enclosures?.map((enclosure) => {
                            return (
                                <option value={enclosure._id}>
                                    {enclosure.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <ul className="eventList">
                    {eventsByZone

                        ?.filter(
                            (event: IEvent) =>
                                event.enclosure === selectedEnclosure
                        )
                        .slice(0, selectedRange)
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
