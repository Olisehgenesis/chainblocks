import Link from 'next/link'
import { ReusableButton } from '@/components/ReusableButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            ChainBlocks
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Visual Programming for Blockchain Development
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Visual Programming</h3>
            <p className="text-sm text-gray-600">Drag and drop blocks to build smart contracts visually</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Languages</h3>
            <p className="text-sm text-gray-600">Generate code in Solidity, Cairo, and Rust</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain Ready</h3>
            <p className="text-sm text-gray-600">Built specifically for blockchain development</p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link href="/app">
            <ReusableButton className="px-8 py-3 text-lg">
              Enter App
            </ReusableButton>
          </Link>
          <p className="text-sm text-gray-500">
            Start building smart contracts with visual programming
          </p>
        </div>
      </div>
    </div>
  )
}
