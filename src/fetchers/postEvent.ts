import axios from "axios";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import IEvent from "../interfaces/event";

let event: IEvent;

export const putSpecieOutside = async (
    specieId: string,
    stillInsideAnimals: string[]
) => {
    const config = createAxiosConfig();
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
    const config = createAxiosConfig();
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
    const config = createAxiosConfig();
    console.log("Config ZooUI: " + config.headers.Authorization);

    await axios
        .put("http://localhost:3000/api/especes/nourrir", payLoad, config)
        .then((response) => {
            console.log("Ok nourrissage enregistré", response.data);
            event = response.data.newEvent;
        })
        .catch((error) => {
            console.log("Nourrissage non enregistré", error.message);
        });
    return event;
};

export const stimulateSpecie = async (specieId: string) => {
    const payLoad = {
        _id: specieId
    };
    const config = createAxiosConfig();
    await axios
        .put("http://localhost:3000/api/especes/stimuler", payLoad, config)
        .then((response) => {
            console.log("Ok stimulation enregistrée", response.data);
            event = response.data.newEvent;
        })
        .catch((error) => {
            console.log("Stimulation non enregistrée", error.message);
        });
    return event;
};
