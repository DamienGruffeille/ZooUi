import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { stimulateSpecie } from "../fetchers/postEvent";
import { getLastEvent } from "../fetchers/getEvents";
import Specie from "../interfaces/specie";

type Props = {
    specie: Specie;
};

const SpecieStimulation = ({ specie }: Props) => {
    const [derniereStimulation, setderniereStimulation] = useState<string>();

    const { data: stimulation } = useQuery({
        queryKey: ["StimEvents", specie],
        queryFn: () => getLastEvent(specie?._id, "Stimulation"),
        enabled: !!specie
    });

    useEffect(() => {
        if (stimulation) {
            setderniereStimulation(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(stimulation?.createdAt))
            );
        }
    }, [stimulation]);

    const handleStimulation = async () => {
        let event = await stimulateSpecie(specie._id);
        if (event !== null) {
            setderniereStimulation(
                new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                    timeZone: "Europe/Paris"
                }).format(Date.parse(event.createdAt))
            );
        }
    };

    return (
        <div key={"stimuler"} className="enclosureBlock__container__specie">
            <h4>Stimulation des animaux :</h4>
            <br />
            {derniereStimulation !== undefined ? (
                <span>Dernière stimulation : {derniereStimulation}</span>
            ) : (
                <span>Dernière stimulation : Pas encore stimulé</span>
            )}
            <br />
            <button onClick={handleStimulation}>Stimuler</button>
        </div>
    );
};

export default SpecieStimulation;
