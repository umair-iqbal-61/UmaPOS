import { useEffect, useState } from "react"
import { supabase } from '../lib/supabase'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    cost_price: '',
    stock_qty: '',
    low_stock_threshold: 5
  })
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data || [])
    setProductsLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      name: form.name,
      sku: form.sku || null,
      price: Number(form.price),
      cost_price: Number(form.cost_price) || null,
      stock_qty: Number(form.stock_qty),
      low_stock_threshold: Number(form.low_stock_threshold)
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      await supabase.from('products').insert(payload)
    }

    setForm({
      name: '',
      sku: '',
      price: '',
      cost_price: '',
      stock_qty: '',
      low_stock_threshold: 5
    })
    setEditingId(null)
    fetchProducts()
  }

  function handleEdit(p) {
    setForm({
      name: p.name,
      sku: p.sku || '',
      price: p.price,
      cost_price: p.cost_price || '',
      stock_qty: p.stock_qty,
      low_stock_threshold: p.low_stock_threshold
    })
    setEditingId(p.id)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="border rounded px-3 py-2" />
        <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="border rounded px-3 py-2" />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="border rounded px-3 py-2" />
        <input placeholder="Cost Price" type="number" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} className="border rounded px-3 py-2" />
        <input placeholder="Stock Qty" type="number" value={form.stock_qty} onChange={e => setForm({ ...form, stock_qty: e.target.value })} required className="border rounded px-3 py-2" />
        <input placeholder="Low Stock Threshold" type="number" value={form.low_stock_threshold} onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })} className="border rounded px-3 py-2" />
        <button type="submit" className="col-span-1 sm:col-span-2 md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow min-w-150">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsLoading ? (
              <tr><td colSpan="5" className="text-gray-400 p-4">Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="text-gray-400 p-4">No products yet.</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className={`border-b ${p.stock_qty <= p.low_stock_threshold ? 'bg-red-50' : ''}`}>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">Rs. {p.price}</td>
                <td className="p-3">
                  {p.stock_qty} {p.stock_qty <= p.low_stock_threshold && <span className="text-red-500 text-xs font-bold ml-1">LOW</span>}
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
