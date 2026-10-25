import { supabase } from "../lib/supabase"
import { useState, useEffect } from "react"
import { useAuth } from "../context/useAuth"
import Navbar from "../components/Navbar"

export default function Sell() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const { user } = useAuth()
  const [receipt, setReceipt] = useState(null)
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data || [])
    setProductsLoading(false)
  }

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        if (existing.qty >= product.stock_qty) return prev
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      }
      return [
        ...prev,
        {
          ...product,
          qty: 1
        }
      ]

    })
  }

  function updateQty(id, delta) {
    setCart(prev => prev.map(item => {
      if (item.id !== id) return item
      const newQty = item.qty + delta
      if (newQty <= 0) return null
      if (newQty > item.stock_qty) return item
      return { ...item, qty: newQty }
    }).filter(Boolean))
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  async function handleCheckout() {

    // validation
    if (cart.length === 0) return
    setLoading(true)

    // create sale
    const { 'data': sale, 'error': saleError } = await supabase.from('sales').insert({ cashier_id: user.id, total, payment_method: paymentMethod }).select().single()

    if (saleError) {
      alert(saleError.message)
      setLoading(false)
      return
    }

    // create sale items
    const salesItems = cart.map(item => ({
      sale_id: sale.id,
      product_id: item.id,
      qty: item.qty,
      price_at_sale: item.price
    }))

    const { error: itemsError } = await supabase.from('sale_items').insert(salesItems)
    if (itemsError) {
      alert(itemsError.message)
      setLoading(false)
      return
    }

    // update stock
    for (const item of cart) {
      const { error } = await supabase.from('products').update({ stock_qty: item.stock_qty - item.qty }).eq('id', item.id)
      if (error) console.error('Stock update failed:', error.message)
    }

    setReceipt({
      items: cart,
      total,
      paymentMethod,
      date: new Date().toLocaleString()
    })

    // clear cart
    setCart([])

    // refresh products
    fetchProducts()
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        {/* Product list */}
        <div className="w-full md:w-2/3 p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto">
          {productsLoading ? (
            <p className="text-gray-400 col-span-3">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-400 col-span-3">No products yet. Add some in Inventory.</p>
          ) : products.map(p => (
            <button key={p.id} onClick={() => addToCart(p)}
              disabled={p.stock_qty <= 0}
              className="bg-white rounded-lg shadow p-4 text-left hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">Rs. {p.price}</p>
              <p className="text-xs text-gray-400">Stock: {p.stock_qty}</p>
            </button>
          ))}
        </div>

        {/* Cart */}
        <div className="w-full md:w-1/3 bg-white p-4 flex flex-col shadow-lg">
          <h2 className="text-lg font-bold mb-4">Cart</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Rs. {item.price} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="px-2 bg-gray-200 rounded">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs ml-2">✕</button>
                </div>
              </div>
            ))}
            {cart.length === 0 && <p className="text-gray-400 text-sm">Cart is empty</p>}
          </div>

          <div className="border-t pt-4 mt-4">
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3">
              <option value="cash">Cash</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="jazzcash">JazzCash</option>
            </select>
            <p className="text-xl font-bold mb-3">Total: Rs. {total}</p>
            <button onClick={handleCheckout} disabled={loading || cart.length === 0}
              className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>

        {receipt && <Receipt data={receipt} onClose={() => setReceipt(null)} />}
      </div>
    </>
  )

  function Receipt({ data, onClose }) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80 print:w-full">
          <h2 className="text-lg font-bold text-center mb-2">UmaPOS</h2>
          <p className="text-xs text-center text-gray-500 mb-4">{data.date}</p>
          <div className="space-y-1 border-t border-b py-3 mb-3">
            {data.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.qty}</span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold mb-1">
            <span>Total</span>
            <span>Rs. {data.total}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 capitalize">Paid via {data.paymentMethod}</p>
          <div className="flex gap-2 print:hidden">
            <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-2 rounded">Print</button>
            <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Close</button>
          </div>
        </div>
      </div>
    )
  }
}