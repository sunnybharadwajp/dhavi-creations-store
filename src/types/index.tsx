export interface Category {
   id: number
   name: string
   description: string | null
   products: Product[] | null
   createdAt: Date
   updatedAt: Date
}

export interface Product {
   id: number
   name: string
   description: string | null
   category: Category
   categoryId: number
   price: number
   stock: number
   images: Image[]
   coverImageIndex: number
   sku: string
   createdAt: Date
   updatedAt: Date
   orderItems: OrderItem[]
}

export interface Image {
   id: number
   url: string
   product: Product
   productId: number
   createdAt: Date
   updatedAt: Date
}

export interface Customer {
   id: number
   name: string
   email: string
   phone: string | null
   address: string | null
   city: string | null
   postalCode: string | null
   country: string | null
   orders: Order[]
   createdAt: Date
   updatedAt: Date
}

export interface User {
   id: number
   username: string
   password_hash: string
   sessions: Session[]
   role: string
   createdAt: Date
   updatedAt: Date
}

export interface Session {
   id: number
   user: User
   userId: number
   expiresAt: Date
}

export interface Order {
   id: number
   customer: Customer
   customerId: number
   orderItems: OrderItem[]
   totalPrice: number
   status: string
   createdAt: Date
   updatedAt: Date
}

export interface OrderItem {
   id: number
   order: Order
   orderId: number
   product: Product
   productId: number
   quantity: number
   price: number
   createdAt: Date
   updatedAt: Date
}

export type ApiResponse<T> = {
   success: boolean
   data?: T
   error?: string
}

export type ProductFormData = {
   name: string
   description: string
   categoryId: number
   price: number
   stock: number
   // Remove sku from here as it will be generated server-side
}
