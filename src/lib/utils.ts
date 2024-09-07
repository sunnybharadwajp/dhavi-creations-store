import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function generateSKU(
   productName: string,
   categoryId: number,
   variantId?: number
): string {
   const namePrefix = productName.slice(0, 3).toUpperCase()
   const categoryPrefix = `C${categoryId.toString().padStart(2, '0')}`
   const variantSuffix = variantId
      ? `-V${variantId.toString().padStart(2, '0')}`
      : ''
   const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')

   return `${namePrefix}-${categoryPrefix}-${randomSuffix}${variantSuffix}`
}
