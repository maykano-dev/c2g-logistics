"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, AlertCircle, Edit2, X } from "lucide-react";
import { saveCheckoutAddress, setPrimaryAddress, deleteAddress, updateCheckoutAddress } from "@/app/checkout/actions";
import { useRouter } from "next/navigation";

export default function AddressManager({ initialAddresses = [] }: { initialAddresses: any[] }) {
  const [addresses, setAddresses] = useState<any[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    region: "",
    street_address: ""
  });
  const router = useRouter();

  const handleSetPrimary = async (id: string) => {
    setIsSubmitting(true);
    const res = await setPrimaryAddress(id);
    if (res.success) {
      setAddresses(prev => prev.map(a => ({ ...a, is_primary: a.id === id })));
      router.refresh();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setIsSubmitting(true);
    const res = await deleteAddress(id);
    if (res.success) {
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (editingId === id) resetForm();
      router.refresh();
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", city: "", region: "", street_address: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: any) => {
    setFormData({
      name: addr.name || "",
      phone: addr.phone || "",
      city: addr.city || "",
      region: addr.region || "",
      street_address: addr.street_address || ""
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingId) {
      const res = await updateCheckoutAddress(editingId, formData);
      if (res.success) {
        setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } : a));
        resetForm();
        router.refresh();
      } else {
        alert(res.error || "Failed to update address");
      }
    } else {
      const res = await saveCheckoutAddress(formData);
      if (res.success) {
        // Optimistic refresh, the backend will auto-primary if it's the first
        resetForm();
        router.refresh();
      } else {
        alert(res.error || "Failed to save address");
      }
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/20 border border-border/50 rounded-2xl p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Saved Addresses
          </h2>
          {addresses.length < 3 && !showForm && (
            <button 
              onClick={() => { resetForm(); setShowForm(true); }}
              className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="text-center p-6 sm:p-8 bg-background/50 rounded-xl border border-dashed border-border/50">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">You haven't saved any delivery addresses yet.</p>
            <button 
              onClick={() => { resetForm(); setShowForm(true); }}
              className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto"
            >
              Add Your First Address
            </button>
          </div>
        )}

        {addresses.length > 0 && !showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div 
                key={addr.id} 
                className={`p-4 sm:p-5 rounded-xl border transition-all relative flex flex-col h-full ${
                  addr.is_primary 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-background/50 border-border/50 hover:border-border"
                }`}
              >
                {addr.is_primary && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Default
                  </div>
                )}
                
                <div className="pr-[70px]">
                  <h3 className="font-bold text-foreground text-sm sm:text-base line-clamp-1" title={addr.name}>{addr.name || "Customer"}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{addr.phone || "No phone provided"}</p>
                </div>
                
                <div className="mt-3 text-xs sm:text-sm flex-grow">
                  <p className="text-foreground/90 line-clamp-2">{addr.street_address}</p>
                  <p className="text-muted-foreground mt-0.5">{addr.city}{addr.region ? `, ${addr.region}` : ''}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/30 flex items-center flex-wrap gap-2">
                  {!addr.is_primary && (
                    <button 
                      onClick={() => handleSetPrimary(addr.id)}
                      disabled={isSubmitting}
                      className="text-[11px] sm:text-xs font-medium text-foreground hover:text-primary transition-colors bg-secondary/80 px-2.5 py-1.5 rounded-md disabled:opacity-50"
                    >
                      Set Default
                    </button>
                  )}
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <button 
                      onClick={() => handleEdit(addr)}
                      disabled={isSubmitting}
                      className="text-[11px] sm:text-xs font-medium text-foreground hover:text-primary transition-colors bg-secondary/80 px-2.5 py-1.5 rounded-md disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(addr.id)}
                      disabled={isSubmitting}
                      className="text-[11px] sm:text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors bg-secondary/80 px-2.5 py-1.5 rounded-md disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length >= 3 && !showForm && (
          <div className="flex items-start sm:items-center gap-2 text-[11px] sm:text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <p>You've reached the maximum of 3 saved addresses. Edit or delete one to make changes.</p>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-background rounded-xl p-4 sm:p-6 border border-border/50 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-bold">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
              <button type="button" onClick={resetForm} className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full h-10 bg-secondary/50 border-none rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full h-10 bg-secondary/50 border-none rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Region / State</label>
                <input required name="region" value={formData.region} onChange={handleChange} type="text" className="w-full h-10 bg-secondary/50 border-none rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Greater Accra" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full h-10 bg-secondary/50 border-none rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Accra" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Street Address / Digital Address</label>
              <textarea required name="street_address" value={formData.street_address} onChange={handleChange} rows={2} className="w-full bg-secondary/50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={resetForm}
                disabled={isSubmitting}
                className="w-full sm:w-auto text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-lg border border-border/50 sm:border-none sm:py-2"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : (editingId ? "Update Address" : "Save Address")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
