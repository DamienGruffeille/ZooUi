import axios from "axios";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Header from "../components/Header";
import { createAxiosConfig } from "../functions/createAxiosConfig";
import Employee from "../interfaces/employee";
import Zone from "../interfaces/zone";

type Options = {
    label: string;
    value: string;
};

const config = createAxiosConfig();

const EvenementsPage = () => {
    /** Récupération des zones de l'employé */
    const [employee, setEmployee] = useState<Employee>();
    const employeeLocalStorage = localStorage.getItem("employee");

    useEffect(() => {
        if (employeeLocalStorage) {
            setEmployee(JSON.parse(employeeLocalStorage));
        }
    }, [employeeLocalStorage]);

    // get all zones of the employee
    const loadZones = (
        inputValue: string,
        callback: (options: Options[]) => void
    ) => {
        axios
            .get("http://localhost:3000/api/zones/get", config)
            .then((response) => {
                const options: Options[] = [];
                response.data.zones.forEach((zone: Zone) => {
                    options.push({ label: zone.name, value: zone._id });
                });
                callback(options);
            });
    };

    // get all enclosures of each zone

    return (
        <>
            <Header />
            <main>
                <h3>Evènements</h3>
                <div>
                    <h4>Liste des évènements</h4>
                    <div>
                        <span>Par zone : </span>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadZones}
                            defaultOptions
                            placeholder="Sélectionner la zone"
                            // onChange={onChangeSelectedOption}
                        />
                    </div>
                </div>
                <form action="">Ajouter un évènement</form>
            </main>
        </>
    );
};

export default EvenementsPage;
