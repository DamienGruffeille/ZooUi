export const createAxiosConfig = () => {
    const token = JSON.parse(localStorage.getItem("token") as string);
    console.log("Token ZooUI : " + token);
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    };
    return config;
};
