import { useQuery } from "@tanstack/react-query";

import Specie from "../interfaces/specie";
import {
    fetchAnimalsBySpecy,
    putAnimalInside,
    putAnimalOutside
} from "../fetchers/animals";
import { Dispatch, SetStateAction, useEffect } from "react";

type Props = {
    specie: Specie;
    data: boolean | undefined;
    setter: Dispatch<SetStateAction<boolean | undefined>>;
};

const AnimalsBlock = ({ specie, data, setter }: Props) => {
    const {
        data: animals,
        refetch,
        isLoading
    } = useQuery({
        queryKey: ["Animals", specie],
        queryFn: () => fetchAnimalsBySpecy(specie._id),
        enabled: !!specie
    });

    useEffect(() => {
        if (data) {
            console.log(
                "Child component : Un bouton mouvement a été activé : " + data
            );
            refetch();
            setter(false);
        }
    }, [setter, refetch, data]);

    const handleMovement = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        console.log("Animal à bouger : " + target.value);
        const animalId = target.value;
        if (target.innerHTML === "Sortir") {
            await putAnimalOutside(animalId);
        } else {
            await putAnimalInside(animalId);
        }
        refetch();
    };

    return (
        <div className="animalsBlock">
            <ul>
                {isLoading ? (
                    <li>Loading...</li>
                ) : (
                    animals?.map((animal) => {
                        return (
                            <li key={animal._id}>
                                <span>{animal.name}</span>
                                <br />
                                <span>Sexe : {animal.sex}</span>
                                <br />
                                <label>
                                    Observations :
                                    <br />
                                    <textarea
                                        name="observations"
                                        id="observations"
                                        disabled
                                        value={animal.observations}
                                    ></textarea>
                                </label>
                                <br />
                                <div className="animalPosition">
                                    <span>Position : {animal.position}</span>
                                    <button
                                        onClick={handleMovement}
                                        value={animal._id}
                                    >
                                        {animal.position === "Dehors"
                                            ? "Rentrer"
                                            : "Sortir"}
                                    </button>
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default AnimalsBlock;
