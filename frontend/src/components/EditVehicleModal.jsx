import { useState, useEffect, useRef } from 'react';
import Modal from './Modal.jsx';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { api } from '../lib/api.js';

export default function EditVehicleModal({ open, onClose, onSuccess, vehicle }) {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (vehicle) {
            setMake(vehicle.make || '');
            setModel(vehicle.model || '');
            setCategory(vehicle.category || '');
            setPrice(vehicle.price || '');
            setQuantity(vehicle.quantity || '');
            setImages([]); // Reset any new images to show current ones implicitly
            setError('');
        }
    }, [vehicle, open]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (images.length + files.length > 5) {
            setError("You can only upload a maximum of 5 new images.");
            return;
        }
        
        setError('');
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('make', make);
        formData.append('model', model);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        
        images.forEach((img) => {
            formData.append('images', img);
        });

        try {
            await api.updateVehicle(vehicle._id || vehicle.id, formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update vehicle");
        } finally {
            setLoading(false);
        }
    };

    if (!vehicle) return null;

    return (
        <Modal open={open} onClose={onClose} title="Edit Vehicle">
            <form onSubmit={handleSubmit} className="p-6">
                {error && (
                    <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500 border border-red-500/20">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Make</label>
                        <input type="text" required value={make} onChange={e => setMake(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. BMW" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Model</label>
                        <input type="text" required value={model} onChange={e => setModel(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. M4 Competition" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                        <input type="text" required value={category} onChange={e => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. Coupe" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Price (INR)</label>
                        <input type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. 153000" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">Stock Quantity</label>
                        <input type="number" required min="0" value={quantity} onChange={e => setQuantity(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. 3" />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-foreground mb-2">Update Images (Optional)</label>
                    <p className="text-xs text-muted-foreground mb-3">Uploading new images will replace the existing ones. Leave empty to keep existing images.</p>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex justify-center rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-8 hover:bg-secondary/50 transition-colors cursor-pointer ${images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <div className="text-sm font-semibold text-foreground mb-1">Click to upload new images</div>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
                        </div>
                    </div>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        disabled={images.length >= 5}
                    />

                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-5 gap-3">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg bg-secondary overflow-hidden border border-border">
                                    <img src={URL.createObjectURL(img)} alt="preview" className="h-full w-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border mt-4">
                    <button type="button" onClick={onClose} className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80">Cancel</button>
                    <button type="submit" disabled={loading} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 min-w-[120px]">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
