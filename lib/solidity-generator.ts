import * as Blockly from 'blockly'

// Solidity Code Generator
export class SolidityGenerator extends Blockly.Generator {
  constructor() {
    super('Solidity')
  }

  // Precedence constants for operator precedence
  public ORDER_NONE: number = 99
  public ORDER_EQUALITY: number = 9
  public ORDER_RELATIONAL: number = 8
  public ORDER_ADDITION: number = 7
  public ORDER_SUBTRACTION: number = 7
  public ORDER_MULTIPLICATION: number = 6
  public ORDER_DIVISION: number = 6
  public ORDER_MODULO: number = 6
  public ORDER_LOGICAL_NOT: number = 5
  public ORDER_LOGICAL_AND: number = 4
  public ORDER_LOGICAL_OR: number = 3
  public ORDER_CONDITIONAL: number = 2
  public ORDER_ASSIGNMENT: number = 1

  // External imports to include at the top of the file
  private imports: { path: string, alias?: string }[] = []
  private license: string = 'MIT'
  private version: string = '^0.8.24'

  public setImports(imports: { path: string, alias?: string }[]) {
    this.imports = imports || []
  }

  public setLicense(license: string) {
    this.license = license || 'MIT'
  }

  public setVersion(version: string) {
    this.version = version || '^0.8.20'
  }

