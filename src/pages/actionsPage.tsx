import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getNextAction, updateAction } from "../fetchers/actions";
import Action from "../interfaces/action";
import Employee from "../interfaces/employee";

const ActionsPage = () => {
    const employeeLocalStorage = localStorage.getItem("employee");
    const [employeeZone, setEmployeeZone] = useState<string>("");
    const [employeeFullName, setEmployeeFullName] = useState<string>("");
    const [employeeName, setEmployeeName] = useState<string>("");
    const [actionToDisplay, setActionToDisplay] = useState<any>();

    /** Récupère l'employé stocké dans localStorage pour définir la zone à laquelle il a accès */
    useEffect(() => {
        if (employeeLocalStorage) {
            const employee: Employee = JSON.parse(employeeLocalStorage);
            setEmployeeZone(employee.zone);
            setEmployeeFullName(employee.firstName + " " + employee.name);
            setEmployeeName(employee.name);
        }
    }, [employeeLocalStorage]);

    const { data: nextAction } = useQuery({
        queryKey: ["Next Action"],
        queryFn: () => getNextAction(employeeName),
        enabled: !!employeeName
    });

    useEffect(() => {
        if (nextAction !== undefined && nextAction !== null)
            setActionToDisplay(nextAction.action);
    }, [nextAction]);

    const handleClick = async () => {
        const resp = await updateAction(nextAction.action._id);
        console.log(resp);
        // setActionToDisplay(resp.action);
        // console.log("Resp : " + resp);
        // const _nextAction = await getNextAction(employeeName);
        // console.log("Next Action : " + _nextAction);
    };

    useEffect(() => {
        console.log("Action to Display : " + actionToDisplay);
    }, [actionToDisplay]);

    return (
        <>
            <Header />
            <main>
                <div className="actions__next">
                    <h4>Prochaine Action</h4>
                    <br />
                    {actionToDisplay !== undefined &&
                    actionToDisplay !== null ? (
                        <>
                            Statut : {actionToDisplay.status}
                            <br />
                            Date prévue : {actionToDisplay.plannedDate}
                            <br />
                            Enclos : {actionToDisplay.enclosure}
                            <br />
                            Espèce : {actionToDisplay.specie}
                            <br />
                            Animal : {actionToDisplay.animal}
                            <br />
                            Observation : {actionToDisplay.observation}
                            <br />
                            <button onClick={handleClick}>Terminer</button>
                        </>
                    ) : (
                        <span>Aucun évènement à venir</span>
                    )}
                </div>
            </main>
        </>
    );
};

export default ActionsPage;
