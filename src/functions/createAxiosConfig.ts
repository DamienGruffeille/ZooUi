export const createAxiosConfig = () => {
    const token = JSON.parse(localStorage.getItem("token") as string);
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    };
    return config;
};
