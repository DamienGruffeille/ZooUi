import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimalsBySpecy } from "../fetchers/animals";
import Specie from "../interfaces/specie";
import { putSpecieInside, putSpecieOutside } from "../fetchers/postEvent";

type Props = {
    specie: Specie;
};

const SpecieMovementBlock = ({ specie }: Props) => {
    const [notMovingAnimals, setnotMovingAnimals] = useState<string[]>([]);
    const [checkBoxChecked, setCheckBoxChecked] = useState<HTMLInputElement[]>(
        []
    );

    const { data: animals } = useQuery({
        queryKey: ["Animals", specie],
        queryFn: () => fetchAnimalsBySpecy(specie?._id),
        enabled: !!specie
    });

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

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(notMovingAnimals);
        console.log(checkBoxChecked);
        console.log("Bouton déclenché");
        const mouvement = e.target as HTMLButtonElement;
        if (mouvement.value === "Sortie") {
            putSpecieOutside(specie._id, notMovingAnimals);
        } else {
            putSpecieInside(specie._id, notMovingAnimals);
        }

        checkBoxChecked.forEach((checkbox) => (checkbox.checked = false));
        setCheckBoxChecked([]);
        setnotMovingAnimals([]);
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
                                // checked={checkedAnimals[index]}
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
            <div
                key={"buttons"}
                className="enclosureBlock__container__specie__btn"
            >
                <button onClick={handleSubmit} title="rentrer" value={"Entrée"}>
                    Rentrer
                </button>
                <button onClick={handleSubmit} title="sortir" value={"Sortie"}>
                    Sortir
                </button>
            </div>
        </div>
    );
};

export default SpecieMovementBlock;
