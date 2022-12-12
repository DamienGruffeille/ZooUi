import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { fetchSpeciesByZone } from "../fetchers/species";

type EnclosureBlockProps = {
    zone: string;
};

const EnclosureBlock = ({ zone }: EnclosureBlockProps): ReactElement => {
    console.log("Render");

    const {
        isError,
        isLoading,
        data: species,
        error
    } = useQuery({
        queryKey: ["Species"],
        queryFn: () => fetchSpeciesByZone(zone)
    });

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
            {species?.map((specie) => {
                return (
                    <li key={specie.enclosure.name} className="enclosureBlock">
                        <h3>{specie.enclosure.name}</h3>
                        <div className="enclosureBlock__specie">
                            <h4>{specie.name}</h4>
                        </div>
                    </li>
                );
            })}
        </>
    );
};

export default EnclosureBlock;
