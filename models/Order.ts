import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentId: string;
  status: 'pending' | 'paid' | 'failed';
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
