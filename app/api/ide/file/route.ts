// GET /api/ide/file?path=... - Read a specific file
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return Response.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'contracts', filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    return Response.json({ success: true, content });
  } catch (error) {
    console.error('Error reading file:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/ide/file - Create or update a file
export async function POST(request: Request) {
  try {
    const { filePath, content } = await request.json();
    
    if (!filePath || content === undefined) {
      return Response.json(
        { success: false, error: 'File path and content are required' },
        { status: 400 }
      );
    }

    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'contracts', filePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(fullPath, content, 'utf-8');
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error writing file:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/ide/file?path=... - Delete a file
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return Response.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'contracts', filePath);
    await fs.unlink(fullPath);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
