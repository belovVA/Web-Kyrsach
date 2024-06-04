const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: String,
    photoUrl: String, 
    description: String,
    date: Date,
    location: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: false },
    moderationStatus: {
      type: String,
      enum: ['Watching', 'Accepted', 'Canceled'],
      default: 'Watching'
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
