import * as Blockly from 'blockly'

// Solidity Code Generator
export class SolidityGenerator extends Blockly.Generator {
  constructor() {
    super('Solidity')
  }

  // Precedence constant used when no specific operator precedence is required
  public ORDER_NONE: number = 99

  // External imports to include at the top of the file
  private imports: { path: string, alias?: string }[] = []

  public setImports(imports: { path: string, alias?: string }[]) {
    this.imports = imports || []
  }

  // Generate code for the entire workspace
  workspaceToCode(workspace: Blockly.Workspace): string {
    // Initialize generator state (handles definitions, name DB, etc.)
    this.init(workspace)

    // Iterate all top-level blocks in a stable order
    const topBlocks = workspace.getTopBlocks(true)
    let code = ''
    for (const top of topBlocks) {
      let current: Blockly.Block | null = top
      while (current) {
        if (typeof (current as any).type !== 'string' || !current.isEnabled()) {
          current = current.getNextBlock()
          continue
        }
        const line = this.blockToCode(current)
        if (Array.isArray(line)) {
          code += line[0]
        } else if (typeof line === 'string') {
          code += line
        }
        current = current.getNextBlock()
      }
    }

    // Finalize and return the code (lets the generator add required prologues)
    code = this.finish(code)

    // Optional: prepend SPDX and pragma for Solidity
    const header = '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\n'

    // Emit imports
    const importLines = (this.imports || [])
      .filter(i => i && i.path)
      .map(i => i.alias ? `import ${i.alias} from "${i.path}";` : `import "${i.path}";`)
      .join('\n')
    const importSection = importLines ? importLines + '\n\n' : ''

    // Reset imports after generation so they don't leak between runs
    this.imports = []
    return header + importSection + code
  }

  // Generate code for a block
  blockToCode(block: Blockly.Block): string {
    if (!block) return ''
    const generator = this as any
    const blockType = (block as any).type
    if (!blockType || typeof blockType !== 'string') return ''
    const fn = generator[blockType]
    if (typeof fn !== 'function') return ''
    const code = fn.call(generator, block, generator)
    return code || ''
  }

  // Data Types
  solidity_uint(block: Blockly.Block): string {
    const size = block.getFieldValue('SIZE')
    const name = block.getFieldValue('NAME')
    return `uint${size} ${name}`
  }

  solidity_address(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    return `address ${name}`
  }

  solidity_bool(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    return `bool ${name}`
  }

  solidity_string(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    return `string ${name}`
  }

  solidity_bytes(block: Blockly.Block): string {
    const size = block.getFieldValue('SIZE')
    const name = block.getFieldValue('NAME')
    return `bytes${size} ${name}`
  }

  solidity_array(block: Blockly.Block): string {
    const type = block.getFieldValue('TYPE')
    const size = block.getFieldValue('SIZE')
    const name = block.getFieldValue('NAME')
    return `${type}[${size}] ${name}`
  }

  solidity_mapping(block: Blockly.Block): string {
    const keyType = block.getFieldValue('KEY_TYPE')
    const valueType = block.getFieldValue('VALUE_TYPE')
    const name = block.getFieldValue('NAME')
    return `mapping(${keyType} => ${valueType}) ${name}`
  }

  // Functions
  solidity_function(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const params = this.valueToCode(block, 'PARAMS', this.ORDER_NONE) || ''
    const visibility = block.getFieldValue('VISIBILITY')
    const state = block.getFieldValue('STATE')
    const body = this.statementToCode(block, 'BODY')
    
    let code = `function ${name}(${params}) ${visibility}`
    if (state) code += ` ${state}`
    code += ` {\n${body}}\n`
    return code
  }

  solidity_modifier(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `modifier ${name} {\n${body}}\n`
  }

  solidity_payable(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `function ${name}() external payable {\n${body}}\n`
  }

  solidity_view(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `function ${name}() public view {\n${body}}\n`
  }

  solidity_pure(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `function ${name}() public pure {\n${body}}\n`
  }

  solidity_return(block: Blockly.Block): string {
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || ''
    return `return ${value};\n`
  }

