import { useEffect, useState } from "react";
import Header from "../components/Header";
import Employee from "../interfaces/employee";
import IEvent from "../interfaces/event";
import {
    getEventsByZone,
    getEventsByEnclosure,
    getEventsBySpecie,
    getEventsByAnimal
} from "../fetchers/getEvents";
import { useQuery } from "@tanstack/react-query";
import { getAllZones } from "../fetchers/zones";
import { fetchEnclosuresByZone } from "../fetchers/enclosures";
import { fetchSpeciesByZone } from "../fetchers/species";
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
    const [selectedEnclosure, setSelectedEnclosure] = useState<string>();

    const [speciesList, setSpeciesList] = useState([
        { _id: "toutes", name: "Toutes les espèces" }
    ]);
    const [selectedSpecy, setSelectedSpecy] = useState<string>();

    const [animalsList, setAnimalsList] = useState([
        { _id: "tous", name: "Tous les animaux" }
    ]);
    const [selectedAnimal, setSelectedAnimal] = useState<string>();

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
        enclosures?.map((enclosure) =>
            setEnclosuresList((prev) => [
                ...prev,
                { _id: enclosure._id, name: enclosure.name }
            ])
        );
        setSelectedEnclosure("tous");
    }, [enclosures]);

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
        setSelectedSpecy("toutes");
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
        setSelectedAnimal("tous");
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
        const _animal: string = e.target.value;
        let events: IEvent[] | null = [];

        setSelectedAnimal(_animal);

        if (_animal !== "tous") {
            events = await getEventsByAnimal(_animal);
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
                    <label htmlFor="zones">Par zone : </label>
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
                    <label htmlFor="enclos">Par enclos : </label>
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
                    <label htmlFor="especies">Par espèce : </label>
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
                    <label htmlFor="animaux">Par animal : </label>
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
