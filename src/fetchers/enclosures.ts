import axios from "axios";
import Enclosure from "../interfaces/enclosures";

const token = JSON.parse(localStorage.getItem("token") as string);
const config = {
    headers: {
        Authorization: "Bearer " + token
    }
};

export const fetchEnclosuresByZone = async (zone: string) => {
    console.log("Fetching enclosures by Zone");
    const response = await axios.get(
        `http://localhost:3000/api/enclos/get/zone/${zone}`,
        config
    );
    if (response.data) {
        const enclosures: Enclosure[] = response.data.enclosures;

        return enclosures;
    } else {
        return null;
    }
};
