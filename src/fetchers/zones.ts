import axios from "axios";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Zone from "../interfaces/zone";

export const getAllZones = async () => {
    const config = createAxiosConfig();
    console.log("Getting all zones");

    const response = await axios.get(
        "http://localhost:3000/api/zones/get",
        config
    );

    if (response.data) {
        const zones: Zone[] = response.data.zones;
        return zones;
    } else {
        return null;
    }
};
