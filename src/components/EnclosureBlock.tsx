import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { fetchEnclosuresByZone } from "../fetchers/enclosures";
import Enclosure from "../interfaces/enclosures";
import Specie from "../interfaces/specie";
import { fetchSpecieByEnclosure } from "../fetchers/species";

type EnclosureBlockProps = {
    zone: string;
};

const EnclosureBlock = ({ zone }: EnclosureBlockProps): ReactElement => {
    console.log("Render");

    const { data: species } = useQuery({
        queryKey: ["Species"],
        queryFn: () => fetchSpecieByEnclosure()
    });

    console.log(species);

    return (
        <>
            {species?.forEach((specie) => {
                // console.log(specie);
                // console.log(specie.enclosure);
                // const enclosure = specie.enclosure.zone;
                // console.log(enclosure);
                return (
                    <li className="enclosure" key={specie.enclosure._id}>
                        <h4>{specie.enclosure.name}</h4>
                    </li>
                );
            })}
        </>
    );
};

export default EnclosureBlock;
