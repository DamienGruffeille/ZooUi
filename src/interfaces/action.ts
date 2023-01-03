import Animal from "./animal";
import Enclosure from "./enclosures";
import Specie from "./specie";

export default interface Action {
    createdBy: object;
    enclosure: Enclosure;
    specie: Specie;
    animal: Animal;
    plannedDate: Date;
    status: string;
    observation: string;
}
