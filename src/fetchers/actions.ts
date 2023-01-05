import axios from "axios";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Action from "../interfaces/action";

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

export const getActionsByEmployee = async (employeeName: string) => {
    const config = createAxiosConfig();

    const response = await axios.get(
        `http://localhost:3000/api/actions/employe/${employeeName}`,
        config
    );

    const actions: Action[] = response.data.actions;
    console.log("Actions fetcher : " + actions);

    return actions;
};

export const getActionsBySpecie = async (specieId: string) => {
    const config = createAxiosConfig();

    const response = await axios.get(
        `http://localhost:3000/api/actions/especes/${specieId}`,
        config
    );

    const actions: Action[] = response.data.actions;
    if (actions) {
        return actions;
    } else {
        return null;
    }
};

export const getNextAction = async (employeeId: string) => {
    const config = createAxiosConfig();

    const response = await axios.get(
        `http://localhost:3000/api/actions/next/${employeeId}`,
        config
    );

    if (response.data) {
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
        `http://localhost:3000/api/actions/update`,
        payLoad,
        config
    );

    const updatedAction: Action = response.data.actionUpdated;

    return updatedAction;
};
