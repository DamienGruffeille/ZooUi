import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getActionsBySpecie, updateAction } from "../fetchers/actions";
import Action from "../interfaces/action";

type Props = {
    specie: string;
};

const ActionsBlock = ({ specie }: Props) => {
    const [actionsToDisplay, setActionsToDisplay] = useState<Action[]>([]);
    const [actionsDone, setActionsDone] = useState<Action[]>([]);

    const { data: actions, refetch } = useQuery({
        queryKey: ["Actions", specie],
        queryFn: () => getActionsBySpecie(specie),
        enabled: !!specie
    });

    useEffect(() => {
        if (actions) {
            actions
                .filter((action) => action.status === "Planifiée")
                .slice(0, 3)
                .forEach((action) =>
                    setActionsToDisplay((prev) => [...prev, action])
                );

            actions
                .filter((action) => action.status === "Terminée")
                .slice(0, 3)
                .forEach((action) =>
                    setActionsDone((prev) => [...prev, action])
                );
        } else {
            setActionsToDisplay([]);
            setActionsDone([]);
        }
    }, [actions]);

    const handleClick = (e: any) => {
        updateAction(e.target.id);
        setActionsToDisplay([]);
        setActionsDone([]);
        refetch();
    };

    return (
        <li className="container__small">
            <h3>Prochaines actions à réaliser :</h3>
            <ul>
                {actionsToDisplay.length > 0 ? (
                    actionsToDisplay.map((action) => (
                        <li key={action._id}>
                            {action.observation +
                                " " +
                                new Intl.DateTimeFormat("fr-FR", {
                                    dateStyle: "medium",
                                    timeStyle: "medium",
                                    timeZone: "Europe/Paris"
                                }).format(Date.parse(action.plannedDate))}
                            <button
                                id={action._id}
                                onClick={(e) => handleClick(e)}
                            >
                                Terminer
                            </button>
                        </li>
                    ))
                ) : (
                    <li>Aucune action à réaliser</li>
                )}
            </ul>
            <br />
            <h3>Dernières actions réalisées :</h3>
            <ul>
                {actionsDone.length > 0 ? (
                    actionsDone.map((action) => (
                        <li key={action._id}>
                            {action.observation +
                                " " +
                                new Intl.DateTimeFormat("fr-FR", {
                                    dateStyle: "medium",
                                    timeStyle: "medium",
                                    timeZone: "Europe/Paris"
                                }).format(Date.parse(action.updatedAt))}
                        </li>
                    ))
                ) : (
                    <li>Aucune action réalisée</li>
                )}
            </ul>
        </li>
    );
};

export default ActionsBlock;
