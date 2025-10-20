import mongoose, { Schema, InferSchemaType, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'issuer'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  organizationName: { type: String },
  organizationType: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export type User = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export default models.User || mongoose.model('User', UserSchema);
