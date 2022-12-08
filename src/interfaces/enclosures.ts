export default interface Enclosure {
    _id: string;
    name: string;
    zone: string;
    location: any;
    surface_area: number;
    kind?: string;
    minTemperature?: number;
    maxTemperature?: number;
    createdAt: Date;
    updatedAt: Date;
}
