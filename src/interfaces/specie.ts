export default interface Specie {
    _id: string;
    name: string;
    sociable: boolean;
    observations?: string[];
    dangerous: boolean;
    enclosure: string;
    createdAt: Date;
    updatedAt: Date;
}
