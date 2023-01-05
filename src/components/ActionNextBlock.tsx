import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getNextAction, updateAction } from "../fetchers/actions";
import Action from "../interfaces/action";

type Props = {
    employeeName: string;
    actionClosed: boolean;
    setActionClosed: Dispatch<SetStateAction<boolean>>;
};

const ActionNextBlock = ({
    employeeName,
    actionClosed,
    setActionClosed
}: Props) => {
    const [actionToDisplay, setActionToDisplay] = useState<Action | null>();

    const { data: nextAction, refetch } = useQuery({
        queryKey: ["Next Action"],
        queryFn: () => getNextAction(employeeName),
        enabled: !!employeeName
    });

    useEffect(() => {
        if (nextAction !== undefined && nextAction !== null)
            setActionToDisplay(nextAction.action);
    }, [nextAction]);

    const handleClick = async () => {
        if (actionToDisplay) {
            await updateAction(actionToDisplay._id);
        }
        setActionToDisplay(null);
        setActionClosed(true);
        // refetch();
    };

    useEffect(() => {
        if (actionClosed) refetch();
    });

    return (
        <div className="upper-action-container__element">
            <h3>Prochaine Action</h3>
            {actionToDisplay !== undefined && actionToDisplay !== null ? (
                <>
                    <div>
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
                    </div>
                </>
            ) : (
                <span>Aucun évènement à venir</span>
            )}
        </div>
    );
};

export default ActionNextBlock;
