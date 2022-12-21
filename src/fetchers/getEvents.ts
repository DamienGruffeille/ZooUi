import axios from "axios";
import { createAxiosConfig } from "../functions/createAxiosConfig";
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

export const getEventsByZone = async (zoneId: string | undefined) => {
    const config = createAxiosConfig();
    if (zoneId !== "toutes") {
        const response = await axios.get(
            `http://localhost:3000/api/evenements/zones/${zoneId}`,
            config
        );
        if (response.data) {
            const events: IEvent[] = response.data.events;
            return events;
        } else {
            return null;
        }
    } else {
        const response = await axios.get(
            "http://localhost:3000/api/evenements/get",
            config
        );
        if (response.data) {
            const events: IEvent[] = response.data.events;
            return events;
        } else {
            return null;
        }
    }
};
