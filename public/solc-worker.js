/*
  Web Worker that compiles Solidity using solc's standard-json interface.
  Uses the official solc-js approach with proper module initialization.
*/

/* eslint-disable no-restricted-globals */

// Use the official solc-js CDN
const SOLC_URL = 'https://unpkg.com/solc@0.8.24/lib/soljson.js'

let solcLoaded = false
let solc = null

async function ensureSolcLoaded() {
  if (solcLoaded && solc) return
  
  try {
    console.log('Loading SOLC from:', SOLC_URL)
    
    // Import the SOLC script using importScripts
    importScripts(SOLC_URL)
    console.log('SOLC script imported')
    
    // Wait for the module to be ready
    await new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 50 // 5 seconds max wait
      
      const checkModule = () => {
        attempts++
        
        try {
          // Check if Module is available and ready
          if (typeof self.Module !== 'undefined' && self.Module && typeof self.Module.cwrap === 'function') {
            console.log('Module is ready, creating compiler...')
            
            // Create the compiler using the standard approach
            solc = {
              version: function() {
                const versionFunc = self.Module.cwrap('version', 'string', []);
                return versionFunc();
              },
              compile: function(input) {
                const compileStandard = self.Module.cwrap('compileStandard', 'string', ['string']);
                return compileStandard(input);
              }
            };
            
            // Test the compiler
            try {
              const version = solc.version()
              console.log('Compiler version:', version)
              solcLoaded = true
              resolve()
              return
            } catch (versionError) {
              console.log(`Attempt ${attempts}: Version test failed:`, versionError.message)
            }
          } else {
            console.log(`Attempt ${attempts}: Module not ready yet`)
          }
        } catch (error) {
          console.log(`Attempt ${attempts}: Error:`, error.message)
        }
        
        if (attempts >= maxAttempts) {
          reject(new Error('SOLC Module failed to initialize'))
          return
        }
        
        setTimeout(checkModule, 100)
      }
      
      checkModule()
    })
    
  } catch (error) {
    console.error('Error loading SOLC:', error)
    throw new Error(`Failed to load solc: ${error.message}`)
  }
}

self.onmessage = async (event) => {
  try {
    console.log('Worker received message:', event.data)
    const { input } = event.data
    
    if (!input) {
      throw new Error('No input provided')
    }
    
    console.log('Loading solc...')
    await ensureSolcLoaded()
    console.log('Solc loaded successfully')
    
    console.log('Compiling contract...')
    const inputString = JSON.stringify(input)
    console.log('Input string length:', inputString.length)
    console.log('Input:', input)
    
    // Use solc.compile directly (like Black IDE does)
    console.log('About to call solc.compile with input:', inputString.substring(0, 200) + '...')
    const output = solc.compile(inputString)
    console.log('Compilation completed, output type:', typeof output)
    console.log('Compilation completed, output length:', output ? output.length : 0)
    
    if (!output) {
      throw new Error('No output from compiler')
    }
    
    // Parse the output if it's a string
    let parsedOutput
    if (typeof output === 'string') {
      console.log('Output is string, parsing JSON...')
      parsedOutput = JSON.parse(output)
    } else {
      console.log('Output is already object, using as-is')
      parsedOutput = output
    }
    
    console.log('Output parsed successfully, keys:', Object.keys(parsedOutput))
    
    // Check for errors in the output (like Black IDE does)
    if (parsedOutput.errors && parsedOutput.errors.length > 0) {
      const errors = parsedOutput.errors.filter(e => e.severity === 'error')
      if (errors.length > 0) {
        console.log('Compilation errors found:', errors)
        const errorMessages = errors.map(e => e.formattedMessage || e.message).join('\n')
        throw new Error(`Compilation errors:\n${errorMessages}`)
      }
    }
    
    self.postMessage({ ok: true, output: parsedOutput })
  } catch (error) {
    console.error('Worker compilation error:', error)
    console.error('Error stack:', error.stack)
    self.postMessage({ 
      ok: false, 
      error: error?.message || 'Compilation failed in worker' 
    })
  }
}