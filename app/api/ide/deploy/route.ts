// POST /api/ide/deploy - Deploy a contract
export async function POST(request: Request) {
  try {
    const { fileName, constructorArgs = [], network = 'baseSepolia' } = await request.json();
    
    if (!fileName) {
      return Response.json(
        { success: false, error: 'File name is required' },
        { status: 400 }
      );
    }

    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    // Read build artifacts
    const buildPath = path.join(process.cwd(), 'contracts', 'build');
    const buildFile = path.join(buildPath, `${fileName}.json`);
    
    let artifacts;
    try {
      const content = await fs.readFile(buildFile, 'utf-8');
      artifacts = JSON.parse(content);
    } catch (error) {
      return Response.json(
        { success: false, error: `Build artifacts not found for ${fileName}. Please compile first.` },
        { status: 404 }
      );
    }

    // Extract contract data
    const contractKey = Object.keys(artifacts.contracts[`${fileName}.sol`] || {})[0];
    if (!contractKey) {
      return Response.json(
        { success: false, error: `Contract not found in ${fileName}.sol` },
        { status: 404 }
      );
    }

    const contract = artifacts.contracts[`${fileName}.sol`][contractKey];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    if (!abi || !bytecode) {
      return Response.json(
        { success: false, error: 'ABI or bytecode not found in build artifacts' },
        { status: 404 }
      );
    }

    // Return deployment data for client-side deployment
    return Response.json({ 
      success: true, 
      deploymentData: {
        abi,
        bytecode,
        constructorArgs,
        network,
        contractName: contractKey
      }
    });

  } catch (error) {
    console.error('Error preparing deployment:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
