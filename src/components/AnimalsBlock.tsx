import { useQuery } from "@tanstack/react-query";

import Specie from "../interfaces/specie";
import { fetchAnimalsBySpecy } from "../fetchers/animals";
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

    return (
        <div className="enclosureBlock">
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
                                <span>{animal.position}</span>
                                <span>{animal.observations}</span>
                                <button>
                                    {animal.position === "Dehors"
                                        ? "Rentrer"
                                        : "Sortir"}
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default AnimalsBlock;
