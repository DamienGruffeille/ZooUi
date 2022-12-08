import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { fetchSpecieByEnclosure } from "../fetchers/species";
import Specie from "../interfaces/specie";

type SpecieBlockProps = {
    enclos: string;
};

const SpecieBlock = ({ enclos }: SpecieBlockProps): ReactElement => {
    const { isError, isLoading, data, error } = useQuery({
        queryKey: ["Species"],
        queryFn: () => fetchSpecieByEnclosure(enclos),
        enabled: true
    });

    console.log(data);

    if (isLoading) {
        console.log("Loading...");
        return <div>Loading...</div>;
    }

    if (isError) {
        console.log("Error: ", error);
        return <div>Error...</div>;
    }

    return (
        <>
            {data.map((specie: Specie) => {
                console.log(specie._id);
                return (
                    <div className="specieBlock" key={specie._id}>
                        <div className="specieName">{specie.name}</div>
                        <button>Nourrir</button>
                        <button>Stimuler</button>
                    </div>
                );
            })}
        </>
    );
};

export default SpecieBlock;
