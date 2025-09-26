export type Product = {
  id: string
  title: string
  description: string
  images: string[]
  price: number
  quantity: number
  discount?: number
  discountEndDate?: string | null
  category?: string
  tags?: string[]
  sellerId?: string
  status?: "published" | "draft"
  rating?: number
  reserved?: boolean
}

export type Order = {
  id: string
  productId: string
  buyerName: string
  status: "processing" | "completed" | "shipped"
  createdAt: string
}

export type Todo = {
  id: string
  title: string
  description?: string
  dueDate?: string
  status: "todo" | "in-progress" | "done"
}

const products: Product[] = [
  {
    id: "p1",
    title: "Introduction to Algorithms - 3rd Ed",
    description: "Used - good condition",
    images: ["/algorithms-book.jpg"],
    price: 45,
    quantity: 1,
    discount: 10,
    discountEndDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    category: "Books",
    tags: ["CS", "Textbook"],
    sellerId: "me",
    status: "published",
    rating: 4.6,
  },
  {
    id: "p2",
    title: "TI-84 Plus Calculator",
    description: "Barely used, includes case.",
    images: ["/basic-calculator.png"],
    price: 30,
    quantity: 2,
    sellerId: "me",
    status: "published",
    rating: 4.3,
  },
  {
    id: "p3",
    title: "Noise-cancelling Headphones",
    description: "Great for the library. Minor scuffs.",
    images: ["/diverse-people-listening-headphones.png"],
    price: 80,
    quantity: 1,
    sellerId: "user_abc",
    status: "published",
    rating: 4.8,
  },
]

const orders: Order[] = [
  {
    id: "o1",
    productId: "p1",
    buyerName: "Alex Kim",
    status: "processing",
    createdAt: new Date().toISOString(),
  },
]

const todos: Todo[] = []

export const db = {
  products,
  orders,
  todos,
}
