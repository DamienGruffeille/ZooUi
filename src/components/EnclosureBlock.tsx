import { ReactElement } from "react";

type EnclosureBlockProps = {
    zone: string;
};

const EnclosureBlock = ({ zone }: EnclosureBlockProps): ReactElement => {
    // Si zone spécifiques, select(enclos) where zone = zone

    // Si zone = toutes => récupérer tous les enclos

    return <div>{zone}</div>;
};

export default EnclosureBlock;
