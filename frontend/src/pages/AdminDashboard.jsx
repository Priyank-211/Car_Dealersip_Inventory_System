import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, PackagePlus, AlertTriangle, Search, Car, LayoutDashboard, Store, LogOut, Layers, AlertCircle, CheckCircle2, Box } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal.jsx'
import AddVehicleModal from '../components/AddVehicleModal.jsx'
import EditVehicleModal from '../components/EditVehicleModal.jsx'
import { api } from '../lib/api.js'
import { currency, stockStatus } from '../lib/format.js'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [restockTarget, setRestockTarget] = useState(null)
  const [restockQty, setRestockQty] = useState('')
  const [restocking, setRestocking] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const load = () => {
    setLoading(true)
    api.listVehicles()
      .then((data) => setVehicles(Array.isArray(data) ? data : data.vehicles || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return vehicles
    return vehicles.filter((v) => `${v.make} ${v.model} ${v.category}`.toLowerCase().includes(q))
  }, [vehicles, search])

  const stats = useMemo(() => ({
    total: vehicles.length,
    inStock: vehicles.filter((v) => (v.quantity || 0) > 0).length,
    outOfStock: vehicles.filter((v) => !v.quantity || v.quantity <= 0).length,
    value: vehicles.reduce((s, v) => s + Number(v.price || 0) * Number(v.quantity || 0), 0),
  }), [vehicles])

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteVehicle(deleteTarget._id || deleteTarget.id)
      setVehicles((prev) => prev.filter((v) => (v._id || v.id) !== (deleteTarget._id || deleteTarget.id)))
      showToast('success', `${deleteTarget.make} ${deleteTarget.model} deleted.`)
      setDeleteTarget(null)
    } catch (e) {
      showToast('error', e.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  const openRestock = (v) => {
    setRestockTarget(v)
    setRestockQty('')
  }

  const confirmRestock = async () => {
    const qty = Number(restockQty)
    if (qty === undefined || qty < 0) return
    setRestocking(true)
    try {
      const updated = await api.restockVehicle(restockTarget._id || restockTarget.id, qty)
      setVehicles((prev) => prev.map((v) => {
        const id = v._id || v.id
        return id === (restockTarget._id || restockTarget.id)
          ? { ...v, quantity: updated?.quantity ?? qty }
          : v
      }))
      showToast('success', `${restockTarget.make} ${restockTarget.model} restocked.`)
      setRestockTarget(null)
    } catch (e) {
      showToast('error', e.message || 'Restock failed.')
    } finally {
      setRestocking(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background flex flex-col shrink-0">
        <div className="h-24 flex items-center px-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-3">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="text-xl font-bold tracking-tight text-foreground">AutoVault</span>
            <span className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <Link to="/admin" className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-colors">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Dashboard
          </Link>
          <Link to="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
            <Store className="h-5 w-5" />
            View Storefront
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Inventory Management</h1>
              <p className="text-muted-foreground text-sm">Add, edit, restock, and remove vehicles from your inventory.</p>
            </div>
            <button onClick={() => setAddModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Add Vehicle
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Models */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <Car className="h-6 w-6" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{stats.total}</p>
              <p className="text-sm font-medium text-muted-foreground">Total Models</p>
            </div>
            
            {/* Units in Stock */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <Layers className="h-6 w-6" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{stats.inStock}</p>
              <p className="text-sm font-medium text-muted-foreground">Units In Stock</p>
            </div>

            {/* Out of Stock */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-red-500/10 p-3 text-red-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{stats.outOfStock}</p>
              <p className="text-sm font-medium text-muted-foreground">Out Of Stock</p>
            </div>
          </div>

          {/* Table Area */}
          <div className="rounded-2xl border border-border bg-secondary/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">Loading inventory...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">No vehicles found.</td>
                    </tr>
                  ) : (
                    filtered.map((v) => {
                      const inStock = (v.quantity || 0) > 0;
                      return (
                        <tr key={v._id || v.id} className="transition-colors hover:bg-secondary/40 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                                {v.images && v.images.length > 0 ? (
                                  <img src={v.images[0]} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  v.image && <img src={v.image} alt="" className="h-full w-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{v.make} {v.model}</p>
                                <p className="text-xs text-muted-foreground">{v.year || '2024'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{v.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">{currency(v.price)}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">{v.quantity || 0}</td>
                          <td className="px-6 py-4">
                            {inStock ? (
                              <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500 border border-red-500/20">
                                Out Of Stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100">
                              <button onClick={() => openRestock(v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" title="Restock">
                                <Box className="h-4 w-4" />
                              </button>
                              <button onClick={() => setEditTarget(v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" title="Edit">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button onClick={() => setDeleteTarget(v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Delete confirmation Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete vehicle">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">Are you absolutely sure?</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                You are about to permanently delete the{' '}
                <span className="font-semibold text-foreground">{deleteTarget?.make} {deleteTarget?.model}</span>.
                This action cannot be undone and will remove it from the database immediately.
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => setDeleteTarget(null)} className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80">Cancel</button>
            <button onClick={confirmDelete} disabled={deleting} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
              {deleting ? 'Deleting…' : 'Delete vehicle'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Restock modal */}
      <Modal open={!!restockTarget} onClose={() => setRestockTarget(null)} title="Restock vehicle">
        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            Set the new stock quantity for{' '}
            <span className="font-semibold text-foreground">{restockTarget?.make} {restockTarget?.model}</span>.
            Current stock: <span className="font-semibold text-foreground">{restockTarget?.quantity || 0}</span>.
          </p>
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-foreground" htmlFor="restock-qty">New stock quantity</label>
            <input
              id="restock-qty"
              type="number"
              min="0"
              autoFocus
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmRestock()}
              className="block w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="e.g. 10"
            />
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => setRestockTarget(null)} className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80">Cancel</button>
            <button onClick={confirmRestock} disabled={restocking || restockQty === ''} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
              {restocking ? 'Saving…' : 'Confirm restock'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Vehicle Modal */}
      <AddVehicleModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSuccess={() => {
          setAddModalOpen(false);
          showToast('success', 'Vehicle added successfully!');
          load();
        }} 
      />

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        open={!!editTarget}
        vehicle={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={() => {
          setEditTarget(null);
          showToast('success', 'Vehicle updated successfully!');
          load();
        }}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.2s_ease-out]">
          <div className={`flex items-center gap-2.5 rounded-lg px-5 py-3 text-sm font-semibold shadow-xl border ${toast.type === 'success' ? 'bg-secondary border-emerald-900/50 text-emerald-500' : 'bg-secondary border-red-900/50 text-red-500'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}
