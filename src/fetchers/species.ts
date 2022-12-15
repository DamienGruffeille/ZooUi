import axios from "axios";
import Specie from "../interfaces/specie";
import { createAxiosConfig } from "../functions/createAxiosConfig";

let species: Specie[];
export const fetchSpeciesByZone = async (zone: string) => {
    const config = createAxiosConfig();
    console.log("Fetching species " + zone);
    if (zone !== "toutes") {
        const response = await axios.get(
            `http://localhost:3000/api/especes/get/zone/${zone}`,
            config
        );
        species = response.data;
    } else {
        const response = await axios.get(
            `http://localhost:3000/api/especes/get`,
            config
        );
        species = response.data.species;
    }

    return species;
};
