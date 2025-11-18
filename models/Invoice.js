import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  client: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'paid', 'completed'] },
  materials: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true }
  }],
  amount: { type: Number, required: true },
  date: { type: String, required: true },
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
