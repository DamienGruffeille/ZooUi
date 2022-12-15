import axios from "axios";
import { createAxiosConfig } from "../functions/createAxiosConfig";

const config = createAxiosConfig();

export const putSpecieOutside = async (
    specieId: string,
    stillInsideAnimals: string[]
) => {
    const payLoad = {
        _id: specieId,
        stillInsideAnimals: stillInsideAnimals
    };

    await axios
        .put("http://localhost:3000/api/especes/sortir", payLoad, config)
        .then((response) => {
            console.log("Ok post effectué", response.data);
        })
        .catch((error) => {
            console.log("Post non effectué", error.message);
        });
};

export const putSpecieInside = async (
    specieId: string,
    stillOutsideAnimals: string[]
) => {
    const payLoad = {
        _id: specieId,
        stillOutsideAnimals: stillOutsideAnimals
    };

    await axios
        .put("http://localhost:3000/api/especes/rentrer", payLoad, config)
        .then((response) => {
            console.log("Ok post effectué", response.data);
        })
        .catch((error) => {
            console.log("Post non effectué", error.message);
        });
};

export const feedSpecie = async (specieId: string) => {
    const payLoad = {
        _id: specieId
    };

    await axios
        .put("http://localhost:3000/api/especes/nourrir", payLoad, config)
        .then((response) => {
            console.log("Ok nourrissage enregistré", response.data);
        })
        .catch((error) => {
            console.log("Nourrissage non enregistré", error.message);
        });
};

export const stimulateSpecie = async (specieId: string) => {
    const payLoad = {
        _id: specieId
    };

    await axios
        .put("http://localhost:3000/api/especes/stimuler", payLoad, config)
        .then((response) => {
            console.log("Ok stimulation enregistrée", response.data);
        })
        .catch((error) => {
            console.log("Stimulation non enregistrée", error.message);
        });
};
