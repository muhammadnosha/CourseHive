import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  // Add registrationLink, speaker, etc.
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

export default Event;
