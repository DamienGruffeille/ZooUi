import { useQuery } from "@tanstack/react-query";

import Specie from "../interfaces/specie";
import { fetchAnimalsBySpecy } from "../fetchers/animals";
import { useEffect, useState } from "react";

type Props = {
    specie: Specie;
    data: boolean | undefined;
};

const AnimalsBlock = ({ specie, data }: Props) => {
    const { data: animals, refetch } = useQuery({
        queryKey: ["Animals", specie],
        queryFn: () => fetchAnimalsBySpecy(specie._id),
        enabled: !!specie
    });

    useEffect(() => {
        if (data) {
            console.log("Un bouton mouvement a été activé : " + data);
            refetch();
        }
    }, [data, refetch]);

    return (
        <div className="enclosureBlock">
            <ul>
                {animals?.map((animal) => {
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
                })}
            </ul>
        </div>
    );
};

export default AnimalsBlock;
