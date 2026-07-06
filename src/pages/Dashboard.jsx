import { useState, useEffect } from "react"
import { supabase } from '../lib/supabase'
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [weekRevenue, setWeekRevenue] = useState(0)
  const [lowStock, SetLowStock] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      // Today Revenue
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const { data: todaySales } = await supabase.from('sales').select('total').gte('created_at', startOfDay.toISOString())
      setTodayRevenue(todaySales.reduce((s, r) => s + r.total, 0) || 0)

      // Week Revenue
      const startOfWeek = new Date()
      startOfWeek.setDate(
        startOfWeek.getDate() - 7
      )
      const { data: weekSales } = await supabase.from('sales').select('total').gte('created_at', startOfWeek.toISOString())
      setWeekRevenue(weekSales.reduce((s, r) => s + r.total, 0) || 0)

      // Top topProduct
      const { data: items } = await supabase.from('sale_items').select('qty, products(name)')
      const grouped = {}
      items?.forEach(i => {
        const name = i.products?.name || 'Unknown'
        grouped[name] = (grouped[name] || 0) + i.qty
      })
      const sorted = Object.entries(grouped).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5)
      setTopProducts(sorted)

      // Low Stock
      const { data: low } = await supabase.from('products').select('*')
      SetLowStock(low?.filter(p => p.stock_qty <= p.low_stock_threshold) || [])

      setLoading(false)
    }

    fetchDashboard()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Today's Revenue</p>
            <p className="text-2xl font-bold">Rs. {todayRevenue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Last 7 Days Revenue</p>
            <p className="text-2xl font-bold">Rs. {weekRevenue}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-3">Top 5 Selling Products</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-3">Low Stock Alerts</h2>
          {lowStock.length === 0 ? <p className="text-gray-400 text-sm">All stocked up.</p> : (
            <ul className="space-y-1">
              {lowStock.map(p => (
                <li key={p.id} className="text-sm text-red-600">{p.name} — {p.stock_qty} left</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
