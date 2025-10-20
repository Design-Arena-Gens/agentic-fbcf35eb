import mongoose, { Schema, InferSchemaType, models } from 'mongoose';

const TemplateSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  fileData: { type: Buffer, required: true },
  mimeType: { type: String, default: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  placeholders: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
});

export type Template = InferSchemaType<typeof TemplateSchema> & { _id: mongoose.Types.ObjectId };

export default models.Template || mongoose.model('Template', TemplateSchema);
