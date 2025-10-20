import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose;
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
  });
  isConnected = true;
  return mongoose;
}
