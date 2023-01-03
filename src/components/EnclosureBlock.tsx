import axios from "axios";
import { useState, ReactElement } from "react";
import AsyncSelect from "react-select/async";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Specie from "../interfaces/specie";
import SpecieMovementBlock from "./SpecieMovementBlock";
import SpecieFeeding from "./SpecieFeeding";
import SpecieStimulation from "./SpecieStimulation";
import AnimalsBlock from "./AnimalsBlock";
import EnclosureCheck from "./EnclosureCheck";
import ActionsBlock from "./actionsBlock";
import EventsBlock from "./eventsBlock";

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
    const [specieMovementDetected, setspecieMovementDetected] =
        useState<boolean>();

    const childToParent = (action: boolean) => {
        console.log("Parent component, specieMovementDetected : " + action);
        setspecieMovementDetected(action);
    };

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
        console.log("L'espèce a changé");
    };

    const specie: Specie | undefined = species.find((specie) => {
        return specie._id === selectedOption;
    });

    return (
        <>
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                placeholder="Sélectionner l'espèce"
                onChange={onChangeSelectedOption}
            />
            <ul className="outside--container">
                {specie && (
                    <>
                        <li className="container__small">
                            <div className="container__id">
                                <h3>Enclos : {specie.enclosure.name}</h3>
                                <span>Zone : {specie.enclosure.zone}</span>
                                <br />
                                <span>
                                    Superficie : {specie.enclosure.surface_area}
                                </span>
                            </div>
                            <div className="container__action">
                                <EnclosureCheck specie={specie} />
                            </div>
                        </li>

                        <ActionsBlock specie={selectedOption} />

                        <EventsBlock specie={selectedOption} />
                    </>
                )}
            </ul>

            <div className="outside--container">
                {specie && (
                    <div className="container__big">
                        <>
                            <h3>Espèce : {specie.name}</h3>

                            <img src="" alt="animal" />
                            {/* <label htmlFor="">{specie.name}</label> */}
                            <br />
                            <span>
                                {specie?.dangerous
                                    ? "Dangereux"
                                    : "Non dangereux"}
                            </span>
                            <br />
                            <span>
                                {specie?.sociable ? "Sociable" : "Non sociable"}
                            </span>

                            <div className="container__actions">
                                <SpecieMovementBlock
                                    specie={specie}
                                    childToParent={childToParent}
                                />
                                <SpecieFeeding specie={specie} />
                                <SpecieStimulation specie={specie} />
                            </div>
                        </>
                    </div>
                )}
            </div>

            <div>
                {specie && (
                    <AnimalsBlock
                        specie={specie}
                        data={specieMovementDetected}
                        setter={setspecieMovementDetected}
                    />
                )}
            </div>
        </>
    );
};

export default EnclosureBlock;
