import { VM } from '@ethereumjs/vm';
import { Common, Chain, Hardfork } from '@ethereumjs/common';
import { Address } from 'viem';

export async function createVm(): Promise<VM> {
	const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai });
	return await VM.create({ common });
}

export async function simulateCall(vm: VM, opts: { from: Address; to?: Address; data?: `0x${string}`; value?: bigint }): Promise<{ returnValue: string }> {
	const result = await vm.evm.runCall({
		to: opts.to ? Buffer.from(opts.to.slice(2), 'hex') : undefined,
		caller: Buffer.from(opts.from.slice(2), 'hex'),
		data: opts.data ? Buffer.from(opts.data.slice(2), 'hex') : undefined,
		value: opts.value,
	});
	return { returnValue: '0x' + (result.execResult.returnValue?.toString('hex') ?? '') };
}


