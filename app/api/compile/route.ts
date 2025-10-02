import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { contractCode, contractName } = await request.json()

    if (!contractCode || !contractName) {
      return NextResponse.json(
        { success: false, error: 'Missing contractCode or contractName' },
        { status: 400 }
      )
    }

    const contractsDir = path.join(process.cwd(), 'contracts')
    const artifactsDir = path.join(process.cwd(), 'artifacts')

    // Ensure contracts directory exists
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true })
    }

    // Write contract to file
    const contractPath = path.join(contractsDir, `${contractName}.sol`)
    fs.writeFileSync(contractPath, contractCode)

    // Compile using Hardhat
    console.log(`Compiling contract: ${contractName}`)
    const { stdout, stderr } = await execAsync('npx hardhat compile', {
      cwd: process.cwd(),
      timeout: 30000,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
    })

    // Check for compilation errors
    if (stderr && (stderr.includes('error') || stderr.includes('Error'))) {
      console.error('Compilation stderr:', stderr)
      return NextResponse.json({
        success: false,
        error: stderr,
        stdout: stdout
      }, { status: 400 })
    }

    // Check stdout for errors too
    if (stdout && (stdout.includes('error') || stdout.includes('Error'))) {
      console.error('Compilation stdout error:', stdout)
      return NextResponse.json({
        success: false,
        error: stdout
      }, { status: 400 })
    }

    // Get compiled artifact content
    const artifactPath = path.join(artifactsDir, 'contracts', `${contractName}.sol`, `${contractName}.json`)
    if (!fs.existsSync(artifactPath)) {
      return NextResponse.json({
        success: false,
        error: 'Artifact not found after compilation',
        stdout: stdout
      }, { status: 404 })
    }

    const artifactContent = fs.readFileSync(artifactPath, 'utf-8')
    const artifact = JSON.parse(artifactContent)

    // Extract ABI and bytecode
    const abi = artifact.abi
    const bytecode = artifact.bytecode || artifact.deployedBytecode

    if (!abi || !bytecode) {
      return NextResponse.json({
        success: false,
        error: 'ABI or bytecode missing in artifact',
        artifact: artifact
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      contractName,
      abi,
      bytecode,
      artifact: artifact,
      stdout: stdout
    })

  } catch (error: any) {
    console.error('Compilation error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Compilation failed'
    }, { status: 500 })
  }
}