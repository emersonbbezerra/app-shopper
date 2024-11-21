import mongoose, { Document, Schema } from 'mongoose';

export interface IRide extends Document {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: { id: number; name: string };
  value: number;
  createdAt: Date;
}

const rideSchema = new Schema<IRide>(
  {
    customer_id: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: String, required: true },
    driver: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
    },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

const Ride = mongoose.model<IRide>('Ride', rideSchema);

export default Ride;
