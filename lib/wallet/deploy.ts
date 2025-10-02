import { createWalletClient, custom, Hex, Address, http, PublicClient, createPublicClient, Chain } from 'viem';
import { baseSepolia } from 'viem/chains';

export function getInjectedWalletClient(chain: Chain = baseSepolia) {
	if (typeof window === 'undefined' || !(window as any).ethereum) throw new Error('No injected wallet');
	return createWalletClient({ transport: custom((window as any).ethereum), chain });
}

export function getPublicClient(rpcUrl?: string, chain: Chain = baseSepolia): PublicClient {
	return createPublicClient({ chain, transport: rpcUrl ? http(rpcUrl) : http() });
}

export async function deployContract(opts: { bytecode: Hex; abi: any[]; args?: unknown[]; chain?: Chain }): Promise<{ address: Address; txHash: Hex }>
{
	const wallet = getInjectedWalletClient(opts.chain ?? baseSepolia);
	const hash = await wallet.deployContract({ abi: opts.abi as any, bytecode: opts.bytecode, args: opts.args ?? [] });
	const publicClient = getPublicClient(undefined, opts.chain ?? baseSepolia);
	const receipt = await publicClient.waitForTransactionReceipt({ hash });
	return { address: receipt.contractAddress as Address, txHash: hash };
}


