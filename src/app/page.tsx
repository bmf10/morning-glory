import Category from '@/components/pages/home/Category'
import Product from '@/components/pages/home/Product'
import Stock from '@/components/pages/home/Stock'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="w-[1200px] p-10">
        <Link
          href="#"
          className="flex items-center gap-2 text-3xl text-blue-500 mb-8 font-semibold"
        >
          <ArrowLeft strokeWidth={3} />
          Log Aktivitas Promosi
        </Link>
        <div className="w-full flex justify-center">
          <Tabs defaultValue="product" className="w-full">
            <TabsList className="mx-auto">
              <TabsTrigger value="product">Master Barang</TabsTrigger>
              <TabsTrigger value="category">Master Kategori Barang</TabsTrigger>
              <TabsTrigger value="stock">Stock barang</TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <Product />
            </TabsContent>
            <TabsContent value="category">
              <Category />
            </TabsContent>
            <TabsContent value="stock">
              <Stock />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
