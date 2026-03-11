import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const { MONGODB_URI, PORT = 5000 } = process.env;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

console.log('Starting server...');
console.log('Connecting to MongoDB at:', MONGODB_URI.split('@')[0] + '@...');

try {
  await mongoose.connect(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    maxPoolSize: 10
  });
  console.log('✓ MongoDB connected successfully');
} catch (err) {
  console.error('✗ MongoDB connection failed:', err.message);
  console.error('Full error:', err);
  process.exit(1);
}

const BookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  service: String,
  weight: String,
  trackingId: String,
  eta: String,
  pickupDate: String,
  createdAt: { type: Date, default: Date.now }
});

const TimelineSchema = new mongoose.Schema({
  trackingId: String,
  date: String,
  status: String,
  location: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const ShipmentSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true },
  sender: String,
  senderAddress: String,
  receiver: String,
  receiverAddress: String,
  phone: String,
  weight: String,
  type: String,
  pickupDate: String,
  status: String,
  route: String,
  currentLocation: String,
  eta: String,
  deliveredAt: String,
  createdAt: { type: Date, default: Date.now }
});

const PricingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  base: Number,
  perKg: Number,
  expressMultiplier: Number,
  type: {
    document: { factor: Number, perKg: Number },
    box: { factor: Number, perKg: Number },
    pallet: { factor: Number, perKg: Number },
    fragile: { factor: Number, perKg: Number }
  },
  updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', BookingSchema);
const Shipment = mongoose.model('Shipment', ShipmentSchema);
const Timeline = mongoose.model('Timeline', TimelineSchema);
const Pricing = mongoose.model('Pricing', PricingSchema);

const defaultPricing = () => ({
  key: 'default',
  base: 32,
  perKg: 1.4,
  expressMultiplier: 1.4,
  type: {
    document: { factor: 0.9, perKg: 0.7 },
    box: { factor: 1, perKg: 1.4 },
    pallet: { factor: 1.45, perKg: 1.8 },
    fragile: { factor: 1.35, perKg: 1.7 }
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Bookings from get-quote
app.post('/api/bookings', async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
});

app.get('/api/bookings', async (req, res) => {
  const limit = parseInt(req.query.limit || '7', 10);
  const list = await Booking.find().sort({ createdAt: -1 }).limit(limit);
  res.json(list);
});

app.patch('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await Booking.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  res.json({ ok: true });
});

// Shipments
app.post('/api/shipments', async (req, res) => {
  const shipment = await Shipment.create(req.body);
  res.json(shipment);
});

app.get('/api/shipments', async (req, res) => {
  const list = await Shipment.find().sort({ createdAt: -1 });
  res.json(list);
});

app.get('/api/shipments/:id', async (req, res) => {
  const { id } = req.params;
  const shipment = await Shipment.findOne({ trackingId: id });
  if (!shipment) return res.status(404).json({ error: 'Not found' });
  res.json(shipment);
});

app.patch('/api/shipments/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await Shipment.findOneAndUpdate(
    { trackingId: id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

// Pricing
app.get('/api/pricing', async (req, res) => {
  let pricing = await Pricing.findOne({ key: 'default' });
  if (!pricing) pricing = await Pricing.create(defaultPricing());
  res.json(pricing);
});

app.put('/api/pricing', async (req, res) => {
  const data = { ...defaultPricing(), ...req.body, key: 'default', updatedAt: new Date() };
  const pricing = await Pricing.findOneAndUpdate({ key: 'default' }, data, { new: true, upsert: true });
  res.json(pricing);
});

app.patch('/api/shipments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, location } = req.body;
  const deliveredAt = status === 'Delivered' ? new Date().toISOString().slice(0, 10) : null;
  const updated = await Shipment.findOneAndUpdate(
    { trackingId: id },
    { status, ...(location ? { currentLocation: location } : {}), deliveredAt },
    { new: true }
  );
  if (updated) {
    await Timeline.create({
      trackingId: id,
      date: new Date().toISOString().slice(0, 10),
      status,
      location: location || updated.currentLocation || ''
    });
  }
  res.json(updated);
});

app.delete('/api/shipments/:id', async (req, res) => {
  const { id } = req.params;
  await Shipment.deleteOne({ trackingId: id });
  res.json({ ok: true });
});

// Timeline
app.post('/api/shipments/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const entry = await Timeline.create({ trackingId: id, ...req.body });
  res.json(entry);
});

app.get('/api/shipments/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const list = await Timeline.find({ trackingId: id }).sort({ createdAt: -1 });
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`API running on ${PORT}`);
});
