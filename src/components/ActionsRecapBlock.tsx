import { useEffect, useState } from "react";
import Action from "../interfaces/action";

type Props = {
    actions: Action[];
    actionClosed: boolean;
    numberOfActionsToDoToday: number;
    numberOfActionsLate: number;
};

const ActionsRecapBlock = ({
    actions,
    actionClosed,
    numberOfActionsToDoToday,
    numberOfActionsLate
}: Props) => {
    const [actionsDoneToday, setActionsDoneToday] = useState<Action[]>([]);

    useEffect(() => {
        let actionsDoneToday: Action[] = [];
        const today = new Date();

        const beginningOfToday = today.setHours(0, 0, 0, 0);
        const endOfToday = today.setHours(23, 59, 59, 59);

        actions
            ?.filter(
                (action) =>
                    Date.parse(action.updatedAt) >= beginningOfToday &&
                    Date.parse(action.updatedAt) <= endOfToday &&
                    action.status === "Terminée"
            )
            .forEach((action) => {
                actionsDoneToday.push(action);
            });

        setActionsDoneToday(actionsDoneToday);
    }, [actions]);

    return (
        <>
            <div className="upper-action-container__element">
                <h3>Récapitulatif des actions</h3>
                <span>Vous avez {numberOfActionsLate} action(s) en retard</span>
                <br />
                <span>
                    Vous avez {numberOfActionsToDoToday} action(s) prévue(s)
                    aujourd'hui
                </span>
                <br />
                <span>
                    Vous avez terminé {actionsDoneToday.length} action(s)
                    aujourd'hui
                </span>
            </div>
        </>
    );
};

export default ActionsRecapBlock;
