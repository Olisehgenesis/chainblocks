import * as Blockly from 'blockly'

// Solidity Block Definitions
export const solidityBlockDefinitions = [
  // Variables
  {
    type: 'solidity_global_variable_declare',
    message0: 'declare %1 %2 %3 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'VISIBILITY',
        options: [
          ['public', 'public'],
          ['private', 'private'],
          ['internal', 'internal']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['uint256', 'uint256'],
          ['address', 'address'],
          ['bool', 'bool'],
          ['string', 'string'],
          ['bytes32', 'bytes32']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'myVariable'
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: 'Declare a global state variable - stored on blockchain'
  },
  {
    type: 'solidity_global_variable_assign',
    message0: '%1 = %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'VARIABLE',
        text: 'myVariable'
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['Number', 'String', 'Boolean']
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: 'Assign a value to a global variable'
  },
  {
    type: 'solidity_local_variable',
    message0: 'local %1 %2 = %3 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['uint256', 'uint256'],
          ['address', 'address'],
          ['bool', 'bool'],
          ['string', 'string'],
          ['bytes32', 'bytes32']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'localVar'
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['Number', 'String', 'Boolean']
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: 'Local variable - exists only during function execution'
  },
  {
    type: 'solidity_variable_assignment',
    message0: '%1 = %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'VARIABLE',
        text: 'myVar'
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['Number', 'String', 'Boolean']
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: 'Assign a value to a variable'
  },
  {
    type: 'solidity_variable_reference',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'VARIABLE',
        text: 'myVar'
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    output: 'String',
    colour: 180,
    tooltip: 'Reference a variable value'
  },
  {
    type: 'solidity_variable_dropdown',
    message0: '%1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'VARIABLE',
        options: [
          ['owner', 'owner'],
          ['admin', 'admin'],
          ['user', 'user'],
          ['contract', 'contract'],
          ['token', 'token'],
          ['recipient', 'recipient'],
          ['sender', 'sender'],
          ['myVar', 'myVar']
        ]
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    output: 'String',
    colour: 180,
    tooltip: 'Reference a common variable name'
  },
  {
    type: 'solidity_constant',
    message0: 'constant %1 %2 = %3 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['uint256', 'uint256'],
          ['address', 'address'],
          ['bool', 'bool'],
          ['string', 'string'],
          ['bytes32', 'bytes32']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'CONSTANT_VALUE'
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: ['Number', 'String', 'Boolean']
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: 'Constant value - cannot be changed after deployment'
  },
  {
    type: 'solidity_immutable',
    message0: 'immutable %1 %2 %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['uint256', 'uint256'],
          ['address', 'address'],
          ['bool', 'bool'],
          ['string', 'string'],
          ['bytes32', 'bytes32']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'immutableVar'
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 180,
    tooltip: 'Immutable variable - set once in constructor'
  },

  // Data Types
  {
    type: 'solidity_uint',
    message0: 'uint%1 %2 %3',
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
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    output: 'Number',
    colour: 210,
    tooltip: 'Unsigned integer variable - stores positive whole numbers'
  },
  {
    type: 'solidity_address',
    message0: 'address %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'addr'
      },
      {
        type: 'field_image',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTggNlYxME04IDZMMTYgOCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
        width: 16,
        height: 16,
        alt: 'Info'
      }
    ],
    output: 'String',
    colour: 210,
    tooltip: 'Ethereum address variable - stores wallet addresses'
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
    type: 'solidity_event_advanced',
    message0: 'event %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'MessageUpdated'
      },
      {
        type: 'input_statement',
        name: 'PARAMS'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'Advanced event with indexed parameters'
  },
  {
    type: 'solidity_event_param',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['address', 'address'],
          ['uint256', 'uint256'],
          ['string', 'string'],
          ['bool', 'bool'],
          ['bytes32', 'bytes32']
        ]
      },
      {
        type: 'field_input',
        name: 'NAME',
        text: 'param'
      },
      {
        type: 'field_dropdown',
        name: 'INDEXED',
        options: [
          ['', ''],
          ['indexed', 'indexed']
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: 'Event parameter (can be indexed)'
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
    type: 'solidity_if',
    message0: 'if %1 %2',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: 'Boolean'
      },
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: 'If statement - execute code if condition is true'
  },
  {
    type: 'solidity_if_else',
    message0: 'if %1 %2 else %3',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: 'Boolean'
      },
      {
        type: 'input_statement',
        name: 'DO'
      },
      {
        type: 'input_statement',
        name: 'ELSE'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: 'If-else statement - execute different code based on condition'
  },
  {
    type: 'solidity_for_loop',
    message0: 'for (%1; %2; %3) %4',
    args0: [
      {
        type: 'input_value',
        name: 'INIT',
        check: 'String'
      },
      {
        type: 'input_value',
        name: 'CONDITION',
        check: 'Boolean'
      },
      {
        type: 'input_value',
        name: 'INCREMENT',
        check: 'String'
      },
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: 'For loop - repeat code while condition is true'
  },
  {
    type: 'solidity_while_loop',
    message0: 'while %1 %2',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: 'Boolean'
      },
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: 'While loop - repeat code while condition is true'
  },
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

  // Logic & Comparison
  {
    type: 'solidity_equals',
    message0: '%1 == %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: ['Number', 'String', 'Boolean']
      },
      {
        type: 'input_value',
        name: 'B',
        check: ['Number', 'String', 'Boolean']
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if two values are equal'
  },
  {
    type: 'solidity_not_equals',
    message0: '%1 != %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: ['Number', 'String', 'Boolean']
      },
      {
        type: 'input_value',
        name: 'B',
        check: ['Number', 'String', 'Boolean']
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if two values are not equal'
  },
  {
    type: 'solidity_less_than',
    message0: '%1 < %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if first value is less than second'
  },
  {
    type: 'solidity_greater_than',
    message0: '%1 > %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if first value is greater than second'
  },
  {
    type: 'solidity_and',
    message0: '%1 && %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Boolean'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Boolean'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Logical AND - both conditions must be true'
  },
  {
    type: 'solidity_or',
    message0: '%1 || %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Boolean'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Boolean'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Logical OR - at least one condition must be true'
  },
  {
    type: 'solidity_not',
    message0: '!%1',
    args0: [
      {
        type: 'input_value',
        name: 'BOOL',
        check: 'Boolean'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Logical NOT - invert boolean value'
  },
  {
    type: 'solidity_true',
    message0: 'true',
    output: 'Boolean',
    colour: 300,
    tooltip: 'Boolean true value'
  },
  {
    type: 'solidity_false',
    message0: 'false',
    output: 'Boolean',
    colour: 300,
    tooltip: 'Boolean false value'
  },

  // Math Operations
  {
    type: 'solidity_add',
    message0: '%1 + %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Add two numbers'
  },
  {
    type: 'solidity_subtract',
    message0: '%1 - %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Subtract second number from first'
  },
  {
    type: 'solidity_multiply',
    message0: '%1 * %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Multiply two numbers'
  },
  {
    type: 'solidity_divide',
    message0: '%1 / %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Divide first number by second'
  },
  {
    type: 'solidity_modulo',
    message0: '%1 % %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'Number'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'Number'
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Modulo operation - remainder after division'
  },
  {
    type: 'solidity_number',
    message0: '%1',
    args0: [
      {
        type: 'field_number',
        name: 'NUM',
        value: 0
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Number literal'
  },
  {
    type: 'solidity_string_literal',
    message0: '"%1"',
    args0: [
      {
        type: 'field_input',
        name: 'TEXT',
        text: 'hello'
      }
    ],
    output: 'String',
    colour: 300,
    tooltip: 'String literal'
  },

  // Solidity Global Variables
  {
    type: 'solidity_msg_sender',
    message0: 'msg.sender',
    output: 'String',
    colour: 300,
    tooltip: 'Address of the message sender'
  },
  {
    type: 'solidity_msg_value',
    message0: 'msg.value',
    output: 'Number',
    colour: 300,
    tooltip: 'Amount of Ether sent with the message'
  },
  {
    type: 'solidity_block_timestamp',
    message0: 'block.timestamp',
    output: 'Number',
    colour: 300,
    tooltip: 'Current block timestamp'
  },
  {
    type: 'solidity_address_this',
    message0: 'address(this)',
    output: 'String',
    colour: 300,
    tooltip: 'Address of the current contract'
  },
  {
    type: 'solidity_this_balance',
    message0: 'address(this).balance',
    output: 'Number',
    colour: 300,
    tooltip: 'Balance of the current contract'
  },

  // Address Operations
  {
    type: 'solidity_address_zero',
    message0: 'address(0)',
    output: 'String',
    colour: 300,
    tooltip: 'Zero address - used for null checks'
  },
  {
    type: 'solidity_address_cast',
    message0: 'address(%1)',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      }
    ],
    output: 'String',
    colour: 300,
    tooltip: 'Cast to address type'
  },
  {
    type: 'solidity_address_balance',
    message0: '%1.balance',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      }
    ],
    output: 'Number',
    colour: 300,
    tooltip: 'Get balance of an address'
  },
  {
    type: 'solidity_address_transfer',
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
    colour: 300,
    tooltip: 'Transfer Ether to address'
  },
  {
    type: 'solidity_address_send',
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
    colour: 300,
    tooltip: 'Send Ether to address (returns bool)'
  },
  {
    type: 'solidity_address_call',
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
    colour: 300,
    tooltip: 'Low-level call to address'
  },
  {
    type: 'solidity_address_equal',
    message0: '%1 == %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'String'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'String'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if two addresses are equal'
  },
  {
    type: 'solidity_address_not_equal',
    message0: '%1 != %2',
    args0: [
      {
        type: 'input_value',
        name: 'A',
        check: 'String'
      },
      {
        type: 'input_value',
        name: 'B',
        check: 'String'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if two addresses are not equal'
  },
  {
    type: 'solidity_address_is_zero',
    message0: '%1 == address(0)',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if address is zero address'
  },
  {
    type: 'solidity_address_not_zero',
    message0: '%1 != address(0)',
    args0: [
      {
        type: 'input_value',
        name: 'ADDRESS',
        check: 'String'
      }
    ],
    output: 'Boolean',
    colour: 300,
    tooltip: 'Check if address is not zero address'
  },
  {
    type: 'solidity_owner',
    message0: 'owner',
    output: 'String',
    colour: 300,
    tooltip: 'Contract owner address'
  },

  // Advanced Math & Logic
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
