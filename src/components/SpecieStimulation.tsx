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
        setderniereStimulation(stimulation?.createdAt);
    }, [stimulation]);

    const handleStimulation = async () => {
        let event = await stimulateSpecie(specie._id);
        if (event !== null) {
            setderniereStimulation(event.createdAt);
        }
    };

    return (
        <div key={"stimuler"} className="enclosureBlock__container__specie">
            <h4>Stimulation des animaux :</h4>
            <button onClick={handleStimulation}>Stimuler</button>
            <br />
            {derniereStimulation !== undefined ? (
                <span>Dernière stimulation : {derniereStimulation}</span>
            ) : (
                <span>Dernière stimulation : Pas encore stimulé</span>
            )}
        </div>
    );
};

export default SpecieStimulation;
