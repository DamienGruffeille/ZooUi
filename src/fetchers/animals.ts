import axios from "axios";
import Animal from "../interfaces/animal";
import { createAxiosConfig } from "../functions/createAxiosConfig";

const config = createAxiosConfig();
let animals: Animal[];
export const fetchAnimalsBySpecy = async (specie: string | undefined) => {
    console.log("Fetching animals " + specie);

    const response = await axios.get(
        `http://localhost:3000/api/animaux/get/specie/${specie}`,
        config
    );
    animals = response.data.animals;

    return animals;
};