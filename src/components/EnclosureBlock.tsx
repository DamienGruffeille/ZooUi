import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, ReactElement, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { fetchAnimalsBySpecy } from "../fetchers/animals";
import {
    feedSpecie,
    putSpecieInside,
    putSpecieOutside,
    stimulateSpecie
} from "../fetchers/postEvent";
import { getLastEvent } from "../fetchers/getEvents";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Specie from "../interfaces/specie";

type EnclosureBlockProps = {
    zone: string;
};

type Options = {
    label: string;
    value: string;
};

const config = createAxiosConfig();
let species: Specie[] = [];

const EnclosureBlock = ({ zone }: EnclosureBlockProps): ReactElement => {
    console.log("Render");

    const [selectedOption, setSelectedOption] = useState<string>("");
    const [notMovingAnimals, setnotMovingAnimals] = useState<string[]>([]);
    const [didClickMovementButton, setdidClickMovementButton] = useState(false);
    const [didClickFeedButton, setdidClickFeedButton] = useState(false);
    const [dernierNourrissage, setdernierNourrissage] =
        useState("Pas encore nourris");
    const [derniereStimulation, setderniereStimulation] = useState(
        "Pas encore stimulés"
    );
    const [checkBoxChecked, setCheckBoxChecked] = useState<HTMLInputElement[]>(
        []
    );

    /** Si l'employé change d'espèce, le tableau des animaux qui ne
     * bougent pas est vidé
     */
    useEffect(() => {
        setnotMovingAnimals([]);
    }, [selectedOption]);

    /** Décoche les checkbox à lorsqu'un bouton entrer/sortir est activé */
    useEffect(() => {
        if (didClickMovementButton) {
            checkBoxChecked.forEach((checkBox) => (checkBox.checked = false));
        }
    }, [didClickMovementButton, checkBoxChecked]);

    /** fetch les espèces dans la zone de l'employé
     * si l'employé est autorisé sur toutes les zones, fetch
     * toutes les espèces du zoo
     */
    const loadOptions = (
        inputValue: string,
        callback: (options: Options[]) => void
    ) => {
        console.log("on load options function");
        if (zone !== "toutes") {
            axios
                .get(
                    `http://localhost:3000/api/especes/get/zone/${zone}`,
                    config
                )
                .then((response) => {
                    const options: Options[] = [];
                    response.data.forEach((specie: Specie) => {
                        options.push({ label: specie.name, value: specie._id });
                    });
                    species = response.data;
                    callback(options);
                });
        } else {
            axios
                .get("http://localhost:3000/api/especes/get", config)
                .then((response) => {
                    const options: Options[] = [];
                    response.data.species.forEach((specie: Specie) => {
                        options.push({ label: specie.name, value: specie._id });
                    });
                    species = response.data.species;

                    callback(options);
                });
        }
    };

    /**  Définit l'espèce sélectionnée pour fetch tous les animaux
     * de cette espèce
     */
    const onChangeSelectedOption = (e: any) => {
        setSelectedOption(e.value);
    };

    const specie: Specie | undefined = species.find((specie) => {
        return specie._id === selectedOption;
    });

    const { data: animals } = useQuery({
        queryKey: ["Animals", specie],
        queryFn: () => fetchAnimalsBySpecy(specie?._id),
        enabled: !!specie
    });

    const { data: nourrissage, refetch: refetchNourrissage } = useQuery({
        queryKey: ["FeedEvents", specie],
        queryFn: () => getLastEvent(specie?._id, "Nourrissage"),
        enabled: !!specie
    });

    useEffect(() => {
        if (didClickFeedButton) {
            console.log("Feed button activated");
            refetchNourrissage();
            console.log("Nourrissage" + nourrissage);
            if (nourrissage) {
                console.log("Nourrissage il y a");
                setdernierNourrissage(
                    new Intl.DateTimeFormat().format(
                        Date.parse(nourrissage.createdAt)
                    )
                );
            }
        }
    }, [didClickFeedButton]);

    const { data: stimulation, refetch: refetchStimulation } = useQuery({
        queryKey: ["StimEvents", specie],
        queryFn: () => getLastEvent(specie?._id, "Stimulation"),
        enabled: !!specie
    });

    useEffect(() => {
        if (stimulation) {
            setderniereStimulation(
                new Intl.DateTimeFormat().format(
                    Date.parse(stimulation.createdAt)
                )
            );
        } else {
            setderniereStimulation("Pas encore stimulés");
        }
    }, [stimulation]);

    /** Gestion du tableau des animaux qu'il ne faut pas mouvementer */
    const handleAnimalArray = (e: any) => {
        console.log("e.target : " + e.target.id);
        console.log(e.target.checked);
        if (e.target.checked) {
            if (!notMovingAnimals.includes(e.target.value)) {
                setnotMovingAnimals((prev) => [...prev, e.target.value]);
                console.log("added to array");
            }
            if (!checkBoxChecked.includes(e.target)) {
                setCheckBoxChecked((prev) => [...prev, e.target]);
            }
        } else {
            setnotMovingAnimals((prev) =>
                prev.filter((animal) => animal !== e.target.value)
            );
            setCheckBoxChecked((prev) =>
                prev.filter((checkBox) => checkBox !== e.target)
            );
        }
    };

    const handleSubmit = (e: any) => {
        if (e.target.value === "Sortie") {
            if (specie) {
                console.log("Espèce " + specie._id);
                console.log("eventType " + e.target.value);
                console.log("Tab animaux pas bougé " + notMovingAnimals);

                putSpecieOutside(specie._id, notMovingAnimals);

                console.log("postEvent a été appelé");
            } else {
                console.log("postEvent n'a pas pu être appelé");
            }
        } else {
            if (specie) {
                console.log("Espèce " + specie._id);
                console.log("eventType " + e.target.value);
                console.log("Tab animaux pas bougé " + notMovingAnimals);

                putSpecieInside(specie._id, notMovingAnimals);

                console.log("postEvent a été appelé");
            } else {
                console.log("postEvent n'a pas pu être appelé");
            }
        }
        setdidClickMovementButton(true);
    };

    const handleFeeding = () => {
        if (specie) {
            feedSpecie(specie._id);
        }
        setdidClickFeedButton(true);
    };

    const handleStimulation = () => {
        if (specie) {
            stimulateSpecie(specie._id);
        }
        refetchStimulation();
    };

    return (
        <>
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                placeholder="Sélectionner l'espèce"
                onChange={onChangeSelectedOption}
            />
            {specie && (
                <div key={specie.enclosure._id} className="enclosureBlock">
                    <h3>{specie.enclosure.name}</h3>
                    <div className="enclosureBlock__container">
                        <div
                            key={specie._id}
                            className="enclosureBlock__container__specie"
                        >
                            <img src="" alt="animal" />
                            <label htmlFor="">{specie.name}</label>
                        </div>

                        <div
                            key={"position"}
                            className="enclosureBlock__container__specie"
                        >
                            <h4>Modifier position de l'espèce :</h4>
                            <br />
                            <span>
                                Sélectionnez les animaux n'ayant pas bougé :
                            </span>
                            <ul>
                                {animals?.map((animal, index) => {
                                    return (
                                        <li key={index}>
                                            <input
                                                title="animal"
                                                type="checkbox"
                                                name={animal.name}
                                                value={animal._id}
                                                id={`custom-checkbox-${index}`}
                                                // checked={checkedAnimals[index]}
                                                onChange={(e) =>
                                                    handleAnimalArray(e)
                                                }
                                            />
                                            <label
                                                htmlFor={`custom-checkbox-${index}`}
                                            >
                                                {animal.name}
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                            <br />
                            <div
                                key={"buttons"}
                                className="enclosureBlock__container__specie__btn"
                            >
                                <button
                                    onClick={handleSubmit}
                                    title="rentrer"
                                    value={"Entrée"}
                                >
                                    Rentrer
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    title="sortir"
                                    value={"Sortie"}
                                >
                                    Sortir
                                </button>
                            </div>
                        </div>
                        <div key={"autresActions"}>
                            <div
                                key={"nourrir"}
                                className="enclosureBlock__container__specie"
                            >
                                <h4>Nourrissage des animaux :</h4>
                                <button onClick={handleFeeding}>Nourrir</button>
                                <br />
                                <span>
                                    Dernier nourrissage : {dernierNourrissage}
                                </span>
                            </div>
                            <div
                                key={"stimuler"}
                                className="enclosureBlock__container__specie"
                            >
                                <h4>Stimulation des animaux :</h4>
                                <button onClick={handleStimulation}>
                                    Stimuler
                                </button>
                                <br />
                                <span>
                                    Dernière stimulation : {derniereStimulation}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EnclosureBlock;
