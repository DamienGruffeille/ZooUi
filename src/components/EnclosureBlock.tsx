import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { fetchEnclosuresByZone } from "../fetchers/enclosures";
import Enclosure from "../interfaces/enclosures";

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
            {data.map((enclosure: Enclosure) => {
                return (
                    <li className="specieBlock" key={enclosure?._id}>
                        <h4>{enclosure?.name}</h4>
                    </li>
                );
            })}
        </>
    );
};

export default EnclosureBlock;