  // Contract Structure
  solidity_contract(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `contract ${name} {\n${body}}\n`
  }

  solidity_constructor(block: Blockly.Block): string {
    const params = this.valueToCode(block, 'PARAMS', this.ORDER_NONE) || ''
    const body = this.statementToCode(block, 'BODY')
    return `constructor(${params}) {\n${body}}\n`
  }

  solidity_inheritance(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const parent = block.getFieldValue('PARENT')
    const body = this.statementToCode(block, 'BODY')
    return `contract ${name} is ${parent} {\n${body}}\n`
  }

  solidity_interface(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `interface ${name} {\n${body}}\n`
  }

  solidity_struct(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const body = this.statementToCode(block, 'BODY')
    return `struct ${name} {\n${body}}\n`
  }

  solidity_enum(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const values = this.valueToCode(block, 'VALUES', this.ORDER_NONE) || ''
    return `enum ${name} { ${values} }\n`
  }

  // Events & Logging
  solidity_event(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const params = this.valueToCode(block, 'PARAMS', this.ORDER_NONE) || ''
    return `event ${name}(${params});\n`
  }

  solidity_emit(block: Blockly.Block): string {
    const event = block.getFieldValue('EVENT')
    const params = this.valueToCode(block, 'PARAMS', this.ORDER_NONE) || ''
    return `emit ${event}(${params});\n`
  }

  solidity_indexed(block: Blockly.Block): string {
    const type = block.getFieldValue('TYPE')
    return `indexed ${type}`
  }

  // Ether & Tokens
  solidity_transfer(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || ''
    const amount = this.valueToCode(block, 'AMOUNT', this.ORDER_NONE) || ''
    return `${address}.transfer(${amount});\n`
  }

  solidity_send(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || ''
    const amount = this.valueToCode(block, 'AMOUNT', this.ORDER_NONE) || ''
    return `${address}.send(${amount});\n`
  }

  solidity_call(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || ''
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || ''
    const data = this.valueToCode(block, 'DATA', this.ORDER_NONE) || ''
    return `${address}.call{value: ${value}}(${data});\n`
  }

  solidity_receive(block: Blockly.Block): string {
    const body = this.statementToCode(block, 'BODY')
    return `receive() external payable {\n${body}}\n`
  }

  solidity_fallback(block: Blockly.Block): string {
    const body = this.statementToCode(block, 'BODY')
    return `fallback() external payable {\n${body}}\n`
  }

  solidity_erc20(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    return `contract ${name} is ERC20 {\n    constructor() ERC20("${name}", "${name.toUpperCase()}") {}\n}\n`
  }

  // Error Handling
  solidity_require(block: Blockly.Block): string {
    const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || ''
    const message = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || ''
    return `require(${condition}, ${message});\n`
  }

  solidity_revert(block: Blockly.Block): string {
    const message = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || ''
    return `revert(${message});\n`
  }

  solidity_assert(block: Blockly.Block): string {
    const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || ''
    return `assert(${condition});\n`
  }

  solidity_try_catch(block: Blockly.Block): string {
    const tryBlock = this.statementToCode(block, 'TRY_BLOCK')
    const catchBlock = this.statementToCode(block, 'CATCH_BLOCK')
    const error = block.getFieldValue('ERROR')
    return `try {\n${tryBlock}} catch ${error} {\n${catchBlock}}\n`
  }

  // Control Flow
  solidity_break(block: Blockly.Block): string {
    return 'break;\n'
  }

  solidity_continue(block: Blockly.Block): string {
    return 'continue;\n'
  }

  // Math & Logic
  solidity_keccak256(block: Blockly.Block): string {
    const input = this.valueToCode(block, 'INPUT', this.ORDER_NONE) || ''
    return `keccak256(${input})`
  }

  solidity_abi_encode(block: Blockly.Block): string {
    const input = this.valueToCode(block, 'INPUT', this.ORDER_NONE) || ''
    return `abi.encode(${input})`
  }
}

// Create and export the generator instance
export const solidityGenerator = new SolidityGenerator()
