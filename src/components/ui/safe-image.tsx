"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"

// A robust base64 encoded dark placeholder with a simple grid/gradient pattern
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg width='800' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231a1a2e' /%3E%3Cstop offset='100%25' stop-color='%2316213e' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)' /%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%234a4e69' text-anchor='middle' dominant-baseline='middle'%3EImage Unavailable%3C/text%3E%3C/svg%3E"

interface SafeImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string;
}

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  return (
    <Image
      src={error ? FALLBACK_IMAGE : src}
      alt={alt || "Image"}
      onError={() => setError(true)}
      {...props}
    />
  )
}
