import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { fetchEnclosuresByZone } from "../fetchers/enclosures";
import Enclosure from "../interfaces/enclosures";
import SpecieBlock from "../components/SpecieBlock";

type EnclosureBlockProps = {
    zone: string;
};

const EnclosureBlock = ({ zone }: EnclosureBlockProps): ReactElement => {
    console.log("Render");

    const { isError, isLoading, data, error } = useQuery({
        queryKey: ["Enclosures"],
        queryFn: () => fetchEnclosuresByZone(zone),
        enabled: true
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
            {data.map((enclosure: Enclosure) => {
                console.log(enclosure);
                return (
                    <li className="enclosureBlock" key={enclosure?._id}>
                        <h4>{enclosure?.name}</h4>
                        <SpecieBlock enclos={enclosure._id} />
                    </li>
                );
            })}
        </>
    );
};

export default EnclosureBlock;
