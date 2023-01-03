import axios from "axios";
import Animal from "../interfaces/animal";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import IEvent from "../interfaces/event";

let animals: Animal[];

export const fetchAllAnimals = async () => {
    const config = createAxiosConfig();

    const response = await axios.get(
        `http://localhost:3000/api/animaux/get`,
        config
    );

    animals = response.data.animals;

    return animals;
};

export const fetchAnimalsBySpecy = async (specie: string | undefined) => {
    const config = createAxiosConfig();
    console.log("Fetching animals " + specie);

    const response = await axios.get(
        `http://localhost:3000/api/animaux/get/specie/${specie}`,
        config
    );
    animals = response.data.animals;

    return animals;
};

// let event: IEvent;
export const putAnimalOutside = async (animalId: string) => {
    const config = createAxiosConfig();
    const payLoad = {
        _id: animalId
    };

    await axios
        .put("http://localhost:3000/api/animaux/sortir", payLoad, config)
        .then((response) => {
            console.log("OK animal sorti : " + animalId);
            const event: IEvent = response.data.newEvent;
            return event;
        })
        .catch((error) => {
            console.log(
                "Animal non sorti : " + animalId + " erreur : " + error.message
            );
            return error;
        });
};

export const putAnimalInside = async (animalId: string) => {
    const config = createAxiosConfig();
    const payLoad = {
        _id: animalId
    };

    await axios
        .put("http://localhost:3000/api/animaux/rentrer", payLoad, config)
        .then((response) => {
            console.log("OK animal rentré : " + animalId);
            const event: IEvent = response.data.newEvent;
            return event;
        })
        .catch((error) => {
            console.log(
                "Animal non rentré : " + animalId + " erreur : " + error.message
            );
            return error;
        });
};
