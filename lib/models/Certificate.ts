import mongoose, { Schema, InferSchemaType, models } from 'mongoose';

const CertificateSchema = new Schema({
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  issuerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  student: {
    name: String,
    dateOfBirth: String,
    imageUrl: String,
    email: String,
    rollNumber: String,
  },
  fields: { type: Map, of: String },
  pptxBuffer: { type: Buffer },
  pdfUrl: { type: String },
  blockchain: {
    network: { type: String },
    txHash: { type: String },
    dataHash: { type: String },
    anchoredAt: { type: Date },
  },
  verificationCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export type Certificate = InferSchemaType<typeof CertificateSchema> & { _id: mongoose.Types.ObjectId };

export default models.Certificate || mongoose.model('Certificate', CertificateSchema);
