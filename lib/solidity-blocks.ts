import * as Blockly from 'blockly'

// Solidity Block Definitions
export const solidityBlockDefinitions = [
  // Data Types
  {
    type: 'solidity_uint',
    message0: 'uint%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'SIZE',
        options: [
          ['8', '8'],
          ['16', '16'],
          ['32', '32'],
          ['64', '64'],
          ['128', '128'],
          ['256', '256']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'value'
      }
    ],
    output: 'Number',
    colour: 210,
    tooltip: 'Unsigned integer variable'
  },
  {
    type: 'solidity_address',
    message0: 'address %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'addr'
      }
    ],
    output: 'String',
    colour: 210,
    tooltip: 'Ethereum address variable'
  },
  {
    type: 'solidity_bool',
    message0: 'bool %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'flag'
      }
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'Boolean variable'
  },
  {
    type: 'solidity_string',
    message0: 'string %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'text'
      }
    ],
    output: 'String',
    colour: 210,
    tooltip: 'String variable'
  },
  {
    type: 'solidity_bytes',
    message0: 'bytes%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'SIZE',
        options: [
          ['', ''],
          ['1', '1'],
          ['2', '2'],
          ['4', '4'],
          ['8', '8'],
          ['16', '16'],
          ['32', '32']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'data'
      }
    ],
    output: 'String',
    colour: 210,
    tooltip: 'Bytes variable'
  },
  {
    type: 'solidity_array',
    message0: '%1[%2] %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['uint', 'uint'],
          ['string', 'string'],
          ['address', 'address'],
          ['bool', 'bool']
        ]
      },
      {
        type: 'field_input',
        name: 'SIZE',
        text: ''
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'arr'
      }
    ],
    output: 'Array',
    colour: 210,
    tooltip: 'Array variable'
  },
  {
    type: 'solidity_mapping',
    message0: 'mapping(%1 => %2) %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'KEY_TYPE',
        options: [
          ['address', 'address'],
          ['uint', 'uint'],
          ['string', 'string']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'VALUE_TYPE',
        options: [
          ['uint', 'uint'],
          ['address', 'address'],
          ['string', 'string'],
          ['bool', 'bool']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'map'
      }
    ],
    output: 'Array',
    colour: 210,
    tooltip: 'Mapping variable'
  },

  // Functions
  {
    type: 'solidity_function',
    message0: 'function %1(%2) %3 %4 %5',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'myFunction'
      },
      {
        type: 'input_value',
        name: 'PARAMS',
        check: 'String'
      },
      {
        type: 'field_dropdown',
        name: 'VISIBILITY',
        options: [
          ['public', 'public'],
          ['private', 'private'],
          ['internal', 'internal'],
          ['external', 'external']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'STATE',
        options: [
          ['', ''],
          ['view', 'view'],
          ['pure', 'pure'],
          ['payable', 'payable']
        ]
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Function definition'
  },
  {
    type: 'solidity_modifier',
    message0: 'modifier %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'onlyOwner'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Function modifier'
  },
  {
    type: 'solidity_payable',
    message0: 'payable function %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'receive'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Payable function'
  },
  {
    type: 'solidity_view',
    message0: 'view function %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'getValue'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'View function (read-only)'
  },
  {
    type: 'solidity_pure',
    message0: 'pure function %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'calculate'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Pure function (no state access)'
  },
  {
    type: 'solidity_return',
    message0: 'return %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['Number', 'String', 'Boolean']
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'Return statement'
  },

  // Contract Structure
  {
    type: 'solidity_contract',
    message0: 'contract %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'MyContract'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: 'Contract definition'
  },
  {
    type: 'solidity_constructor',
    message0: 'constructor %1 %2',
    args0: [
      {
        type: 'input_value',
        name: 'PARAMS',
        check: 'String'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: 'Constructor function'
  },
  {
    type: 'solidity_inheritance',
    message0: 'contract %1 is %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'ChildContract'
      },
      {
        type: 'field_input',
        name: 'PARENT',
        text: 'ParentContract'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: 'Contract inheritance'
  },
  {
    type: 'solidity_interface',
    message0: 'interface %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'IMyInterface'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: 'Interface definition'
  },
  {
    type: 'solidity_struct',
    message0: 'struct %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'MyStruct'
      },
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: 'Struct definition'
  },
  {
    type: 'solidity_enum',
    message0: 'enum %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'Status'
      },
      {
        type: 'input_value',
        name: 'VALUES',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: 'Enum definition'
  },

  // Events & Logging
  {
    type: 'solidity_event',
    message0: 'event %1(%2)',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'Transfer'
      },
      {
        type: 'input_value',
        name: 'PARAMS',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'Event definition'
  },
  {
    type: 'solidity_emit',
    message0: 'emit %1(%2)',
    args0: [
      {
        type: 'field_input',
        name: 'EVENT',
        text: 'Transfer'
      },
      {
        type: 'input_value',
        name: 'PARAMS',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'Emit event'
  },
  {
    type: 'solidity_indexed',
    message0: 'indexed %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['address', 'address'],
          ['uint', 'uint'],
          ['string', 'string']
        ]
      }
    ],
    output: 'String',
    colour: 160,
    tooltip: 'Indexed event parameter'
  },

  // Ether & Tokens
  {
    type: 'solidity_transfer',
    message0: '%1.transfer(%2)',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      },
      {
        type: 'input_value',
        name: 'AMOUNT',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: 'Transfer Ether'
  },
  {
    type: 'solidity_send',
    message0: '%1.send(%2)',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      },
      {
        type: 'input_value',
        name: 'AMOUNT',
        check: 'Number'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: 'Send Ether'
  },
  {
    type: 'solidity_call',
    message0: '%1.call{value: %2}(%3)',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'DATA',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: 'Low-level call'
  },
  {
    type: 'solidity_receive',
    message0: 'receive() external payable %1',
    args0: [
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: 'Receive function'
  },
  {
    type: 'solidity_fallback',
    message0: 'fallback() external payable %1',
    args0: [
      {
        type: 'input_statement',
        name: 'BODY'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: 'Fallback function'
  },
  {
    type: 'solidity_erc20',
    message0: 'ERC20 %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'MyToken'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: 'ERC20 token contract'
  },

  // Error Handling
  {
    type: 'solidity_require',
    message0: 'require(%1, %2)',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: 'Boolean'
      },
      {
        type: 'input_value',
        name: 'MESSAGE',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: 'Require condition'
  },
  {
    type: 'solidity_revert',
    message0: 'revert(%1)',
    args0: [
      {
        type: 'input_value',
        name: 'MESSAGE',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: 'Revert transaction'
  },
  {
    type: 'solidity_assert',
    message0: 'assert(%1)',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: 'Boolean'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: 'Assert condition'
  },
  {
    type: 'solidity_try_catch',
    message0: 'try %1 %2 catch %3',
    args0: [
      {
        type: 'input_statement',
        name: 'TRY_BLOCK'
      },
      {
        type: 'input_statement',
        name: 'CATCH_BLOCK'
      },
      {
        type: 'field_input',
        name: 'ERROR',
        text: 'Error'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: 'Try-catch block'
  },

  // Control Flow
  {
    type: 'solidity_break',
    message0: 'break',
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: 'Break statement'
  },
  {
    type: 'solidity_continue',
    message0: 'continue',
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: 'Continue statement'
  },

  // Math & Logic
  {
    type: 'solidity_keccak256',
    message0: 'keccak256(%1)',
    args0: [
      {
        type: 'input_value',
        name: 'INPUT',
        check: 'String'
      }
    ],
    output: 'String',
    colour: 300,
    tooltip: 'Keccak256 hash function'
  },
  {
    type: 'solidity_abi_encode',
    message0: 'abi.encode(%1)',
    args0: [
      {
        type: 'input_value',
        name: 'INPUT',
        check: 'String'
      }
    ],
    output: 'String',
    colour: 300,
    tooltip: 'ABI encode function'
  }
]

// Register all Solidity blocks
export function registerSolidityBlocks() {
  const definitions = Blockly.common.createBlockDefinitionsFromJsonArray(solidityBlockDefinitions)
  Blockly.common.defineBlocks(definitions)
}
