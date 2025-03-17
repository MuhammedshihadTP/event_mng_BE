import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  tasks: [
    {
      task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
      duration: { type: Number },
    },
  ],
});

export default mongoose.model('Event', eventSchema);