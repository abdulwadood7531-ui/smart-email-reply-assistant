import React from 'react'

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export default function Logo({ size = 40, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div 
        className="relative flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 rounded-2xl shadow-lg"
        style={{ width: size, height: size }}
      >
        {/* Envelope base */}
        <svg 
          width={size * 0.6} 
          height={size * 0.6} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Envelope body */}
          <path 
            d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* AI Sparkle */}
          <circle cx="18" cy="6" r="3" fill="#FCD34D" className="animate-pulse" />
          <path 
            d="M18 4.5V7.5M16.5 6H19.5" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-emerald-600 via-green-600 to-cyan-600 bg-clip-text text-transparent">
            Email Reply
          </h1>
          <p className="text-xs text-emerald-600 font-medium leading-tight">AI Assistant</p>
        </div>
      )}
    </div>
  )
}
