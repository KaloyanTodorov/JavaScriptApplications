const eventsServise = (() => {

    function createEvent(name, dateTime, description, imageURL, organizer) {
        const data = {
            name, 
            dateTime, 
            description, 
            imageURL,
            organizer,
            interested: Number(0)
        }
        return kinvey.post('appdata', 'events', 'kinvey', data);
    }

    function getAllEvents() {
        return kinvey.get('appdata', 'events?query={}&sort={"interested": -1}', 'kinvey');
    }

    function getEventById(id) {
        return kinvey.get('appdata', `events/${id}`, 'kinvey');
    }

    function editEvent(id, name, dateTime, description, imageURL, organizer, interested ){
        const data = {
            name, 
            dateTime, 
            description, 
            imageURL, 
            organizer, 
            interested
        }
        return kinvey.update('appdata', `events/${id}`, 'kinvey', data);
    }

    function deleteEvent(id) {
        return kinvey.remove('appdata', `events/${id}`, 'kinvey');
    }

    function joinEvent(id, name, dateTime, description, imageURL, organizer, interested) {
        const data = {
            name, 
            dateTime, 
            description, 
            imageURL, 
            organizer, 
            interested 
        }
        return kinvey.update('appdata', `events/${id}`, 'kinvey', data);
    }

    return {
        createEvent,
        getAllEvents,
        getEventById,
        editEvent,
        deleteEvent,
        joinEvent
    }
})();