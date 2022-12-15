import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { feedSpecie } from "../fetchers/postEvent";
import { getLastEvent } from "../fetchers/getEvents";
import Specie from "../interfaces/specie";

type Props = {
    specie: Specie;
};

const SpecieFeeding = ({ specie }: Props) => {
    const [dernierNourrissage, setdernierNourrissage] = useState<string>();

    const { data: nourrissage } = useQuery({
        queryKey: ["FeedEvents", specie],
        queryFn: () => getLastEvent(specie?._id, "Nourrissage"),
        enabled: !!specie
    });

    useEffect(() => {
        setdernierNourrissage(nourrissage?.createdAt);
    }, [nourrissage]);

    const handleFeeding = async () => {
        let event = await feedSpecie(specie._id);
        if (event !== null) {
            setdernierNourrissage(event.createdAt);
        }
    };
    return (
        <div key={"nourrir"} className="enclosureBlock__container__specie">
            <h4>Nourrissage des animaux :</h4>
            <button onClick={handleFeeding}>Nourrir</button>
            <br />
            {dernierNourrissage !== undefined ? (
                <span>Dernier nourrissage : {dernierNourrissage}</span>
            ) : (
                <span>Dernier nourrissage : Pas encore nourri(s)</span>
            )}
        </div>
    );
};

export default SpecieFeeding;
