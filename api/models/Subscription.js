import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;