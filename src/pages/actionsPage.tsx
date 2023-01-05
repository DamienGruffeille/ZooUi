import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ActionNextBlock from "../components/ActionNextBlock";
import ActionsRecapBlock from "../components/ActionsRecapBlock";
import { getActionsByEmployee } from "../fetchers/actions";
import Employee from "../interfaces/employee";
import ActionsLateBlock from "../components/ActionsLateBlock";
import ActionsToDoBlock from "../components/ActionsToDoBlock";

const ActionsPage = () => {
    const employeeLocalStorage = localStorage.getItem("employee");
    const [employeeName, setEmployeeName] = useState<string>("");
    const [actionClosed, setActionClosed] = useState<boolean>(false);
    const [numberOfActionsToDoToday, setNumberOfActionsToDoToday] =
        useState<number>(0);
    const [numberOfActionsLate, setNumberOfActionsLate] = useState<number>(0);

    /** Récupère l'employé stocké dans localStorage pour définir la zone à laquelle il a accès */
    useEffect(() => {
        if (employeeLocalStorage) {
            const employee: Employee = JSON.parse(employeeLocalStorage);

            setEmployeeName(employee.name);
        }
    }, [employeeLocalStorage]);

    const { data: actions, refetch } = useQuery({
        queryKey: ["Actions", employeeName],
        queryFn: () => getActionsByEmployee(employeeName),
        enabled: !!employeeName
    });

    useEffect(() => {
        if (actionClosed) refetch();
        setActionClosed(false);
    }, [actionClosed, refetch]);

    return (
        <>
            <Header />
            <main>
                {actions && (
                    <>
                        <div className="upper-action-container">
                            <ActionsRecapBlock
                                actions={actions}
                                actionClosed={actionClosed}
                                numberOfActionsToDoToday={
                                    numberOfActionsToDoToday
                                }
                                numberOfActionsLate={numberOfActionsLate}
                            />
                            <ActionNextBlock
                                employeeName={employeeName}
                                actionClosed={actionClosed}
                                setActionClosed={setActionClosed}
                            />
                        </div>
                        <ActionsLateBlock
                            actions={actions}
                            setActionClosed={setActionClosed}
                            setNumberOfActionsLate={setNumberOfActionsLate}
                        />
                        <ActionsToDoBlock
                            actions={actions}
                            setActionClosed={setActionClosed}
                            setNumberOfActionsToDoToday={
                                setNumberOfActionsToDoToday
                            }
                        />
                    </>
                )}
            </main>
        </>
    );
};

export default ActionsPage;
