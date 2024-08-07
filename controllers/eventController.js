const Event = require('../models/Event');
const Member = require('../models/Member');

// when creating an event, date and time must be in String format (date = MM/DD/YYY, time = HH:MM AM/PM) and NOT Date Object format !!!
const createEvent = async (req, res) => {
    const { name, date, venue, time, projectHeadID } = req.body;

    // Confirm required fields
    if (!name || !date || !venue || !time || !projectHeadID) {
        return res.status(400).json({ 'message': 'All credentials are required', 'data': req.body });
    }

    try {
        // Find the last event and sort by eventID descending
        const lastEvent = await Event.findOne().sort({ 'eventID': -1 }).exec();

        let newEventID = 1; // Default to 1 if no events exist

        if (lastEvent) {
            newEventID = lastEvent.eventID + 1;
        }

        // Create new event
        const event = await Event.create({
            eventID: newEventID,
            name: name,
            date: date,
            venue: venue,
            time: time,
            projectHeadID: projectHeadID
        });

        res.send(`
            <script>
                window.location.href = '/';
                alert('New event created!');
            </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
}


const readEvent = async (eventID) => {
    try {
        const matchingEvent = await Event.findOne({ eventID: eventID }).exec();
        return matchingEvent;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding event');
    }
}

const getEventAttendance = async (id) => {
    const event = await Event.findOne({ eventId: id }).lean();
    const attendanceList = await Member.find({ studentId: { $in: event.attendance_list } }).lean();
    return attendanceList;
};

const readAllEvents = async(req, res) => {
    try{
        const matchingEvents = await Event.find({}).lean().exec();

        return matchingEvents;

    }catch(error){
        res.status(500).json({message: 'error finding events'});
    }
}

const updateEvent = async(req, res) => {
    const { editedEventData, eventID } = req.body;

    try{
        const updatedEvent = await Event.findOneAndUpdate({ eventID: eventID }, {
          $set: {
            date: editedEventData['event-date'],
            venue: editedEventData['event-venue'],
            time: editedEventData['event-time'],
            attendeeCount: parseInt(editedEventData['event-attendee-count'], 10),
            projectHeadID: parseInt(editedEventData['event-project-head'], 10),
          }
        }, {new: true}
        );
        
        if (!updatedEvent) { // didn't find event
          return res.status(404).json({ message: 'event not found' });
        }
        res.status(200).json({event:updatedEvent});
    }catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const deleteEvent = async(req, res) => {
    const {eventID} = req.body;

    try{
        const eventDelete = await Event.findOneAndDelete({eventID});

        if (eventDelete){
            return res.status(200).json({ message : 'event deleted successfuly'});
        } else{
            return res.status(404).json({ message : 'event not found'});
        }

    }catch(error){
        res.status(500).json({message: 'error deleting event'});
    }

}

module.exports = { createEvent, readEvent, readAllEvents, updateEvent, deleteEvent, getEventAttendance };