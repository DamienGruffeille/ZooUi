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

    return species;
};

export const dropdownSpecies = async (zone: string) => {
    const arr: any = [];

    await axios
        .get(`http://localhost:3000/api/especes/get/zone/${zone}`, config)
        .then((res) => {
            let species = res.data;
            species.map((specie: Specie) => {
                return arr.push({ value: specie._id, label: specie.name });
            });
        })
        .catch((err) => {
            console.log(err);
        });
    return arr;
};