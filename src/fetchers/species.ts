import axios from "axios";
import Specie from "../interfaces/specie";
import { createAxiosConfig } from "../functions/createAxiosConfig";

const config = createAxiosConfig();

export const fetchSpecieByEnclosure = async () => {
    console.log("Fetching species");
    const response = await axios.get(
        `http://localhost:3000/api/especes/get`,
        config
    );
    const species: Specie[] = response.data.species;

    return species;
};
