import axios from "axios";
import Specie from "../interfaces/specie";
import { createAxiosConfig } from "../functions/createAxiosConfig";

const config = createAxiosConfig();

export const fetchSpeciesByZone = async (zone: string) => {
    console.log("Fetching species " + zone);
    const response = await axios.get(
        `http://localhost:3000/api/especes/get/zone/${zone}`,
        config
    );
    const species: Specie[] = response.data;
    console.log(species);

    return species;
};
