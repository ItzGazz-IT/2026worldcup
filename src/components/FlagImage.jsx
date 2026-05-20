import React, { useState } from 'react'

/**
 * Renders a country flag image from flagcdn.com.
 * Falls back to the emoji flag if the image fails to load.
 *
 * Props:
 *   code  – ISO 3166-1 alpha-2 code, lowercase (e.g. 'ar', 'gb-eng', 'gb-sct')
 *   emoji – fallback emoji flag string
 *   size  – pixel width for the image (default 40)
 *   className – extra CSS classes
 *   style – extra inline styles
 */
export default function FlagImage({ code, emoji = '🏳️', size = 40, className = '', style = {} }) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const normalizedCode = String(code || '').toLowerCase()
  const iso2Fallback = normalizedCode.includes('-')
    ? normalizedCode.split('-')[0]
    : normalizedCode

  const sources = [
    `https://flagcdn.com/w${size}/${normalizedCode}.png`,
    `https://flagcdn.com/${normalizedCode}.svg`,
    iso2Fallback.length === 2 ? `https://flagicons.lipis.dev/flags/4x3/${iso2Fallback}.svg` : null,
    iso2Fallback.length === 2 ? `https://flagsapi.com/${iso2Fallback.toUpperCase()}/flat/64.png` : null,
  ].filter(Boolean)

  const activeSrc = sources[sourceIndex]
  const canShowImage = Boolean(normalizedCode) && Boolean(activeSrc)
  const isPngSource = activeSrc ? activeSrc.endsWith('.png') : false
  const activeSrcSet = isPngSource ? `${activeSrc.replace(`/w${size}/`, `/w${size * 2}/`)} 2x` : undefined

  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        lineHeight: 1,
        ...style,
      }}
      role="img"
      aria-label="country flag"
    >
      {/* Always render a visible neutral fallback (never country abbreviations). */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          fontSize: size * 0.62,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: canShowImage && loaded ? 0 : 1,
          transition: 'opacity 120ms ease-out',
        }}
        aria-hidden="true"
      >
        {emoji}
      </span>

      {canShowImage && (
        <img
          src={activeSrc}
          srcSet={activeSrcSet}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setSourceIndex(i => i + 1)
          }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 3,
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
        />
      )}
    </span>
  )
}
