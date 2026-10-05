'use client'

import React from 'react'

export interface SoftSwitch3DProps {
  checked: boolean
  onChange: (checked: boolean) => void
  leftLabel?: string
  rightLabel?: string
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  className?: string
  disabled?: boolean
}

export const SoftSwitch3D: React.FC<SoftSwitch3DProps> = ({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  size = 'md',
  ariaLabel = 'Toggle Switch',
  className = '',
  disabled = false,
}) => {
  const sizeConfig = {
    sm: {
      track: 'h-6 w-12 p-[2px]',
      knob: 'h-5 w-5',
      translate: 'translate-x-6',
      text: 'text-[10px]',
    },
    md: {
      track: 'h-8 w-16 p-[3px]',
      knob: 'h-6 w-6',
      translate: 'translate-x-8',
      text: 'text-xs',
    },
    lg: {
      track: 'h-10 w-20 p-1',
      knob: 'h-8 w-8',
      translate: 'translate-x-10',
      text: 'text-sm',
    },
  }[size]

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {leftLabel && (
        <button
          type="button"
          onClick={() => !disabled && onChange(false)}
          className={`font-bold transition-colors cursor-pointer ${sizeConfig.text} ${
            !checked ? 'text-blue-700 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {leftLabel}
        </button>
      )}

      {/* Outer Raised 3D Bezel Frame */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex items-center rounded-full cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          sizeConfig.track
        } ${
          checked ? 'bg-[#1877F2]' : 'bg-slate-300'
        } border-2 border-white/95 shadow-[inset_0_2px_5px_rgba(0,0,0,0.24),0_3px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {/* Floating 3D White Button / Knob */}
        <span
          className={`inline-block rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-[0_3px_8px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transform transition-transform duration-300 ease-in-out ${
            sizeConfig.knob
          } ${checked ? sizeConfig.translate : 'translate-x-0'}`}
        />
      </button>

      {rightLabel && (
        <button
          type="button"
          onClick={() => !disabled && onChange(true)}
          className={`font-bold transition-colors cursor-pointer ${sizeConfig.text} ${
            checked ? 'text-blue-700 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {rightLabel}
        </button>
      )}
    </div>
  )
}
