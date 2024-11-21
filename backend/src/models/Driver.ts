import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  description: string;
  vehicle: string;
  rating: number;
  ratePerKm: number;
  minKm: number;
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    vehicle: { type: String, required: true },
    rating: { type: Number, required: true },
    ratePerKm: { type: Number, required: true },
    minKm: { type: Number, required: true },
  },
  { timestamps: true }
);

const Driver = mongoose.model<IDriver>('Driver', driverSchema);

export default Driver;
