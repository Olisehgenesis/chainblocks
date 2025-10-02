/*
  Web Worker that compiles Solidity using web-solc package.
  This is a cleaner implementation compared to the custom solc-js approach.
*/

/* eslint-disable no-restricted-globals */

// Import web-solc using dynamic import
let webSolc = null;

async function ensureWebSolcLoaded() {
  if (webSolc) return;
  
  try {
    console.log('Loading web-solc...');
    
    // Try multiple CDN sources for web-solc
    const cdnUrls = [
      'https://unpkg.com/web-solc@0.7.0/dist/index.js',
      'https://cdn.jsdelivr.net/npm/web-solc@0.7.0/dist/index.js',
      'https://unpkg.com/web-solc@0.7.0/lib/index.js',
      'https://cdn.jsdelivr.net/npm/web-solc@0.7.0/lib/index.js'
    ];
    
    let webSolcModule;
    for (const url of cdnUrls) {
      try {
        console.log(`Trying to load web-solc from ${url}...`);
        webSolcModule = await import(url);
        console.log(`✅ Successfully loaded web-solc from ${url}`);
        break;
      } catch (err) {
        console.log(`❌ Failed to load from ${url}: ${err.message}`);
      }
    }
    
    if (!webSolcModule) {
      throw new Error('Could not load web-solc from any CDN source');
    }
    
    const { fetchAndLoadSolc } = webSolcModule;
    
    console.log('web-solc imported, fetching compiler...');
    
    // Fetch and load the compiler for Solidity ^0.8.0
    webSolc = await fetchAndLoadSolc('^0.8.0');
    
    console.log('web-solc compiler loaded successfully');
    
  } catch (error) {
    console.error('Error loading web-solc:', error);
    throw new Error(`Failed to load web-solc: ${error.message}`);
  }
}

self.onmessage = async (event) => {
  try {
    console.log('Worker received message:', event.data);
    const { input } = event.data;
    
    if (!input) {
      throw new Error('No input provided');
    }
    
    console.log('Loading web-solc...');
    await ensureWebSolcLoaded();
    console.log('web-solc loaded successfully');
    
    console.log('Compiling contract...');
    console.log('Input:', input);
    
    // Use web-solc's compile method
    const output = await webSolc.compile(input);
    console.log('Compilation completed');
    console.log('Output keys:', Object.keys(output));
    
    if (!output) {
      throw new Error('No output from compiler');
    }
    
    // Check for errors in the output
    if (output.errors && output.errors.length > 0) {
      const errors = output.errors.filter(e => e.severity === 'error');
      if (errors.length > 0) {
        console.log('Compilation errors found:', errors);
        const errorMessages = errors.map(e => e.formattedMessage || e.message).join('\n');
        throw new Error(`Compilation errors:\n${errorMessages}`);
      }
    }
    
    self.postMessage({ ok: true, output: output });
    
  } catch (error) {
    console.error('Worker compilation error:', error);
    console.error('Error stack:', error.stack);
    self.postMessage({ 
      ok: false, 
      error: error?.message || 'Compilation failed in worker' 
    });
  }
};
