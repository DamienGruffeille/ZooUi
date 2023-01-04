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
    setEventCreated: Dispatch<SetStateAction<boolean>>;
};

const AnimalsBlock = ({ specie, data, setter, setEventCreated }: Props) => {
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
            refetch();
            setter(false);
        }
    }, [setter, refetch, data]);

    const handleMovement = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        const animalId = target.value;

        if (target.innerHTML === "Sortir") {
            await putAnimalOutside(animalId);
        } else {
            await putAnimalInside(animalId);
        }

        refetch();

        setEventCreated(true);
    };

    return (
        <>
            <h3 className="bottom-container__title">Animaux</h3>
            <ul className="bottom-container__list">
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
        </>
    );
};

export default AnimalsBlock;
