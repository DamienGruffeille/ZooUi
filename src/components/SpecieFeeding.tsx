import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { feedSpecie } from "../fetchers/postEvent";
import { getLastEvent } from "../fetchers/getEvents";
import Specie from "../interfaces/specie";

type Props = {
    specie: Specie;
    setEventCreated: Dispatch<SetStateAction<boolean>>;
};

const SpecieFeeding = ({ specie, setEventCreated }: Props) => {
    const [dernierNourrissage, setdernierNourrissage] = useState<string>();

    const { data: nourrissage } = useQuery({
        queryKey: ["FeedEvents", specie],
        queryFn: () => getLastEvent(specie?._id, "Nourrissage"),
        enabled: !!specie
    });

    useEffect(() => {
        if (nourrissage) {
            setdernierNourrissage(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(nourrissage.createdAt))
            );
        }
    }, [nourrissage]);

    const handleFeeding = async () => {
        let event = await feedSpecie(specie._id);
        if (event !== null) {
            setdernierNourrissage(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(event.createdAt))
            );
            setEventCreated(true);
        }
    };
    return (
        <div key={"nourrir"}>
            <h4>Nourrissage des animaux :</h4>
            <br />
            {dernierNourrissage !== undefined ? (
                <span>Dernier nourrissage : {dernierNourrissage}</span>
            ) : (
                <span>Dernier nourrissage : Pas encore nourri(s)</span>
            )}
            <button onClick={handleFeeding}>Nourrir</button>
        </div>
    );
};

export default SpecieFeeding;
