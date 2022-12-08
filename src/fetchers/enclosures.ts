import axios from "axios";
import Enclosure from "../interfaces/enclosures";
import { createAxiosConfig } from "../functions/createAxiosConfig";

const config = createAxiosConfig();

export const fetchEnclosuresByZone = async (zone: string) => {
    console.log("Fetching enclosures by Zone");
    const response = await axios.get(
        `http://localhost:3000/api/enclos/get/zone/${zone}`,
        config
    );
    const enclosures: Enclosure[] = response.data.enclosures;

    return enclosures;
};
