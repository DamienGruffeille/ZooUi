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
import { fetchSpeciesByZone } from "../fetchers/species";
import Specie from "../interfaces/specie";

const EvenementsPage = () => {
    /** Récupération des zones de l'employé */
    const employeeLocalStorage = localStorage.getItem("employee");
    const nbResultats = [50, 30, 25, 20, 15, 10, 5, 1];
    const [employee, setEmployee] = useState<Employee>();

    const [zonesList, setZonesList] = useState<Zone[] | null | undefined>([]);
    const [selectedZone, setSelectedZone] = useState<string>();

    const [enclosuresList, setEnclosuresList] = useState([
        { _id: "tous", name: "Tous les enclos" }
    ]);
    const [selectedEnclosure, setSelectedEnclosure] = useState<string>();

    const [speciesList, setSpeciesList] = useState([
        {
            _id: "toutes",
            name: "Toutes les espèces"
        }
    ]);
    const [selectedSpecy, setSelectedSpecy] = useState<string>();

    const [selectedRange, setSelectedRange] = useState<number>();

    const [eventsToDisplay, setEventsToDisplay] = useState<IEvent[]>([]);

    useEffect(() => {
        if (employeeLocalStorage) {
            setEmployee(JSON.parse(employeeLocalStorage));
        }
    }, [employeeLocalStorage]);

    /** Fetch toutes les zones du zoo */
    const { data: zones } = useQuery({
        queryKey: ["Zones"],
        queryFn: () => getAllZones()
        // enabled: employee?.zone === "toutes"
    });

    /** Insère les zones dans le menu déroulant zones et sélectionne la zone de l'employé par défaut */
    useEffect(() => {
        setZonesList(zones);
        setSelectedZone(employee?.zone);
    }, [zones, employee]);

    /** Fetch les enclos de la zone de l'employé */
    const { data: enclosures } = useQuery({
        queryKey: ["Enclosures", zones],
        queryFn: () => fetchEnclosuresByZone(employee?.zone),
        enabled: !!employee
    });

    /** Fetch les évènements de la zone de l'employé */
    const { data: eventsByZone } = useQuery({
        queryKey: ["EventsByZone", employee],
        queryFn: () => getEventsByZone(employee?.zone),
        enabled: !!employee
    });

    const { data: speciesByZone } = useQuery({
        queryKey: ["SpeciesByZone", employee],
        queryFn: () => fetchSpeciesByZone(employee?.zone),
        enabled: !!employee
    });

    /** Gestion du changement de sélection de zone */
    const handleZoneChange = (e: any) => {
        setSelectedZone(e.target.value);
        setEnclosuresList([{ _id: "tous", name: "Tous les enclos" }]);
        setEventsToDisplay([]);
        setSelectedEnclosure("");
    };

    /** Gestion des évènements à afficher au chargement de la page et modification des évènements à afficher à la sélection d'une zone */
    useEffect(() => {
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
            /** Filtre les enclos disponibles dans la liste en fonction de la zone sélectionnée */
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
                    return enclos;
                });

            let n: number = 0;
            /** Filtre les évènements en fonction de la zone sélectionné */
            eventsByZone
                ?.filter((event: IEvent) => enclos.includes(event.enclosure))
                .map((event: IEvent) => {
                    n = n + 1;
                    setEventsToDisplay((prev) => [...prev, event]);
                    return n;
                });
        }
    }, [selectedZone, enclosures, eventsByZone]);

    /** Gestion du changement de sélection de l'enclos */
    const handleEnclosureChange = (e: any) => {
        setSelectedEnclosure(e.target.value);
        setEventsToDisplay([]);
        setSpeciesList([
            {
                _id: "toutes",
                name: "Toutes les espèces"
            }
        ]);
    };

    /** Gestion des évènements à afficher à la sélection d'un enclos */
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

            speciesByZone
                ?.filter((specie) => specie.enclosure._id === selectedEnclosure)
                .map((specie) => setSpeciesList((prev) => [...prev, specie]));
        }
    }, [selectedEnclosure, eventsByZone, enclosuresList, speciesByZone]);

    const handleSpecyChange = (e: any) => {
        setSelectedSpecy(e.target.value);
        setEventsToDisplay([]);
    };

    useEffect(() => {
        if (speciesByZone) {
            speciesByZone.map((specie: Specie) =>
                setSpeciesList((prev) => [
                    ...prev,
                    { _id: specie._id, name: specie.name }
                ])
            );
        }
    }, [speciesByZone]);

    useEffect(() => {
        eventsByZone
            ?.filter((event) => event.specie === selectedSpecy)
            .map((event) => {
                setEventsToDisplay((prev) => [...prev, event]);
            });
    }, [selectedSpecy, eventsByZone]);

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
                    <select
                        name="Especes"
                        id="especes"
                        title="especes"
                        onChange={(e) => handleSpecyChange(e)}
                    >
                        {speciesList.map((specie) => {
                            return (
                                <option value={specie._id}>
                                    {specie.name}
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
