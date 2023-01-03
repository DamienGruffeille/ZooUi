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
        }
    };
    return (
        <div key={"nourrir"} className="container__actions__action">
            <h4>Nourrissage des animaux :</h4>
            <br />
            {dernierNourrissage !== undefined ? (
                <span>Dernier nourrissage : {dernierNourrissage}</span>
            ) : (
                <span>Dernier nourrissage : Pas encore nourri(s)</span>
            )}
            <br />
            <button onClick={handleFeeding}>Nourrir</button>
        </div>
    );
};

export default SpecieFeeding;
