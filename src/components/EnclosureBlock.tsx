import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, ReactElement, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { feedSpecie, stimulateSpecie } from "../fetchers/postEvent";
import { getLastEvent } from "../fetchers/getEvents";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Specie from "../interfaces/specie";
import SpecieMovementBlock from "./SpecieMovementBlock";

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
    const [didClickFeedButton, setdidClickFeedButton] = useState(false);
    const [dernierNourrissage, setdernierNourrissage] =
        useState("Pas encore nourris");
    const [derniereStimulation, setderniereStimulation] = useState(
        "Pas encore stimulés"
    );

    /** Si l'employé change d'espèce, le tableau des animaux qui ne
     * bougent pas est vidé
     */
    // useEffect(() => {
    //     setnotMovingAnimals([]);
    // }, [selectedOption]);

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

                        <SpecieMovementBlock specie={specie} />
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
