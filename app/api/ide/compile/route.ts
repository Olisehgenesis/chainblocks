// POST /api/ide/compile - Compile a specific file
export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();
    
    if (!filePath) {
      return Response.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    const { promises: fs } = await import('fs');
    const path = await import('path');
    const solc = await import('solc');
    
    const fullPath = path.join(process.cwd(), 'contracts', filePath);
    const sourceCode = await fs.readFile(fullPath, 'utf-8');
    
    const input = {
      language: 'Solidity',
      sources: {
        [filePath]: {
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
        const errorMessages = errors.map((e: any) => e.formattedMessage || e.message).join('\n');
        return Response.json(
          { success: false, error: `Compilation errors:\n${errorMessages}` },
          { status: 400 }
        );
      }
    }

    // Save build artifacts
    const fileName = path.basename(filePath, '.sol');
    const buildPath = path.join(process.cwd(), 'contracts', 'build');
    await fs.mkdir(buildPath, { recursive: true });
    
    const buildFile = path.join(buildPath, `${fileName}.json`);
    await fs.writeFile(buildFile, JSON.stringify(output, null, 2));

    return Response.json({ success: true, output });
  } catch (error) {
    console.error('Error compiling file:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
