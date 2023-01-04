import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getEventsBySpecie } from "../fetchers/getEvents";
import IEvent from "../interfaces/event";

type Props = {
    specie: string;
    eventCreated: boolean | undefined;
    setEventCreated: Dispatch<SetStateAction<boolean>>;
};

const EventsBlock = ({ specie, eventCreated, setEventCreated }: Props) => {
    const [eventsToDisplay, setEventsToDisplay] = useState<IEvent[]>([]);

    const { data: events, refetch } = useQuery({
        queryKey: ["Events", specie],
        queryFn: () => getEventsBySpecie(specie),
        enabled: !!specie
    });

    useEffect(() => {
        if (events) {
            setEventsToDisplay(events.slice(0, 6));
        } else {
            setEventsToDisplay([]);
        }
    }, [events]);

    useEffect(() => {
        if (eventCreated) {
            refetch();
            setEventCreated(false);
        }
    }, [eventCreated, refetch, setEventCreated]);

    return (
        <div className="upper-container__inside">
            <h3>Derniers evènements :</h3>
            <ul>
                {eventsToDisplay.length > 0 ? (
                    eventsToDisplay.map((event) => (
                        <li key={event._id}>
                            {event.eventType +
                                " le " +
                                new Intl.DateTimeFormat("fr-FR", {
                                    dateStyle: "medium",
                                    timeStyle: "medium",
                                    timeZone: "Europe/Paris"
                                }).format(Date.parse(event.createdAt))}
                        </li>
                    ))
                ) : (
                    <li>Aucun évènement à afficher</li>
                )}
            </ul>
        </div>
    );
};

export default EventsBlock;
