import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Layers, Save, Plus, Trash2, Mail, Phone, MapPin, Globe, Share2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const emptySocial = { label: 'Twitter', href: '', icon: 'twitter' }
const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))

export default function AdminFooter() {
    const queryClient = useQueryClient()
    const [contentForm, setContentForm] = useState(null)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'content'],
        queryFn: () => adminApi.getContent()
    })

    const saveMutation = useMutation({
        mutationFn: (payload) => adminApi.updateContent(payload),
        onSuccess: () => {
            showSuccess('Footer information updated')
            queryClient.invalidateQueries({ queryKey: ['admin', 'content'] })
        },
        onError: (err) => showError(err.message || 'Failed to save footer')
    })

    useEffect(() => {
        if (data?.data || data) {
            const incoming = data.data || data
            setContentForm(clone(incoming))
        }
    }, [data])

    if (isLoading || !contentForm) return <EcoLoader />

    const updateField = (path, value) => {
        setContentForm((prev) => {
            const copy = clone(prev)
            const keys = path.split('.')
            let ref = copy
            while (keys.length > 1) {
                const key = keys.shift()
                ref[key] = ref[key] || {}
                ref = ref[key]
            }
            ref[keys[0]] = value
            return copy
        })
    }

    const addItem = (key, template) => {
        const keys = key.split('.')
        setContentForm((prev) => {
            const copy = clone(prev)
            let ref = copy
            while (keys.length > 1) {
                ref = ref[keys.shift()]
            }
            const lastKey = keys[0]
            ref[lastKey] = [...(ref[lastKey] || []), clone(template)]
            return copy
        })
    }

    const removeItem = (key, index) => {
        const keys = key.split('.')
        setContentForm((prev) => {
            const copy = clone(prev)
            let ref = copy
            while (keys.length > 1) {
                ref = ref[keys.shift()]
            }
            const lastKey = keys[0]
            ref[lastKey] = ref[lastKey].filter((_, i) => i !== index)
            return copy
        })
    }

    const handleSave = () => {
        saveMutation.mutate({ footer: contentForm.footer })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/40" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Global Presence</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Footer <span className="text-primary">Architecture</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Configure global contact info, social links and newsletter settings.</p>
                </div>

                <Button
                    onClick={handleSave}
                    loading={saveMutation.isPending}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8 py-3 rounded-2xl font-bold hover:translate-y-0 hover:shadow-lg"
                >
                    <Save size={18} />
                    Deploy Footer
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Brand & Contact */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                <Globe size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-heading">Brand Identity</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Company Description</label>
                                <textarea
                                    value={contentForm.footer?.brand?.description || ''}
                                    onChange={(e) => updateField('footer.brand.description', e.target.value)}
                                    rows={4}
                                    className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-heading">Contact Information</h3>
                        </div>

                        <div className="grid gap-4">
                            <div className="relative group/input">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Physical Address</label>
                                <MapPin className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                <input
                                    value={contentForm.footer?.contact?.address || ''}
                                    onChange={(e) => updateField('footer.contact.address', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Phone Number</label>
                                    <Phone className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                    <input
                                        value={contentForm.footer?.contact?.phone || ''}
                                        onChange={(e) => updateField('footer.contact.phone', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Email Address</label>
                                    <Mail className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                    <input
                                        value={contentForm.footer?.contact?.email || ''}
                                        onChange={(e) => updateField('footer.contact.email', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter & Socials */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                <Send size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-heading">Newsletter Widget</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Headline</label>
                                <input
                                    value={contentForm.footer?.newsletter?.title || ''}
                                    onChange={(e) => updateField('footer.newsletter.title', e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    placeholder="e.g. Stay in the Loop"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Sub-headline</label>
                                <textarea
                                    value={contentForm.footer?.newsletter?.subtitle || ''}
                                    onChange={(e) => updateField('footer.newsletter.subtitle', e.target.value)}
                                    rows={2}
                                    className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                    placeholder="e.g. Join our weekly eco-newsletter."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                    <Share2 size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-heading">Social Media</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addItem('footer.socialLinks', emptySocial)}
                                className="flex items-center gap-2 hover:bg-primary/10 text-primary rounded-xl"
                            >
                                <Plus size={16} /> Add Link
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {contentForm.footer?.socialLinks?.map((link, idx) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={`${link.label}-${idx}`}
                                        className="grid grid-cols-[120px,1fr,auto] items-center gap-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/30 px-4 py-3"
                                    >
                                        <input
                                            value={link.label}
                                            onChange={(e) => {
                                                const copy = [...contentForm.footer.socialLinks]
                                                copy[idx] = { ...copy[idx], label: e.target.value }
                                                setContentForm((prev) => ({ ...prev, footer: { ...prev.footer, socialLinks: copy } }))
                                            }}
                                            className="bg-transparent text-sm font-bold text-heading outline-none border-r border-zinc-200 dark:border-zinc-700"
                                            placeholder="Label"
                                        />
                                        <input
                                            value={link.href}
                                            onChange={(e) => {
                                                const copy = [...contentForm.footer.socialLinks]
                                                copy[idx] = { ...copy[idx], href: e.target.value }
                                                setContentForm((prev) => ({ ...prev, footer: { ...prev.footer, socialLinks: copy } }))
                                            }}
                                            className="bg-transparent text-sm text-text/70 outline-none truncate"
                                            placeholder="URL (https://...)"
                                        />
                                        <button
                                            onClick={() => removeItem('footer.socialLinks', idx)}
                                            className="p-2 rounded-lg text-text/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
