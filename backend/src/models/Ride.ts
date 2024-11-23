import mongoose, { Document, Schema } from 'mongoose';

export interface IRide extends Document {
  customerId: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

const rideSchema = new Schema<IRide>(
  {
    customerId: { type: String, required: true },
    origin: {
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
    },
    destination: {
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
    },
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
