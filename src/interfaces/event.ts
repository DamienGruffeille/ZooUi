import Enclosure from "../interfaces/enclosures";
export default interface Event {
    _id: string;
    createdBy: string;
    enclosure: string;
    specie: string;
    animal: string[];
    eventType: string;
    observations?: string[];
    createdAt: string;
    updatedAt: Date;
}
