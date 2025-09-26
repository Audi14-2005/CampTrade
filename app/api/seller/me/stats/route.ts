import { db } from "@/lib/mock-db"

export async function GET() {
  const mine = db.products.filter((p) => p.sellerId === "me")
  const reservedCount = mine.filter((p) => p.reserved).length
  const completedOrders = db.orders.filter(
    (o) => mine.some((p) => p.id === o.productId) && o.status === "completed",
  ).length
  const trustBadge = completedOrders >= 10 ? "gold" : completedOrders >= 3 ? "silver" : "bronze"

  return Response.json({
    sellerName: "You",
    totalProducts: mine.length,
    reservedCount,
    trustBadge,
  })
}
