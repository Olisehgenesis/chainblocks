// GET /api/ide/files - List all .sol files
export async function GET() {
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const contractsPath = path.join(process.cwd(), 'contracts');
    
    // Ensure contracts directory exists
    try {
      await fs.mkdir(contractsPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    const files = await fs.readdir(contractsPath, { recursive: true });
    const solFiles = files.filter(file => file.toString().endsWith('.sol'));
    
    return Response.json({ success: true, files: solFiles });
  } catch (error) {
    console.error('Error listing files:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
