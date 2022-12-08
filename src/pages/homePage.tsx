import { useEffect, useState } from "react";
import EnclosureBlock from "../components/EnclosureBlock";
import Header from "../components/Header";
import Employee from "../interfaces/employee";

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
                    <ul className="enclosures">
                        <EnclosureBlock zone={employee?.zone} />
                    </ul>
                )}
            </main>
        </>
    );
};
export default HomePage;
