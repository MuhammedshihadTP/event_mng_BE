import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  type: { type: String, enum: ['global', 'private'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  timing: { type: String, enum: ['before', 'after'], required: true },
  offset: { type: Number, required: true },
});

export default mongoose.model('Task', taskSchema);