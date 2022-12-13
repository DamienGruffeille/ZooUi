import { ReactElement, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSpeciesByZone } from "../fetchers/species";
import Header from "../components/Header";
import Employee from "../interfaces/employee";

const employeeLocalStorage = localStorage.getItem("employee");

const EspecesPage = (): ReactElement => {
    const [employee, setEmployee] = useState<Employee>();
    useEffect(() => {
        if (employeeLocalStorage) {
            setEmployee(JSON.parse(employeeLocalStorage));
        }
    }, []);

    const {
        isError,
        isLoading,
        data: species,
        error
    } = useQuery({
        queryKey: ["Species"],
        queryFn: () => fetchSpeciesByZone(employee!.zone)
    });

    if (isLoading) {
        console.log("Loading...");
        return <div>Loading...</div>;
    }

    if (isError) {
        console.log("Error: ", error);
        return <div>Error...</div>;
    }

    return (
        <>
            <Header />
            {species.map((specie) => {
                return <li key={specie._id}>{specie.name}</li>;
            })}
        </>
    );
};

export default EspecesPage;
