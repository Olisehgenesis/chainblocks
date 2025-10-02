// POST /api/ide/compile-all - Compile all files
export async function POST() {
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const solc = await import('solc');
    
    const contractsPath = path.join(process.cwd(), 'contracts');
    const files = await fs.readdir(contractsPath, { recursive: true });
    const solFiles = files.filter(file => file.toString().endsWith('.sol'));
    
    const results: Record<string, any> = {};

    for (const file of solFiles) {
      try {
        const fullPath = path.join(contractsPath, file);
        const sourceCode = await fs.readFile(fullPath, 'utf-8');
        
        const input = {
          language: 'Solidity',
          sources: {
            [file]: {
              content: sourceCode
            }
          },
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            },
            outputSelection: {
              '*': {
                '*': [
                  'abi',
                  'evm.bytecode.object',
                  'evm.deployedBytecode.object',
                  'evm.gasEstimates'
                ]
              }
            }
          }
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        
        // Check for errors
        if (output.errors) {
          const errors = output.errors.filter((e: any) => e.severity === 'error');
          if (errors.length > 0) {
            results[file] = { error: errors.map((e: any) => e.formattedMessage || e.message).join('\n') };
            continue;
          }
        }

        // Save build artifacts
        const fileName = path.basename(file, '.sol');
        const buildPath = path.join(contractsPath, 'build');
        await fs.mkdir(buildPath, { recursive: true });
        
        const buildFile = path.join(buildPath, `${fileName}.json`);
        await fs.writeFile(buildFile, JSON.stringify(output, null, 2));

        results[file] = output;
      } catch (error) {
        console.error(`Failed to compile ${file}:`, error);
        results[file] = { error: error.message };
      }
    }

    return Response.json({ success: true, output: results });
  } catch (error) {
    console.error('Error compiling all files:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
