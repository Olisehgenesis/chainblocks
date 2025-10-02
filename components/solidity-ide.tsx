'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import DeployContract from '@/components/deploy-contract';
import { 
  FileText, 
  Play, 
  Save, 
  Trash2, 
  Plus, 
  FolderOpen,
  Code,
  Settings,
  Zap
} from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  content?: string;
}

interface CompilationResult {
  success: boolean;
  output?: any;
  error?: string;
}

export default function SolidityIDE() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [newFileName, setNewFileName] = useState<string>('');
  const [compilationResults, setCompilationResults] = useState<Map<string, CompilationResult>>(new Map());
  const [isCompiling, setIsCompiling] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const log = useCallback((message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  // API calls
  const loadFiles = async () => {
    try {
      const response = await fetch('/api/ide/files');
      const data = await response.json();
      if (data.success) {
        setFiles(data.files.map((file: string) => ({ name: file, path: file })));
        log(`Loaded ${data.files.length} files`);
      } else {
        log(`Failed to load files: ${data.error}`);
      }
    } catch (error) {
      log(`Error loading files: ${error.message}`);
    }
  };

  const loadFileContent = async (filePath: string) => {
    try {
      const response = await fetch(`/api/ide/file?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();
      if (data.success) {
        setFileContent(data.content);
        setSelectedFile(filePath);
        log(`Loaded file: ${filePath}`);
      } else {
        log(`Failed to load file: ${data.error}`);
      }
    } catch (error) {
      log(`Error loading file: ${error.message}`);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    
    try {
      const response = await fetch('/api/ide/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: selectedFile,
          content: fileContent
        })
      });
      
      const data = await response.json();
      if (data.success) {
        log(`Saved file: ${selectedFile}`);
      } else {
        log(`Failed to save file: ${data.error}`);
      }
    } catch (error) {
      log(`Error saving file: ${error.message}`);
    }
  };

  const createFile = async () => {
    if (!newFileName.trim()) return;
    
    const fileName = newFileName.endsWith('.sol') ? newFileName : `${newFileName}.sol`;
    const defaultContent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ${newFileName.replace('.sol', '')} {
    // Your contract code here
}`;

    try {
      const response = await fetch('/api/ide/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: fileName,
          content: defaultContent
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setNewFileName('');
        await loadFiles();
        await loadFileContent(fileName);
        log(`Created file: ${fileName}`);
      } else {
        log(`Failed to create file: ${data.error}`);
      }
    } catch (error) {
      log(`Error creating file: ${error.message}`);
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      const response = await fetch(`/api/ide/file?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        await loadFiles();
        if (selectedFile === filePath) {
          setSelectedFile(null);
          setFileContent('');
        }
        log(`Deleted file: ${filePath}`);
      } else {
        log(`Failed to delete file: ${data.error}`);
      }
    } catch (error) {
      log(`Error deleting file: ${error.message}`);
    }
  };

  const compileFile = async (filePath: string) => {
    setIsCompiling(true);
    try {
      const response = await fetch('/api/ide/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      
      const data = await response.json();
      const result: CompilationResult = {
        success: data.success,
        output: data.output,
        error: data.error
      };
      
      setCompilationResults(prev => new Map(prev.set(filePath, result)));
      
      if (data.success) {
        log(`✅ Compiled successfully: ${filePath}`);
      } else {
        log(`❌ Compilation failed: ${filePath} - ${data.error}`);
      }
    } catch (error) {
      log(`Error compiling file: ${error.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const compileAll = async () => {
    setIsCompiling(true);
    try {
      const response = await fetch('/api/ide/compile-all', {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        const results = new Map();
        Object.entries(data.output).forEach(([file, result]: [string, any]) => {
          results.set(file, {
            success: !result.error,
            output: result,
            error: result.error
          });
        });
        setCompilationResults(results);
        log(`✅ Compiled all files`);
      } else {
        log(`❌ Compilation failed: ${data.error}`);
      }
    } catch (error) {
      log(`Error compiling all files: ${error.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Code className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Solidity IDE</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={saveFile} disabled={!selectedFile} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={compileAll} disabled={isCompiling} size="sm">
            <Zap className="h-4 w-4 mr-2" />
            {isCompiling ? 'Compiling...' : 'Compile All'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Browser */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2 mb-3">
              <Input
                placeholder="New file name..."
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createFile()}
              />
              <Button onClick={createFile} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={loadFiles} variant="outline" size="sm" className="w-full">
              <FolderOpen className="h-4 w-4 mr-2" />
              Refresh Files
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {files.map((file) => (
                <div
                  key={file.path}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedFile === file.path ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => loadFileContent(file.path)}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.path);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="compilation">Compilation</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 flex flex-col">
              {selectedFile ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="font-medium">{selectedFile}</h3>
                    <Button onClick={() => compileFile(selectedFile)} disabled={isCompiling} size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Compile
                    </Button>
                  </div>
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="flex-1 font-mono text-sm resize-none border-0"
                    placeholder="Start writing your Solidity contract..."
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a file to start editing</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="compilation" className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {Array.from(compilationResults.entries()).map(([file, result]) => (
                    <Card key={file}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{file}</span>
                          {result.success ? (
                            <span className="text-green-600 text-sm">✅ Success</span>
                          ) : (
                            <span className="text-red-600 text-sm">❌ Failed</span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.success ? (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              ABI Length: {result.output?.contracts?.[file]?.[Object.keys(result.output.contracts[file] || {})[0]]?.abi?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600">
                              Bytecode Length: {result.output?.contracts?.[file]?.[Object.keys(result.output.contracts[file] || {})[0]]?.evm?.bytecode?.object?.length || 0}
                            </p>
                          </div>
                        ) : (
                          <p className="text-red-600 text-sm">{result.error}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="deployment" className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {selectedFile ? (
                    <DeployContract 
                      contractName={selectedFile.replace('.sol', '')}
                      onDeployed={(address) => {
                        log(`✅ Contract deployed at: ${address}`);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a compiled contract to deploy</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="messages" className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="space-y-1">
                    {messages.map((message, index) => (
                      <div key={index} className="text-sm font-mono text-gray-700">
                        {message}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
