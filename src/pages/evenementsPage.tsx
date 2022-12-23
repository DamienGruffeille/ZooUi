import { useEffect, useState } from "react";
import Header from "../components/Header";
import Employee from "../interfaces/employee";
import IEvent from "../interfaces/event";
import Zone from "../interfaces/zone";
import {
    getEventsByZone,
    getEventsByEnclosure,
    getEventsBySpecie,
    getEventsByAnimal
} from "../fetchers/getEvents";
import { useQuery } from "@tanstack/react-query";
import { getAllZones } from "../fetchers/zones";
import { fetchEnclosuresByZone } from "../fetchers/enclosures";
import Enclosure from "../interfaces/enclosures";
import { fetchSpeciesByZone } from "../fetchers/species";
import Specie from "../interfaces/specie";
import { fetchAllAnimals } from "../fetchers/animals";

const EvenementsPage = () => {
    /** Récupération des zones de l'employé */
    const employeeLocalStorage = localStorage.getItem("employee");
    const nbResultats = [50, 30, 25, 20, 15, 10, 5, 1];
    const eventTypes = [
        "Tous type d'évènement",
        "Entrée",
        "Sortie",
        "Nourrisage",
        "Stimulation",
        "Soins",
        "Naissance",
        "Décès",
        "Départ",
        "Arrivée",
        "Bagarre",
        "Accident",
        "Vérification"
    ];
    const [employeeZone, setEmployeeZone] = useState<string>("");

    const [zonesList, setZonesList] = useState([
        { _id: "toutes", name: "Toutes les zones" }
    ]);
    const [selectedZone, setSelectedZone] = useState<string>();

    const [enclosuresList, setEnclosuresList] = useState([
        { _id: "tous", name: "Tous les enclos" }
    ]);
    const [selectedEnclosure, setSelectedEnclosure] = useState<string>("tous");

    const [speciesList, setSpeciesList] = useState([
        { _id: "toutes", name: "Toutes les espèces" }
    ]);
    const [selectedSpecy, setSelectedSpecy] = useState<string>("toutes");

    const [animalsList, setAnimalsList] = useState([
        { _id: "tous", name: "Tous les animaux" }
    ]);
    const [selectedAnimal, setSelectedAnimal] = useState<string>("tous");

    const [selectedRange, setSelectedRange] = useState<number>();

    const [eventsToDisplay, setEventsToDisplay] = useState<IEvent[]>([]);

    /** TODO ? : filtrer les listes en fonction du choix effectué*/

    /** Récupère l'employé stocké dans localStorage pour définir la zone à laquelle il a accès */
    useEffect(() => {
        if (employeeLocalStorage) {
            const employee: Employee = JSON.parse(employeeLocalStorage);
            setEmployeeZone(employee.zone);
        }
    }, [employeeLocalStorage]);

    /** Fetch toutes les zones du zoo */
    const { data: zones } = useQuery({
        queryKey: ["Zones"],
        queryFn: () => getAllZones(employeeZone),
        enabled: !!employeeZone
    });

    /** Insère les zones dans le menu déroulant zones et sélectionne la zone de l'employé par défaut */
    useEffect(() => {
        console.log("Zones : " + zones);

        if (employeeZone === "toutes") {
            zones
                ?.filter((zone) => zone._id !== "toutes")
                .map((zone) =>
                    setZonesList((prev) => [
                        ...prev,
                        { _id: zone._id, name: zone.name }
                    ])
                );
        } else {
            zones
                ?.filter((zone) => zone._id === employeeZone)
                .map((zone) =>
                    setZonesList([{ _id: zone._id, name: zone.name }])
                );
        }

        setSelectedZone(employeeZone);
    }, [zones, employeeZone]);

    /** Fetch les enclos de la zone de l'employé */
    const { data: enclosures } = useQuery({
        queryKey: ["Enclosures", employeeZone],
        queryFn: () => fetchEnclosuresByZone(employeeZone),
        enabled: !!employeeZone
    });

    /** Insère les enclos dans la liste déroulante */
    useEffect(() => {
        if (selectedZone === "toutes") {
            enclosures?.map((enclosure) =>
                setEnclosuresList((prev) => [
                    ...prev,
                    { _id: enclosure._id, name: enclosure.name }
                ])
            );
        } else {
            enclosures
                ?.filter((enclosure) => enclosure.zone === selectedZone)
                .map((enclosure) =>
                    setEnclosuresList((prev) => [
                        ...prev,
                        { _id: enclosure._id, name: enclosure.name }
                    ])
                );
        }
    }, [enclosures, selectedZone]);

    /** Fetch les espèces de la zone de l'employé */
    const { data: speciesByZone } = useQuery({
        queryKey: ["SpeciesByZone", employeeZone],
        queryFn: () => fetchSpeciesByZone(employeeZone),
        enabled: !!employeeZone
    });

    /** Insère les espèces dans la liste déroulante */
    useEffect(() => {
        speciesByZone?.map((specy) =>
            setSpeciesList((prev) => [
                ...prev,
                { _id: specy._id, name: specy.name }
            ])
        );
    }, [speciesByZone]);

    /** Fetch les animaux */
    const { data: animals } = useQuery({
        queryKey: ["Animaux"],
        queryFn: () => fetchAllAnimals()
    });

    /** Insère les animaux dans la liste déroulante */
    useEffect(() => {
        let species: string[] = [];
        speciesByZone?.forEach((specie) => species.push(specie._id));

        animals
            ?.filter((animal) => species?.includes(animal.specie))
            .map((animal) =>
                setAnimalsList((prev) => [
                    ...prev,
                    { _id: animal._id, name: animal.name }
                ])
            );
    }, [animals, speciesByZone]);

    /** Fetch les évènements de la zone sélectionnée (par défaut celle de l'employé) */
    const { data: eventsByZone } = useQuery({
        queryKey: ["EventsByZone", employeeZone],
        queryFn: () => getEventsByZone(selectedZone),
        enabled: !!selectedZone
    });

    /** Affichage des évènements */
    useEffect(() => {
        if (eventsByZone) setEventsToDisplay(eventsByZone);
    }, [eventsByZone]);

    /** Gestion du changement de sélection de zone */
    const handleZoneChange = async (e: any) => {
        const zone: string = e.target.value;
        setSelectedZone(zone);

        const events = await getEventsByZone(zone);

        if (events) {
            setEventsToDisplay(events);
        } else {
            setEventsToDisplay([]);
        }
    };

    /** Gestion du changement de sélection de l'enclos */
    const handleEnclosureChange = async (e: any) => {
        const enclos: string = e.target.value;
        let events: IEvent[] | null = [];

        setSelectedEnclosure(enclos);

        enclos !== "tous"
            ? (events = await getEventsByEnclosure(enclos))
            : (events = await getEventsByZone(selectedZone));

        if (events) {
            setEventsToDisplay(events);
        } else {
            setEventsToDisplay([]);
        }
    };

    const handleSpecyChange = async (e: any) => {
        const specie: string = e.target.value;
        let events: IEvent[] | null = [];

        setSelectedSpecy(specie);

        if (specie !== "toutes") {
            events = await getEventsBySpecie(specie);
        } else if (selectedEnclosure !== "tous") {
            events = await getEventsByEnclosure(selectedEnclosure);
        } else {
            events = await getEventsByZone(selectedZone);
        }

        if (events) {
            setEventsToDisplay(events);
        } else {
            setEventsToDisplay([]);
        }
    };

    const handleAnimalChange = async (e: any) => {
        const animal: string = e.target.value;
        let events: IEvent[] | null = [];

        setSelectedAnimal(animal);

        if (animal !== "tous") {
            events = await getEventsByAnimal(animal);
        } else if (selectedSpecy !== "toutes") {
            events = await getEventsBySpecie(selectedSpecy);
        } else if (selectedEnclosure !== "tous") {
            events = await getEventsByEnclosure(selectedEnclosure);
        } else {
            events = await getEventsByZone(selectedZone);
        }

        if (events) {
            setEventsToDisplay(events);
        } else {
            setEventsToDisplay([]);
        }
    };

    const handleEventTypeChange = async (e: any) => {
        const eventType = e.target.value;
        let events: IEvent[] = [];

        /**  TODO : créer un EventsToDisplayFiltered où seront stockés les events
         * filtrés par type d'event.
         * Si EventsToDisplayFiltered.length !== 0 alors je l'affiche
         * sinon j'affiche EventsToDisplay
         * ainsi une fois "Tous les évènements" sélectionnés je peux réafficher la liste affichée précedemment
         */
    };

    useEffect(() => {
        console.log("Nbre d'events : " + eventsToDisplay.length);
    }, [eventsToDisplay]);

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

                    {/* Liste déroulante Zones */}
                    <select
                        name="Zones"
                        id="zones"
                        title="zones"
                        value={selectedZone}
                        onChange={(e) => handleZoneChange(e)}
                    >
                        {zonesList?.map((zone) => {
                            return (
                                <option value={zone._id} key={zone._id}>
                                    {zone.name}
                                </option>
                            );
                        })}
                    </select>

                    {/* Liste déroulante Enclos */}
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

                    {/* Liste déroulante Espèces */}
                    <select
                        name="Especes"
                        id="especes"
                        title="especes"
                        onChange={(e) => handleSpecyChange(e)}
                    >
                        {speciesList?.map((specie) => {
                            return (
                                <option value={specie._id} key={specie._id}>
                                    {specie.name}
                                </option>
                            );
                        })}
                    </select>

                    {/* Liste déroulante Animaux */}
                    <select
                        name="Animaux"
                        id="animaux"
                        title="animaux"
                        onChange={(e) => handleAnimalChange(e)}
                    >
                        {animalsList.map((animal) => {
                            return (
                                <option value={animal._id} key={animal._id}>
                                    {" "}
                                    {animal.name}
                                </option>
                            );
                        })}
                    </select>

                    {/* Liste déroulante types d'évènements */}
                    <select
                        name="eventType"
                        id="eventType"
                        title="Type d'évènement"
                    >
                        {eventTypes.map((eventType) => {
                            return (
                                <option value={eventType} key={eventType}>
                                    {eventType}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <ul className="eventList">
                    {eventsToDisplay.length > 0 ? (
                        eventsToDisplay

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
                                        <span>
                                            Enclos : {event.enclosure.name}
                                        </span>
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
                            })
                    ) : (
                        <li key="aucunEvenement" className="eventList__event">
                            Aucun évènement
                        </li>
                    )}
                </ul>
            </main>
        </>
    );
};

export default EvenementsPage;
