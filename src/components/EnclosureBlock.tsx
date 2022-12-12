import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, ReactElement, SyntheticEvent } from "react";
import AsyncSelect from "react-select/async";
import { fetchSpeciesByZone } from "../fetchers/species";
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

const EnclosureBlock = ({ zone }: EnclosureBlockProps): ReactElement => {
    console.log("Render");

    const [selectedValue, setSelectedValue] = useState();

    const {
        isError,
        isLoading,
        data: species,
        error
    } = useQuery({
        queryKey: ["Species"],
        queryFn: () => fetchSpeciesByZone(zone)
    });

    if (isLoading) {
        console.log("Loading...");
        return <div>Loading...</div>;
    }

    if (isError) {
        console.log("Error: ", error);
        return <div>Error...</div>;
    }

    const loadOptions = (
        inputValue: string,
        callback: (options: Options[]) => void
    ) => {
        console.log("on load options function");
        axios
            .get(`http://localhost:3000/api/especes/get/zone/${zone}`, config)
            .then((response) => {
                const options: Options[] = [];
                response.data.forEach((specie: Specie) => {
                    options.push({ label: specie.name, value: specie._id });
                });
                callback(options);
            });
    };

    const handleSelection = (e: SyntheticEvent) => {
        e.preventDefault();
    };

    return (
        <>
            {species.map((specie) => {
                return <li key={specie._id}>{specie.name}</li>;
            })}
            <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions
                placeholder="Sélectionner l'espèce"
                onChange={(e) => handleSelection(e)}
            />
        </>
    );
};

export default EnclosureBlock;
