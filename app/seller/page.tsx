import { redirect } from "next/navigation"

export default function SellerIndexPage() {
  // Redirect to the seller home dashboard
  redirect("/seller/home")
}
