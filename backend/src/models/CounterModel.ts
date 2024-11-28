import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
  _id: string;
  sequence_value: number;
}

const CounterSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  sequence_value: {
    type: Number,
    required: true,
  },
});

const Counter = mongoose.model<ICounter>('Counter', CounterSchema);
export default Counter;
