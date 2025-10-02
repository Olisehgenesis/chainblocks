import type { InputJson, OutputJson } from 'solc';

export type SolcSources = Record<string, { content: string }>;

export async function compileSolidityInBrowser(sources: SolcSources): Promise<OutputJson> {
	const solc = await import('solc');
	const input: InputJson = {
		language: 'Solidity',
		sources,
		settings: {
			optimizer: { enabled: true, runs: 200 },
			outputSelection: {
				'*': {
					'*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object'],
				},
			},
		},
	};

	const result = JSON.parse(solc.compile(JSON.stringify(input))) as OutputJson;
	if ((result as any).errors?.some((e: any) => e.severity === 'error')) {
		throw new Error((result as any).errors.map((e: any) => e.formattedMessage ?? e.message).join('\n'));
	}
	return result;
}