  // Generate code for the entire workspace
  workspaceToCode(workspace: Blockly.Workspace): string {
    // Initialize generator state (handles definitions, name DB, etc.)
    this.init(workspace)

    // Get all top-level blocks (both connected and standalone)
    const topBlocks = workspace.getTopBlocks(true)
    let code = ''
    
    // Process each top-level block
    for (const block of topBlocks) {
      if (!block || !block.isEnabled()) continue
      
      const blockCode = this.blockToCode(block)
      if (blockCode) {
        code += blockCode
      }
    }

    // Finalize and return the code (lets the generator add required prologues)
    code = this.finish(code)

    // Optional: prepend SPDX and pragma for Solidity
    const header = `// SPDX-License-Identifier: ${this.license}\npragma solidity ${this.version};\n\n`

    // Emit imports
    const importLines = (this.imports || [])
      .filter(i => i && i.path)
      .map(i => i.alias ? `import ${i.alias} from "${i.path}";` : `import "${i.path}";`)
      .join('\n')
    const importSection = importLines ? importLines + '\n\n' : ''

    // Add footer comment
    const footer = code.trim() ? '\n\n// designed with codeblocks' : '// designed with codeblocks'

    // Reset imports after generation so they don't leak between runs
    this.imports = []
    return header + importSection + code + footer
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

  // Generate code for statements (blocks connected to statement inputs)
  statementToCode(block: Blockly.Block, name: string): string {
    const targetBlock = block.getInputTargetBlock(name)
    if (!targetBlock) return ''
    
    let code = ''
    let current: Blockly.Block | null = targetBlock
    
    while (current) {
      if (!current.isEnabled()) {
        current = current.getNextBlock()
        continue
      }
      
      const blockCode = this.blockToCode(current)
      if (blockCode) {
        code += blockCode
      }
      
      current = current.getNextBlock()
    }
    
    return code
  }

  // Variables
  solidity_global_variable_declare(block: Blockly.Block): string {
    const visibility = block.getFieldValue('VISIBILITY')
    const type = block.getFieldValue('TYPE')
    const name = block.getFieldValue('NAME')
    return `${type} ${visibility} ${name};\n`
  }

  solidity_global_variable_assign(block: Blockly.Block): string {
    const variable = block.getFieldValue('VARIABLE')
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || ''
    return `${variable} = ${value};\n`
  }

  solidity_local_variable(block: Blockly.Block): string {
    const type = block.getFieldValue('TYPE')
    const name = block.getFieldValue('NAME')
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || ''
    return `${type} ${name} = ${value};\n`
  }

  solidity_variable_assignment(block: Blockly.Block): string {
    const variable = block.getFieldValue('VARIABLE')
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || ''
    return `${variable} = ${value};\n`
  }

  solidity_variable_reference(block: Blockly.Block): string {
    const variable = block.getFieldValue('VARIABLE')
    return variable
  }

  solidity_constant(block: Blockly.Block): string {
    const type = block.getFieldValue('TYPE')
    const name = block.getFieldValue('NAME')
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || ''
    return `${type} constant ${name} = ${value};\n`
  }

  solidity_immutable(block: Blockly.Block): string {
    const type = block.getFieldValue('TYPE')
    const name = block.getFieldValue('NAME')
    return `${type} immutable ${name};\n`
  }

  // Control Flow
  solidity_if(block: Blockly.Block): string {
    const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false'
    const statements = this.statementToCode(block, 'DO')
    return `if (${condition}) {\n${statements}}\n`
  }

  solidity_if_else(block: Blockly.Block): string {
    const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false'
    const ifStatements = this.statementToCode(block, 'DO')
    const elseStatements = this.statementToCode(block, 'ELSE')
    return `if (${condition}) {\n${ifStatements}} else {\n${elseStatements}}\n`
  }

  solidity_for_loop(block: Blockly.Block): string {
    const init = this.valueToCode(block, 'INIT', this.ORDER_NONE) || ''
    const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'true'
    const increment = this.valueToCode(block, 'INCREMENT', this.ORDER_NONE) || ''
    const statements = this.statementToCode(block, 'DO')
    return `for (${init}; ${condition}; ${increment}) {\n${statements}}\n`
  }

  solidity_while_loop(block: Blockly.Block): string {
    const condition = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'true'
    const statements = this.statementToCode(block, 'DO')
    return `while (${condition}) {\n${statements}}\n`
  }

  solidity_break(block: Blockly.Block): string {
    return 'break;\n'
  }

  solidity_continue(block: Blockly.Block): string {
    return 'continue;\n'
  }

  // Logic & Comparison
  solidity_equals(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_EQUALITY) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_EQUALITY) || '0'
    return `${a} == ${b}`
  }

  solidity_not_equals(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_EQUALITY) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_EQUALITY) || '0'
    return `${a} != ${b}`
  }

  solidity_less_than(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_RELATIONAL) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_RELATIONAL) || '0'
    return `${a} < ${b}`
  }

  solidity_greater_than(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_RELATIONAL) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_RELATIONAL) || '0'
    return `${a} > ${b}`
  }

  solidity_and(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_LOGICAL_AND) || 'false'
    const b = this.valueToCode(block, 'B', this.ORDER_LOGICAL_AND) || 'false'
    return `${a} && ${b}`
  }

  solidity_or(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_LOGICAL_OR) || 'false'
    const b = this.valueToCode(block, 'B', this.ORDER_LOGICAL_OR) || 'false'
    return `${a} || ${b}`
  }

  solidity_not(block: Blockly.Block): string {
    const bool = this.valueToCode(block, 'BOOL', this.ORDER_LOGICAL_NOT) || 'false'
    return `!${bool}`
  }

  solidity_true(block: Blockly.Block): string {
    return 'true'
  }

  solidity_false(block: Blockly.Block): string {
    return 'false'
  }

  // Math Operations
  solidity_add(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_ADDITION) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_ADDITION) || '0'
    return `${a} + ${b}`
  }

  solidity_subtract(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_SUBTRACTION) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_SUBTRACTION) || '0'
    return `${a} - ${b}`
  }

  solidity_multiply(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_MULTIPLICATION) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_MULTIPLICATION) || '0'
    return `${a} * ${b}`
  }

  solidity_divide(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_DIVISION) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_DIVISION) || '1'
    return `${a} / ${b}`
  }

  solidity_modulo(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_MODULO) || '0'
    const b = this.valueToCode(block, 'B', this.ORDER_MODULO) || '1'
    return `${a} % ${b}`
  }

  solidity_number(block: Blockly.Block): string {
    const num = block.getFieldValue('NUM')
    return num || '0'
  }

  solidity_string_literal(block: Blockly.Block): string {
    const text = block.getFieldValue('TEXT')
    return `"${text}"`
  }

  // Solidity Global Variables
  solidity_msg_sender(block: Blockly.Block): string {
    return 'msg.sender'
  }

  solidity_msg_value(block: Blockly.Block): string {
    return 'msg.value'
  }

  solidity_block_timestamp(block: Blockly.Block): string {
    return 'block.timestamp'
  }

  solidity_address_this(block: Blockly.Block): string {
    return 'address(this)'
  }

  solidity_this_balance(block: Blockly.Block): string {
    return 'address(this).balance'
  }

  // Variable Dropdown
  solidity_variable_dropdown(block: Blockly.Block): string {
    const variable = block.getFieldValue('VARIABLE')
    return variable
  }

  // Address Operations
  solidity_address_zero(block: Blockly.Block): string {
    return 'address(0)'
  }

  solidity_address_cast(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || 'address(0)'
    return `address(${address})`
  }

  solidity_address_balance(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || 'address(0)'
    return `${address}.balance`
  }

  solidity_address_transfer(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || 'address(0)'
    const amount = this.valueToCode(block, 'AMOUNT', this.ORDER_NONE) || '0'
    return `${address}.transfer(${amount});\n`
  }

  solidity_address_send(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || 'address(0)'
    const amount = this.valueToCode(block, 'AMOUNT', this.ORDER_NONE) || '0'
    return `${address}.send(${amount});\n`
  }

  solidity_address_call(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_NONE) || 'address(0)'
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '0'
    const data = this.valueToCode(block, 'DATA', this.ORDER_NONE) || '""'
    return `${address}.call{value: ${value}}(${data});\n`
  }

  solidity_address_equal(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_EQUALITY) || 'address(0)'
    const b = this.valueToCode(block, 'B', this.ORDER_EQUALITY) || 'address(0)'
    return `${a} == ${b}`
  }

  solidity_address_not_equal(block: Blockly.Block): string {
    const a = this.valueToCode(block, 'A', this.ORDER_EQUALITY) || 'address(0)'
    const b = this.valueToCode(block, 'B', this.ORDER_EQUALITY) || 'address(0)'
    return `${a} != ${b}`
  }

  solidity_address_is_zero(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_EQUALITY) || 'address(0)'
    return `${address} == address(0)`
  }

  solidity_address_not_zero(block: Blockly.Block): string {
    const address = this.valueToCode(block, 'ADDRESS', this.ORDER_EQUALITY) || 'address(0)'
    return `${address} != address(0)`
  }

  solidity_owner(block: Blockly.Block): string {
    return 'owner'
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

  solidity_event_advanced(block: Blockly.Block): string {
    const name = block.getFieldValue('NAME')
    const params = this.statementToCode(block, 'PARAMS')
    return `event ${name}(${params});\n`
  }

  solidity_event_param(block: Blockly.Block): string {
    const type = block.getFieldValue('TYPE')
    const name = block.getFieldValue('NAME')
    const indexed = block.getFieldValue('INDEXED')
    const indexedStr = indexed ? ` ${indexed}` : ''
    
    // Check if this is the last parameter (no next block)
    const nextBlock = block.getNextBlock()
    const comma = nextBlock ? ', ' : ''
    
    return `${type}${indexedStr} ${name}${comma}`
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
