# ChainBlocks Server

A comprehensive server-side solution for compiling and deploying smart contracts using Hardhat and ethers.js.

## Features

- **Smart Contract Compilation**: Compile Solidity contracts using `npx hardhat compile`
- **Contract Deployment**: Deploy contracts with connected wallets
- **Wallet Management**: Generate, validate, and manage Ethereum wallets
- **Multi-Network Support**: Support for localhost, testnets, and mainnet
- **Gas Estimation**: Accurate gas estimation for transactions
- **Transaction Preparation**: Prepare unsigned transactions for client-side signing

## Architecture

```
server/
├── lib/
│   ├── blockchain-server.ts    # Core blockchain operations
│   └── wallet-manager.ts       # Wallet utilities
├── examples/
│   └── server-example.js       # Usage examples
├── package.json                # Server dependencies
└── hardhat.config.ts          # Hardhat configuration

app/api/
├── compile/route.ts            # Compilation endpoint
├── deploy/route.ts             # Deployment endpoint
└── wallet/route.ts             # Wallet management endpoint
```

## API Endpoints

### 1. Compile Contract

**POST** `/api/compile`

Compiles a Solidity contract and returns ABI and bytecode.

```json
{
  "contractCode": "pragma solidity ^0.8.20; contract MyContract { ... }",
  "contractName": "MyContract"
}
```

**Response:**
```json
{
  "success": true,
  "contractName": "MyContract",
  "abi": [...],
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "stdout": "Compilation successful"
}
```

### 2. Deploy Contract

**POST** `/api/deploy`

Deploys a contract using bytecode and ABI.

#### Prepare Transaction (Client-side signing)
```json
{
  "contractName": "MyContract",
  "abi": [...],
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "constructorArgs": [42],
  "network": "localhost",
  "action": "prepare"
}
```

#### Direct Deployment (Server-side)
```json
{
  "contractName": "MyContract",
  "abi": [...],
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "constructorArgs": [42],
  "privateKey": "0x...",
  "network": "localhost",
  "action": "deploy"
}
```

**Response:**
```json
{
  "success": true,
  "contractAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "transactionHash": "0x...",
  "gasUsed": "123456",
  "network": "localhost",
  "deployerAddress": "0x..."
}
```

### 3. Wallet Management

**POST** `/api/wallet`

Manages wallet operations.

#### Get Wallet Info
```json
{
  "action": "getWalletInfo",
  "privateKey": "0x...",
  "network": "localhost"
}
```

#### Send Transaction
```json
{
  "action": "sendTransaction",
  "privateKey": "0x...",
  "to": "0x...",
  "value": "1.0",
  "network": "localhost"
}
```

#### Generate New Wallet
```json
{
  "action": "generateWallet"
}
```

## Supported Networks

- **localhost**: `http://127.0.0.1:8545` (Hardhat node)
- **hardhat**: `http://127.0.0.1:8545` (Hardhat network)
- **mainnet**: Ethereum mainnet
- **sepolia**: Ethereum Sepolia testnet
- **baseSepolia**: Base Sepolia testnet
- **celoAlfajores**: Celo Alfajores testnet

## Setup Instructions

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install additional server dependencies
npm install hardhat ethers @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-toolbox
```

### 2. Start Local Blockchain

```bash
# Start Hardhat node
npx hardhat node
```

### 3. Start Development Server

```bash
# Start Next.js development server
npm run dev
```

### 4. Test the System

```bash
# Run the example script
node server/examples/server-example.js
```

## Usage Examples

### Basic Compilation and Deployment

```javascript
// Compile contract
const compileResponse = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractCode: 'pragma solidity ^0.8.20; contract MyContract { uint256 public value; }',
    contractName: 'MyContract'
  })
})

const { abi, bytecode } = await compileResponse.json()

// Deploy contract
const deployResponse = await fetch('/api/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractName: 'MyContract',
    abi,
    bytecode,
    privateKey: '0x...',
    network: 'localhost',
    action: 'deploy'
  })
})

const { contractAddress } = await deployResponse.json()
console.log('Contract deployed at:', contractAddress)
```

### Wallet Management

```javascript
// Generate new wallet
const walletResponse = await fetch('/api/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generateWallet'
  })
})

const { wallet } = await walletResponse.json()
console.log('New wallet:', wallet.address)

// Get wallet info
const infoResponse = await fetch('/api/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'getWalletInfo',
    privateKey: wallet.privateKey,
    network: 'localhost'
  })
})

const { walletInfo } = await infoResponse.json()
console.log('Balance:', walletInfo.balance)
```

## Security Considerations

- **Private Keys**: Never expose private keys in client-side code
- **Network Security**: Use HTTPS in production
- **Input Validation**: Always validate contract code and parameters
- **Rate Limiting**: Implement rate limiting for production use
- **Environment Variables**: Store sensitive data in environment variables

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common error scenarios:
- Invalid contract code
- Compilation failures
- Network connection issues
- Insufficient funds
- Invalid private keys
- Gas estimation failures

## Development

### Adding New Networks

To add support for new networks, update the `getProvider` function in `/app/api/deploy/route.ts`:

```javascript
const networkConfigs = {
  // ... existing networks
  newNetwork: {
    name: 'New Network',
    chainId: 12345,
    rpcUrl: 'https://rpc.new-network.com',
    explorerUrl: 'https://explorer.new-network.com'
  }
}
```

### Extending Functionality

The server is designed to be extensible. You can:

1. Add new API endpoints in `/app/api/`
2. Extend the `BlockchainServer` class with new methods
3. Add new wallet operations to `WalletManager`
4. Create custom deployment strategies

## Troubleshooting

### Common Issues

1. **Compilation fails**: Check Solidity version compatibility
2. **Deployment fails**: Ensure sufficient funds and correct network
3. **Gas estimation fails**: Verify contract constructor parameters
4. **Network connection issues**: Check RPC URL and network status

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=chainblocks:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache-2.0
