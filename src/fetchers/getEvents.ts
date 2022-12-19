import axios from "axios";
import IEvent from "../interfaces/event";

const token = JSON.parse(localStorage.getItem("token") as string);

export const getLastEvent = async (
    specieId: string | undefined,
    eventType: string | undefined
) => {
    const response = await axios.get(
        `http://localhost:3000/api/evenements/especes/last`,
        {
            params: { _id: specieId, eventType: eventType },
            headers: { Authorization: "Bearer " + token }
        }
    );
    if (response.data.events) {
        const event: IEvent = response.data.events;
        return event;
    } else {
        return null;
    }
};

export const getLastMovement = async (
    specieId: string | undefined,
    eventType: string | undefined,
    eventType2: string | undefined
) => {
    const response = await axios.get(
        `http://localhost:3000/api/evenements/especes/last`,
        {
            params: {
                _id: specieId,
                eventType: eventType,
                eventType2: eventType2
            },
            headers: { Authorization: "Bearer " + token }
        }
    );
    if (response.data.events) {
        const event: IEvent = response.data.events;
        return event;
    } else {
        return null;
    }
};
