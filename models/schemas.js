import { db } from './index.js';

const gradeSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, required: true, min: 0.0 },
    lastModified: { type: Date, required: true }
});

export const Grade = db.mongoose.model('Grade', gradeSchema);