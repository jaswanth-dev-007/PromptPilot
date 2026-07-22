'use client'

import React, { type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8125rem',
        fontFamily: 'inherit',
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#D1D5DB' }}>/</span>}
          {item.href ? (
            <Link
              href={item.href}
              style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 400 }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#111827', fontWeight: 500 }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
