import { db } from './index.js';

const schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

const gradeSchema = new db.mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    value: { 
        type: Number, 
        required: true, 
        validate(value) {
            if (value < 0) {
                throw new Error("Nota não pode ser negativa");
            }
        }
    },
    lastModified: { type: Date, default: Date.now }
}, schemaOptions);

gradeSchema.virtual('id').get(function() {
    return this._id;
});

export const Grade = db.mongoose.model('Grade', gradeSchema);