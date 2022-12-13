export default interface Animal {
    _id: string;
    name: string;
    specie: string;
    birth: Date;
    death: Date | null;
    sex: string;
    observations?: Array<string>;
    position: string;
    createdAt: Date;
    updatedAt: Date;
}
