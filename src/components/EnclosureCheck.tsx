import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getLastEvent } from "../fetchers/getEvents";
import { checkEnclosure } from "../fetchers/postEvent";
import Specie from "../interfaces/specie";
import Employee from "../interfaces/employee";

type Props = {
    specie: Specie;
};

const EnclosureCheck = ({ specie }: Props) => {
    /** Récupération des zones de l'employé */
    const employeeLocalStorage = localStorage.getItem("employee");

    const [employee, setEmployee] = useState<Employee>();
    const [derniereVerif, setDerniereVerif] = useState<string>();

    useEffect(() => {
        if (employeeLocalStorage) {
            setEmployee(JSON.parse(employeeLocalStorage));
        }
    }, [employeeLocalStorage]);

    const { data: verif } = useQuery({
        queryKey: ["verification", specie],
        queryFn: () => getLastEvent(specie?._id, "Vérification"),
        enabled: !!specie
    });

    useEffect(() => {
        if (verif) {
            setDerniereVerif(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(verif.createdAt))
            );
        } else {
            setDerniereVerif("Enclos jamais vérifié");
        }
    }, [verif]);

    const handleClick = async () => {
        let event = await checkEnclosure(specie.enclosure._id);
        console.log(event);
        if (event !== null) {
            setDerniereVerif(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(event.createdAt))
            );
        }
    };

    return (
        <div>
            <h4>Vérification de l'enclos :</h4>
            <span>Dernière vérification le : {derniereVerif}</span>
            {employee?.role === "Vétérinaire" ||
            employee?.role === "Responsable" ? (
                <button onClick={handleClick}>Enclos vérifié</button>
            ) : (
                <button onClick={handleClick} disabled>
                    Vérifier
                </button>
            )}
        </div>
    );
};

export default EnclosureCheck;
