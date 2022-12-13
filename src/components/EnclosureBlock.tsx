import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, ReactElement } from "react";
import AsyncSelect from "react-select/async";
import { fetchAnimalsBySpecy } from "../fetchers/animals";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Specie from "../interfaces/specie";
import ToggleSwitch from "./ToggleSwitch";

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

    const handleAnimalArray = (e: any) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            if (!notMovingAnimals.includes(e.target.value)) {
                setnotMovingAnimals((prev) => [...prev, e.target.value]);
                console.log("added to array");
            }
        } else {
            setnotMovingAnimals((prev) =>
                prev.filter((animal) => animal !== e.target.value)
            );
        }
    };

    console.log(notMovingAnimals);

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
                <form key={specie.enclosure._id} className="enclosureBlock">
                    <h4>{specie.enclosure.name}</h4>
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
                            <span>Modifier position de l'espèce :</span>
                            <ToggleSwitch labelG="Dedans" labelD="Dehors" />
                            <br />
                            <span>
                                Sélectionnez les animaux n'ayant pas bougé :
                            </span>
                            <ul>
                                {animals?.animals.map((animal, index) => {
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
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default EnclosureBlock;
