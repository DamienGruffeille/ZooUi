import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { updateAction } from "../fetchers/actions";
import Action from "../interfaces/action";

type Props = {
    actions: Action[];
    setActionClosed: Dispatch<SetStateAction<boolean>>;
    setNumberOfActionsToDoToday: Dispatch<SetStateAction<number>>;
};

const ActionsToDoBlock = ({
    actions,
    setActionClosed,
    setNumberOfActionsToDoToday
}: Props) => {
    const [actionsOfToday, setActionsOfToday] = useState<Action[]>([]);

    const handleCloseAction = async (e: any) => {
        const actionToClose = e.target.value;

        await updateAction(actionToClose);

        setActionClosed(true);
    };

    useEffect(() => {
        const today = new Date();

        const beginningOfToday = today.setHours(0, 0, 0, 0);
        const endOfToday = today.setHours(23, 59, 59, 59);

        let actionsToDoToday: Action[] = [];

        actions
            ?.filter(
                (action) =>
                    action.status === "Planifiée" &&
                    Date.parse(action.plannedDate) <= endOfToday &&
                    Date.parse(action.plannedDate) >= beginningOfToday
            )
            .forEach((action) => {
                actionsToDoToday.push(action);
            });

        setActionsOfToday(actionsToDoToday);
        setNumberOfActionsToDoToday(actionsToDoToday.length);
    }, [actions, setNumberOfActionsToDoToday]);

    return (
        <div className="bottom-action-container">
            <h3>Action(s) du jour</h3>

            <br />
            <ul>
                {actionsOfToday ? (
                    actionsOfToday.map((action) => {
                        return (
                            <li key={action._id}>
                                {" "}
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
                                        onClick={(e) => handleCloseAction(e)}
                                    >
                                        Terminer
                                    </button>
                                </>
                            </li>
                        );
                    })
                ) : (
                    <li key={"noaction"}>
                        Aucune action à effectuer aujourd'hui
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ActionsToDoBlock;
