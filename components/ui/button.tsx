import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-emerald-200 hover:scale-105 transition-all duration-300",
      outline: "border-2 border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-700 hover:border-emerald-500 transition-all duration-300",
      ghost: "hover:bg-emerald-50 text-emerald-700 hover:text-emerald-900 transition-all duration-300",
      destructive: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md",
      secondary: "bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500 shadow-md hover:shadow-lg hover:shadow-cyan-200 transition-all duration-300"
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-8 text-lg",
      icon: "h-10 w-10"
    }
    
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
