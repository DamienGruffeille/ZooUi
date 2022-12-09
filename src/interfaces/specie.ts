import Enclosure from "./enclosures";

export default interface Specie {
    _id: string;
    name: string;
    sociable: boolean;
    observations?: string[];
    dangerous: boolean;
    enclosure: Enclosure;
    createdAt: Date;
    updatedAt: Date;
}
