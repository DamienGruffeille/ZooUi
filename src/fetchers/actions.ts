import axios from "axios";
import { createAxiosConfig } from "../functions/createAxiosConfig";

export const getActionsByZone = async (zoneId: string) => {
    const config = createAxiosConfig();

    if (zoneId !== "toutes") {
        const response = await axios.get(
            `http://localhost:3000/api/actions/zones/${zoneId}`,
            config
        );

        if (response.data) {
            const actions: any = response.data.actions;
            return actions;
        } else {
            return null;
        }
    } else {
        const response = await axios.get(
            `http://localhost:3000/api/actions/toutes`,
            config
        );

        if (response.data) {
            const actions: any = response.data.actions;
            return actions;
        } else {
            return null;
        }
    }
};

export const getNextAction = async (employeeId: string) => {
    const config = createAxiosConfig();

    const response = await axios.get(
        `http://localhost:3000/api/actions/next/${employeeId}`,
        config
    );

    if (response.data) {
        console.log(response.data);
        const action: any = response.data;
        return action;
    } else {
        return null;
    }
};

export const updateAction = async (actionId: string) => {
    const config = createAxiosConfig();
    const payLoad = { _id: actionId };

    const response = await axios.put(
        `http://localhost:3000/api/actions/update/${actionId}`,
        payLoad,
        config
    );

    if (response.data) {
        const actionUpdated: any = response.data.action;
        return actionUpdated;
    } else {
        return null;
    }
};
