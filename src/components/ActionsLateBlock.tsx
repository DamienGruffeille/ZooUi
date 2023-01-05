import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { updateAction } from "../fetchers/actions";
import Action from "../interfaces/action";

type Props = {
    actions: Action[];
    setActionClosed: Dispatch<SetStateAction<boolean>>;
    setNumberOfActionsLate: Dispatch<SetStateAction<number>>;
};

const ActionsLateBlock = ({
    actions,
    setActionClosed,
    setNumberOfActionsLate
}: Props) => {
    const [actionsLate, setActionsLate] = useState<Action[]>([]);

    const handleCloseAction = async (e: any) => {
        const actionToClose = e.target.value;

        await updateAction(actionToClose);

        setActionClosed(true);
    };

    useEffect(() => {
        const today = new Date();
        const beginningOfToday = today.setHours(0, 0, 0, 0);

        let actionsToDoLate: Action[] = [];

        actions
            .filter(
                (action) =>
                    action.status === "Planifiée" &&
                    Date.parse(action.plannedDate) < beginningOfToday
            )
            .forEach((action) => {
                actionsToDoLate.push(action);
            });

        setActionsLate(actionsToDoLate);
        setNumberOfActionsLate(actionsToDoLate.length);
    }, [actions, setNumberOfActionsLate]);

    return (
        <div className="middle-action-container">
            <h3>Action(s) en retard</h3>

            <br />
            <ul>
                {actionsLate.length > 0 ? (
                    <>
                        {actionsLate.map((action) => {
                            return (
                                <li key={action._id}>
                                    <>
                                        Statut : {action.status}
                                        <br />
                                        Date prévue : {action.plannedDate}
                                        <br />
                                        Enclos : {action.enclosure}
                                        <br />
                                        Espèce : {action.specie}
                                        <br />
                                        Animal : {action.animal}
                                        <br />
                                        Observation : {action.observation}
                                        <br />
                                        <button
                                            value={action._id}
                                            onClick={(e) =>
                                                handleCloseAction(e)
                                            }
                                        >
                                            Terminer
                                        </button>
                                    </>
                                </li>
                            );
                        })}
                    </>
                ) : (
                    <li>Aucune action en retard</li>
                )}
            </ul>
        </div>
    );
};

export default ActionsLateBlock;
