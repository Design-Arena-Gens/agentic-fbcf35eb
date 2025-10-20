import { ethers } from 'ethers';
import crypto from 'crypto';

export type AnchorResult = { txHash: string; dataHash: string; network: string };

export async function anchorCertificatePayload(payload: Record<string, any>): Promise<AnchorResult> {
  if (process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN !== 'true') {
    const dataHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    return { txHash: 'disabled', dataHash, network: 'disabled' };
  }

  const rpc = process.env.ETH_RPC_URL!;
  const key = process.env.ISSUER_PRIVATE_KEY!;
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(key, provider);

  const dataHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const data = ethers.hexlify(Buffer.from(dataHash, 'utf8'));

  const tx = await wallet.sendTransaction({ to: wallet.address, value: 0n, data });
  const receipt = await tx.wait();
  return { txHash: receipt?.hash || tx.hash, dataHash, network: (await provider.getNetwork()).name };
}
