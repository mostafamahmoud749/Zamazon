import HeaderMedia from "./HeaderMedia";
import { fetchProducts } from "@/hooks/fetchProducts"
import Footer from "@/components/layout/footer/Footer";
import { headers } from "next/headers";
export default async function RootLayout({ children }) {
  const headersList = await headers()
  
  const products = await fetchProducts("https://fakestoreapi.com/products")
  const navs = (products && products.length
    ? Array.from(new Set(products.map(p => p.category))).sort()
    : ["Home", "Health & Household", "Books", "PC", "clothes"]
  ).map(category => ({ group: "departments", key: category }));
  
  const userAgent = headersList.get("user-agent") || ""
  return (
    <div className="flex flex-col">
      <HeaderMedia userAgent={userAgent} navs={navs}/>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
