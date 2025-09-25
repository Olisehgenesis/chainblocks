'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Github, Settings, Play, Home, Code } from 'lucide-react'
import { ReusableButton } from '@/components/ReusableButton'

export default function Header() {
  const pathname = usePathname()
  const isAppPage = pathname === '/app'

  return (
    <header className="border-b bg-gradient-to-r from-lime-600 to-gray-700 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  ChainBlocks
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  Visual Programming for Blockchain Development
                </p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Navigation */}
            <div className="flex items-center space-x-1 mr-4">
              <Link href="/">
                <Button 
                  variant={pathname === '/' ? "secondary" : "ghost"}
                  size="sm"
                  className={pathname === '/' ? "bg-white/20 text-white" : "text-white hover:bg-white/20"}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/app">
                <Button 
                  variant={isAppPage ? "secondary" : "ghost"}
                  size="sm"
                  className={isAppPage ? "bg-white/20 text-white" : "text-white hover:bg-white/20"}
                >
                  <Code className="w-4 h-4 mr-2" />
                  App
                </Button>
              </Link>
            </div>

            {/* App-specific buttons */}
            {isAppPage && (
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </Button>
            )}

            {/* Wallet Connect */}
            <div className="ml-2 flex items-center gap-2">
              <appkit-button />
              <ReusableButton className="px-2 py-1 text-xs" onClick={() => {
                const el = document.querySelector('appkit-button') as HTMLElement | null
                el?.click()
              }}>
                Login
              </ReusableButton>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Github className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
