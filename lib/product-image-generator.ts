// Product image generator that creates unique images based on product details
import { Product } from './api'

// Generate a unique image URL based on product characteristics
export function generateProductImageUrl(product: Product): string {
  // Create a unique hash based on product details
  const productHash = createProductHash(product)

  // Generate a unique color scheme based on category
  const colorScheme = getCategoryColorScheme(product.category)

  // Create a unique pattern based on product name
  const pattern = generatePattern(product.name)

  // Return a data URL for a unique SVG image
  return generateSVGImage(product, colorScheme, pattern, productHash)
}

function createProductHash(product: Product): string {
  const str = `${product.name}-${product.category}-${product.id}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

function getCategoryColorScheme(category: string): { primary: string; secondary: string; accent: string } {
  const schemes: Record<string, { primary: string; secondary: string; accent: string }> = {
    'electronics': { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
    'books': { primary: '#10B981', secondary: '#047857', accent: '#34D399' },
    'clothes': { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
    'general': { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
    'default': { primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' }
  }

  return schemes[category.toLowerCase()] || schemes['default']
}

function generatePattern(productName: string): string {
  // Create a simple pattern based on product name
  const patterns = ['dots', 'lines', 'squares', 'circles', 'triangles']
  const index = productName.length % patterns.length
  return patterns[index]
}

function generateSVGImage(
  product: Product,
  colorScheme: { primary: string; secondary: string; accent: string },
  pattern: string,
  hash: string
): string {
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:0.05" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:0.1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="400" fill="url(#bg-${hash})" />
      
      <!-- Main product area -->
      <rect x="50" y="50" width="300" height="300" fill="white" stroke="${colorScheme.primary}" stroke-width="3" rx="16" />
      
      <!-- Product icon based on category and name -->
      ${generateSpecificProductIcon(product, colorScheme.primary)}
      
      <!-- Product name -->
      <text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${colorScheme.secondary}">
        ${product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name}
      </text>
      
      <!-- Price -->
      <text x="200" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="${colorScheme.primary}">
        Rs ${product.price}
      </text>
      
      <!-- Category badge -->
      <rect x="60" y="60" width="90" height="28" fill="${colorScheme.primary}" rx="14" />
      <text x="105" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white">
        ${product.category.toUpperCase()}
      </text>
    </svg>
  `

  // Encode SVG properly to handle Unicode characters
  try {
    // Try base64 encoding first
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  } catch (error) {
    // Fallback to URL encoding if base64 fails
    const encodedSvg = encodeURIComponent(svg)
    return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
  }
}

function generatePatternSVG(pattern: string, color: string): string {
  switch (pattern) {
    case 'dots':
      return `<circle cx="20" cy="20" r="3" fill="${color}" opacity="0.3" />`
    case 'lines':
      return `<line x1="0" y1="20" x2="40" y2="20" stroke="${color}" stroke-width="2" opacity="0.3" />`
    case 'squares':
      return `<rect x="15" y="15" width="10" height="10" fill="${color}" opacity="0.3" />`
    case 'circles':
      return `<circle cx="20" cy="20" r="8" fill="none" stroke="${color}" stroke-width="2" opacity="0.3" />`
    case 'triangles':
      return `<polygon points="20,5 35,30 5,30" fill="${color}" opacity="0.3" />`
    default:
      return `<circle cx="20" cy="20" r="3" fill="${color}" opacity="0.3" />`
  }
}

function generateSpecificProductIcon(product: Product, color: string): string {
  const name = product.name.toLowerCase()

  // Check for specific product types in the name
  if (name.includes('headphone') || name.includes('headset')) {
    return `
      <g transform="translate(200, 200)">
        <circle cx="0" cy="-20" r="25" fill="${color}" />
        <rect x="-15" y="-35" width="30" height="20" fill="white" rx="10" />
        <rect x="-5" y="-15" width="10" height="30" fill="${color}" />
        <rect x="-8" y="15" width="16" height="8" fill="${color}" rx="4" />
      </g>
    `
  }

  if (name.includes('monitor') || name.includes('screen')) {
    return `
      <g transform="translate(200, 200)">
        <rect x="-40" y="-25" width="80" height="50" fill="${color}" rx="4" />
        <rect x="-35" y="-20" width="70" height="40" fill="white" rx="2" />
        <rect x="-5" y="25" width="10" height="15" fill="${color}" />
        <rect x="-15" y="40" width="30" height="5" fill="${color}" rx="2" />
      </g>
    `
  }

  if (name.includes('jeans') || name.includes('pants')) {
    return `
      <g transform="translate(200, 200)">
        <rect x="-20" y="-30" width="40" height="60" fill="${color}" rx="5" />
        <rect x="-15" y="-25" width="30" height="50" fill="white" rx="3" />
        <rect x="-10" y="-20" width="20" height="8" fill="${color}" />
        <rect x="-8" y="-10" width="16" height="4" fill="${color}" />
        <rect x="-6" y="0" width="12" height="4" fill="${color}" />
      </g>
    `
  }

  if (name.includes('sweater') || name.includes('shirt') || name.includes('dress')) {
    return `
      <g transform="translate(200, 200)">
        <path d="M-25 -20 L0 -30 L25 -20 L25 20 L0 30 L-25 20 Z" fill="${color}" />
        <path d="M-20 -15 L0 -25 L20 -15 L20 15 L0 25 L-20 15 Z" fill="white" />
        <circle cx="0" cy="-5" r="8" fill="${color}" />
        <rect x="-3" y="5" width="6" height="8" fill="${color}" />
      </g>
    `
  }

  if (name.includes('book')) {
    return `
      <g transform="translate(200, 200)">
        <rect x="-30" y="-25" width="60" height="50" fill="${color}" rx="2" />
        <rect x="-25" y="-20" width="50" height="40" fill="white" />
        <line x1="-20" y1="-10" x2="20" y2="-10" stroke="${color}" stroke-width="1" />
        <line x1="-20" y1="0" x2="20" y2="0" stroke="${color}" stroke-width="1" />
        <line x1="-20" y1="10" x2="20" y2="10" stroke="${color}" stroke-width="1" />
      </g>
    `
  }

  // Default category-based icon
  return generateCategoryIcon(product.category, color)
}

function generateCategoryIcon(category: string, color: string): string {
  switch (category.toLowerCase()) {
    case 'electronics':
      return `
        <rect x="170" y="150" width="60" height="40" fill="${color}" rx="4" />
        <rect x="175" y="155" width="50" height="30" fill="white" rx="2" />
        <circle cx="200" cy="170" r="8" fill="${color}" />
      `
    case 'books':
      return `
        <rect x="170" y="150" width="60" height="80" fill="${color}" rx="2" />
        <rect x="175" y="155" width="50" height="70" fill="white" />
        <line x1="180" y1="170" x2="220" y2="170" stroke="${color}" stroke-width="1" />
        <line x1="180" y1="185" x2="220" y2="185" stroke="${color}" stroke-width="1" />
        <line x1="180" y1="200" x2="220" y2="200" stroke="${color}" stroke-width="1" />
      `
    case 'clothes':
      return `
        <path d="M170 150 L200 130 L230 150 L230 200 L200 220 L170 200 Z" fill="${color}" />
        <circle cx="200" cy="160" r="15" fill="white" />
        <path d="M185 175 L215 175" stroke="white" stroke-width="2" />
        <path d="M185 185 L215 185" stroke="white" stroke-width="2" />
      `
    default:
      return `
        <circle cx="200" cy="170" r="20" fill="${color}" />
        <text x="200" y="175" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">?</text>
      `
  }
}
