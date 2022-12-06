import { useEffect, useState } from "react";
import EnclosureBlock from "../components/EnclosureBlock";
import Header from "../components/Header";

export interface Employee {
    _id: string;
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: string;
    zone: string;
    createdAt: Date;
    updatedAt: Date;
}

const HomePage = () => {
    /** Récupération des zones de l'employé */
    const [employee, setEmployee] = useState<Employee>();
    const employeeLocalStorage = localStorage.getItem("employee");

    useEffect(() => {
        if (employeeLocalStorage) {
            setEmployee(JSON.parse(employeeLocalStorage));
        }
    }, [employeeLocalStorage]);

    // get enclosures from zone

    // get specy by enclosure
    return (
        <>
            <Header />

            <main>
                {employee === null || employee === undefined ? (
                    <ul></ul>
                ) : (
                    <ul>
                        <li className="specieBlock" key={employee?._id}>
                            <EnclosureBlock zone={employee?.zone} />
                        </li>
                    </ul>
                )}
            </main>
        </>
    );
};
export default HomePage;
