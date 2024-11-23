import mongoose, { Document, Schema } from 'mongoose';
import { IDriver } from './Driver';

export interface IRide extends Document {
  origin: {
    latitude: string;
    longitude: string;
  };
  destination: {
    latitude: string;
    longitude: string;
  };
  distance: number;
  duration: string;
  options: IDriver[];
  value: number;
  createdAt: Date;
}

const rideSchema = new Schema<IRide>(
  {
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
    options: [
      {
        id: Number,
        name: String,
        description: String,
        vehicle: String,
        review: {
          rating: Number,
          comment: String,
        },
        value: { type: Number, required: true },
      },
    ],
    value: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Ride = mongoose.model<IRide>('Ride', rideSchema);

export default Ride;
