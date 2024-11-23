import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
