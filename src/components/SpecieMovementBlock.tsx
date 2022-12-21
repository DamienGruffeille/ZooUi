import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimalsBySpecy } from "../fetchers/animals";
import Specie from "../interfaces/specie";
import { putSpecieInside, putSpecieOutside } from "../fetchers/postEvent";
import { getLastMovement } from "../fetchers/getEvents";

type Props = {
    specie: Specie;
    childToParent: (action: boolean) => void;
};

const SpecieMovementBlock = ({ specie, childToParent }: Props) => {
    const [notMovingAnimals, setnotMovingAnimals] = useState<string[]>([]);
    const [checkBoxChecked, setCheckBoxChecked] = useState<HTMLInputElement[]>(
        []
    );
    const [didClickMovementButton, setdidClickMovementButton] =
        useState<boolean>(true);
    const [lastEvent, setLastEvent] = useState<string>();
    const [lastPosition, setLastPosition] = useState<string>();

    /** Fetch des animaux appartenant à l'espèce sélectionnée */
    const { data: animals } = useQuery({
        queryKey: ["Animals", specie],
        queryFn: () => fetchAnimalsBySpecy(specie._id),
        enabled: !!specie
    });

    /** Fetch du dernier Event "mouvement" de l'espèce */
    const { data: position } = useQuery({
        queryKey: ["Position", specie],
        queryFn: () => getLastMovement(specie._id, "Entrée", "Sortie"),
        enabled: !!specie
    });

    /** Indication du type et de la date du dernier mouvement enregistré */
    useEffect(() => {
        if (position) {
            setLastEvent(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(position.createdAt))
            );
            setLastPosition(position.eventType);
        }
    }, [position]);

    /** Gestion du tableau des animaux n'ayant pas bougé et du tableau des
     * checkboxes
     */
    const handleAnimalArray = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setnotMovingAnimals((prev) => [...prev, e.target.value]);
            setCheckBoxChecked((prev) => [...prev, e.target]);
        } else {
            setnotMovingAnimals((prev) =>
                prev.filter((animal) => animal !== e.target.value)
            );
            setCheckBoxChecked((prev) =>
                prev.filter((checkBox) => checkBox !== e.target)
            );
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const mouvement = e.target as HTMLButtonElement;
        let event;
        if (mouvement.value === "Sortie") {
            event = await putSpecieOutside(specie._id, notMovingAnimals);
        } else {
            event = await putSpecieInside(specie._id, notMovingAnimals);
        }

        if (event !== null) {
            setLastEvent(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(event.createdAt))
            );
            setLastPosition(event.eventType);
        }

        checkBoxChecked.forEach((checkbox) => (checkbox.checked = false));
        setCheckBoxChecked([]);
        setnotMovingAnimals([]);
        childToParent(didClickMovementButton);
    };

    return (
        <div key={"position"} className="enclosureBlock__container__specie">
            <h4>Modifier position de l'espèce :</h4>
            <br />
            <span>Sélectionnez les animaux n'ayant pas bougé :</span>
            <ul>
                {animals?.map((animal, index) => {
                    return (
                        <li key={index}>
                            <input
                                title="animal"
                                type="checkbox"
                                name={animal.name}
                                value={animal._id}
                                id={`custom-checkbox-${index}`}
                                onChange={(e) => handleAnimalArray(e)}
                            />
                            <label htmlFor={`custom-checkbox-${index}`}>
                                {animal.name}
                            </label>
                        </li>
                    );
                })}
            </ul>
            <br />
            <div>
                Dernier mouvement : {lastPosition}, le {lastEvent}
            </div>
            <br />
            <div
                key={"buttons"}
                className="enclosureBlock__container__specie__btn"
            >
                {" "}
                {lastPosition === "Entrée" ? (
                    <button
                        onClick={handleSubmit}
                        title="sortir"
                        value={"Sortie"}
                    >
                        Sortir
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        title="rentrer"
                        value={"Entrée"}
                    >
                        Rentrer
                    </button>
                )}
            </div>
        </div>
    );
};

export default SpecieMovementBlock;
