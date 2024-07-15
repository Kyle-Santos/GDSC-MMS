const Event = require('../models/Event');

// when creating an event, date and time must be in String format (date = MM/DD/YYY, time = HH:MM AM/PM) and NOT Date Object format !!!
const eventCreate = async(req, res) => {
    const {date, venue, time, projectHeadID} = req.body;

    // confirm required fields
    if( !date || !venue ||!time || !projectHeadID) return res.status(400).json({'message': 'All credentials are required', 'data': req.body });

    try{
        const lastID = await Event.findOne({},{},{sort: {'eventID': -1}}).exec();

        if (lastID){
            newEventID = lastID.eventID + 1;
        }

        await Event.create({
            eventID: newEventID,
            date: date,
            venue: venue,
            time: time,
            projectHeadID: projectHeadID
        });

        res.status(201).json({ 'success' : `New event created!`});

    }catch(error){
        res.status(500).json({message: 'error creating event'});
    }

}

const eventRead = async(req, res) => {
    const {eventID} = req.body;

    try{
        const matchingEvent = await Event.findOne({eventID: eventID}).exec();

        res.status(201).json(matchingEvent);

    }catch(error){
        res.status(500).json({message: 'error finding event'});
    }

}

const eventUpdate = async(req, res) => {
    const {eventID, editedEventData} = req.body;
    
    try{
        const updatedEvent = await Event.findOneAndUpdate({eventID}, {
          $set: {
            date: editedEventData.date,
            venue: editedEventData.venue,
            time: editedEventData.time,
            projectHeadID: editedEventData.projectHeadID,
          }
        }, {new: true}
        );
        
        if (!updatedevent) { // didn't find event
          return res.status(404).json({ message: 'event not found' });
        }
        res.status(200).json({event:updatedevent});
    }catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const eventDelete = async(req, res) => {
    const {eventID} = req.body;

    try{
        const eventDelete = await event.findOneAndDelete({eventID});

        if (eventDelete){
            return res.status(200).json({ message : 'event deleted successfuly'});
        } else{
            return res.status(404).json({ message : 'event not found'});
        }

    }catch(error){
        res.status(500).json({message: 'error deleting event'});
    }

}

module.exports = { eventCreate, eventRead, eventUpdate, eventDelete };