import { NextRequest, NextResponse } from 'next/server'
import { WalletManager } from '../../../server/lib/wallet-manager'

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case 'getWalletInfo':
        return await getWalletInfo(params)
      case 'sendTransaction':
        return await sendTransaction(params)
      case 'estimateGas':
        return await estimateGas(params)
      case 'getGasPrice':
        return await getGasPrice(params)
      case 'validatePrivateKey':
        return await validatePrivateKey(params)
      case 'generateWallet':
        return await generateWallet()
      case 'checkNetwork':
        return await checkNetwork(params)
      case 'getNetworks':
        return await getNetworks()
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Wallet operation failed' },
      { status: 500 }
    )
  }
}

async function getWalletInfo(params: { privateKey: string; network?: string }) {
  const { privateKey, network = 'localhost' } = params
  
  if (!privateKey) {
    return NextResponse.json(
      { success: false, error: 'Private key is required' },
      { status: 400 }
    )
  }

  try {
    const walletInfo = await WalletManager.getWalletInfo(privateKey, network)
    return NextResponse.json({
      success: true,
      walletInfo
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function sendTransaction(params: {
  privateKey: string;
  to: string;
  value: string;
  data?: string;
  network?: string;
}) {
  const { privateKey, to, value, data, network = 'localhost' } = params
  
  if (!privateKey || !to || !value) {
    return NextResponse.json(
      { success: false, error: 'Private key, to address, and value are required' },
      { status: 400 }
    )
  }

  try {
    const result = await WalletManager.sendTransaction(privateKey, to, value, data, network)
    return NextResponse.json({
      success: true,
      transaction: result
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function estimateGas(params: {
  privateKey: string;
  to: string;
  value: string;
  data?: string;
  network?: string;
}) {
  const { privateKey, to, value, data, network = 'localhost' } = params
  
  if (!privateKey || !to || !value) {
    return NextResponse.json(
      { success: false, error: 'Private key, to address, and value are required' },
      { status: 400 }
    )
  }

  try {
    const gasEstimate = await WalletManager.estimateGas(privateKey, to, value, data, network)
    return NextResponse.json({
      success: true,
      gasEstimate
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function getGasPrice(params: { network?: string }) {
  const { network = 'localhost' } = params

  try {
    const gasPrice = await WalletManager.getGasPrice(network)
    return NextResponse.json({
      success: true,
      gasPrice
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function validatePrivateKey(params: { privateKey: string }) {
  const { privateKey } = params
  
  if (!privateKey) {
    return NextResponse.json(
      { success: false, error: 'Private key is required' },
      { status: 400 }
    )
  }

  const isValid = WalletManager.validatePrivateKey(privateKey)
  return NextResponse.json({
    success: true,
    isValid
  })
}

async function generateWallet() {
  try {
    const wallet = WalletManager.generateRandomWallet()
    return NextResponse.json({
      success: true,
      wallet
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function checkNetwork(params: { network: string }) {
  const { network } = params
  
  if (!network) {
    return NextResponse.json(
      { success: false, error: 'Network is required' },
      { status: 400 }
    )
  }

  try {
    const isConnected = await WalletManager.checkNetworkConnection(network)
    return NextResponse.json({
      success: true,
      isConnected,
      network
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function getNetworks() {
  try {
    const networks = WalletManager.getAllNetworks()
    return NextResponse.json({
      success: true,
      networks
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
