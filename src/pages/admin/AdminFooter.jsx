import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import {
    Save, Plus, Trash2, Mail, Phone, MapPin, Globe, Share2, Send,
    Link2, Scale, User, ChevronDown,
    Github, Twitter, Instagram, Linkedin,
    Youtube, Facebook, MessageCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))

// Icon options for social links
const socialIconOptions = [
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'x', label: 'X (Twitter)', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'tiktok', label: 'TikTok', icon: MessageCircle },
    { value: 'discord', label: 'Discord', icon: MessageCircle },
]

// Templates for new items
const emptyResourceLink = { label: '', path: '/' }
const emptyLegalLink = { label: '', path: '/' }
const emptySocialLink = { label: '', href: 'https://', icon: 'github' }

// Icon Picker Component
function IconPicker({ value, onChange, options, label }) {
    const [isOpen, setIsOpen] = useState(false)
    const selected = options.find(opt => opt.value === value) || options[0]
    const SelectedIcon = selected.icon

    return (
        <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading hover:border-primary/50 transition-all"
            >
                <div className="flex items-center gap-2">
                    <SelectedIcon size={16} className="text-primary" />
                    <span>{selected.label}</span>
                </div>
                <ChevronDown size={16} className={`text-text/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
                    >
                        {options.map((option) => {
                            const Icon = option.icon
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/10 ${
                                        value === option.value ? 'bg-primary/5 text-primary' : 'text-heading'
                                    }`}
                                >
                                    <Icon size={18} className={value === option.value ? 'text-primary' : 'text-text/50'} />
                                    <span>{option.label}</span>
                                </button>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true, badge }) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-heading">{title}</h3>
                    {badge && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {badge}
                        </span>
                    )}
                </div>
                <ChevronDown size={20} className={`text-text/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 pt-2 overflow-visible">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

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
            showSuccess('Footer configuration deployed successfully!')
            queryClient.invalidateQueries({ queryKey: ['admin', 'content'] })
            queryClient.invalidateQueries({ queryKey: ['site', 'content'] })
        },
        onError: (err) => showError(err.message || 'Failed to save footer')
    })

    useEffect(() => {
        if (data?.data || data) {
            const incoming = data.data || data
            // Ensure footer object exists with all required nested objects
            const footer = {
                brand: { title: 'EcoTrack', description: '' },
                resourceLinks: [],
                legalLinks: [],
                contact: { address: '', phone: '', email: '' },
                socialLinks: [],
                newsletter: { title: '', subtitle: '' },
                credits: { author: '', authorUrl: '' },
                ...incoming.footer
            }
            setContentForm({ ...clone(incoming), footer })
        }
    }, [data])

    if (isLoading || !contentForm) return <EcoLoader />

    const updateField = (path, value) => {
        setContentForm((prev) => {
            const copy = clone(prev)
            const keys = path.split('.')
            let ref = copy
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i]
                if (!ref[key] || typeof ref[key] !== 'object') {
                    ref[key] = {}
                }
                ref = ref[key]
            }
            ref[keys[keys.length - 1]] = value
            return copy
        })
    }

    const updateArrayItem = (path, index, field, value) => {
        setContentForm((prev) => {
            const copy = clone(prev)
            const keys = path.split('.')
            let ref = copy
            for (const key of keys) {
                ref = ref[key]
            }
            if (ref && ref[index]) {
                ref[index][field] = value
            }
            return copy
        })
    }

    const addItem = (path, template) => {
        setContentForm((prev) => {
            const copy = clone(prev)
            const keys = path.split('.')
            let ref = copy
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i]
                if (!ref[key] || typeof ref[key] !== 'object') {
                    ref[key] = {}
                }
                ref = ref[key]
            }
            const lastKey = keys[keys.length - 1]
            if (!Array.isArray(ref[lastKey])) {
                ref[lastKey] = []
            }
            ref[lastKey] = [...ref[lastKey], clone(template)]
            return copy
        })
    }

    const removeItem = (path, index) => {
        setContentForm((prev) => {
            const copy = clone(prev)
            const keys = path.split('.')
            let ref = copy
            for (const key of keys.slice(0, -1)) {
                ref = ref[key]
            }
            const lastKey = keys[keys.length - 1]
            ref[lastKey] = ref[lastKey].filter((_, i) => i !== index)
            return copy
        })
    }

    const handleSave = () => {
        saveMutation.mutate({ footer: contentForm.footer })
    }

    const footer = contentForm.footer || {}

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/40" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Site Configuration</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Footer <span className="text-primary">Control Center</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Manage all footer sections: brand, links, contact info, social media, and more.</p>
                </div>

                <Button
                    onClick={handleSave}
                    loading={saveMutation.isPending}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8 py-3 rounded-2xl font-bold"
                >
                    <Save size={18} />
                    Deploy Footer
                </Button>
            </div>

            {/* Brand Identity */}
            <CollapsibleSection title="Brand Identity" icon={Globe}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Brand Title</label>
                        <input
                            value={footer.brand?.title || ''}
                            onChange={(e) => updateField('footer.brand.title', e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            placeholder="EcoTrack"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Brand Description</label>
                        <textarea
                            value={footer.brand?.description || ''}
                            onChange={(e) => updateField('footer.brand.description', e.target.value)}
                            rows={3}
                            className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                            placeholder="Empowering individuals to track their environmental impact..."
                        />
                    </div>
                </div>
            </CollapsibleSection>

            {/* Resource Links */}
            <CollapsibleSection
                title="Resource Links"
                icon={Link2}
                badge={footer.resourceLinks?.length || 0}
                defaultOpen={false}
            >
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {footer.resourceLinks?.map((link, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={`resource-${idx}`}
                                className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/30"
                            >
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Label</label>
                                    <input
                                        value={link.label}
                                        onChange={(e) => updateArrayItem('footer.resourceLinks', idx, 'label', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-heading focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        placeholder="About Us"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Path</label>
                                    <input
                                        value={link.path}
                                        onChange={(e) => updateArrayItem('footer.resourceLinks', idx, 'path', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-heading focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        placeholder="/about"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => removeItem('footer.resourceLinks', idx)}
                                        className="p-3 rounded-xl text-text/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button
                        variant="ghost"
                        onClick={() => addItem('footer.resourceLinks', emptyResourceLink)}
                        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-primary hover:bg-primary/5 text-text/50 hover:text-primary transition-all"
                    >
                        <Plus size={18} /> Add Resource Link
                    </Button>
                </div>
            </CollapsibleSection>

            {/* Legal Links */}
            <CollapsibleSection
                title="Legal Links"
                icon={Scale}
                badge={footer.legalLinks?.length || 0}
                defaultOpen={false}
            >
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {footer.legalLinks?.map((link, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={`legal-${idx}`}
                                className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/30"
                            >
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Label</label>
                                    <input
                                        value={link.label}
                                        onChange={(e) => updateArrayItem('footer.legalLinks', idx, 'label', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-heading focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        placeholder="Privacy Policy"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Path</label>
                                    <input
                                        value={link.path}
                                        onChange={(e) => updateArrayItem('footer.legalLinks', idx, 'path', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-heading focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        placeholder="/privacy"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => removeItem('footer.legalLinks', idx)}
                                        className="p-3 rounded-xl text-text/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button
                        variant="ghost"
                        onClick={() => addItem('footer.legalLinks', emptyLegalLink)}
                        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-primary hover:bg-primary/5 text-text/50 hover:text-primary transition-all"
                    >
                        <Plus size={18} /> Add Legal Link
                    </Button>
                </div>
            </CollapsibleSection>

            {/* Contact Information */}
            <CollapsibleSection title="Contact Information" icon={MapPin}>
                <div className="grid gap-4">
                    <div className="relative group/input">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Physical Address</label>
                        <MapPin className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                        <input
                            value={footer.contact?.address || ''}
                            onChange={(e) => updateField('footer.contact.address', e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            placeholder="Green District, Eco Avenue 42, Earth"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative group/input">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Phone Number</label>
                            <Phone className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                            <input
                                value={footer.contact?.phone || ''}
                                onChange={(e) => updateField('footer.contact.phone', e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div className="relative group/input">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Email Address</label>
                            <Mail className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                            <input
                                value={footer.contact?.email || ''}
                                onChange={(e) => updateField('footer.contact.email', e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                placeholder="hello@ecotrack.com"
                            />
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Social Media */}
            <CollapsibleSection
                title="Social Media Links"
                icon={Share2}
                badge={footer.socialLinks?.length || 0}
            >
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {footer.socialLinks?.map((link, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={`social-${idx}`}
                                className="grid grid-cols-1 md:grid-cols-[160px,1fr,1fr,auto] gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/30"
                            >
                                <IconPicker
                                    value={link.icon}
                                    onChange={(val) => updateArrayItem('footer.socialLinks', idx, 'icon', val)}
                                    options={socialIconOptions}
                                    label="Platform"
                                />
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Display Name</label>
                                    <input
                                        value={link.label}
                                        onChange={(e) => updateArrayItem('footer.socialLinks', idx, 'label', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-heading focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        placeholder="GitHub"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">URL</label>
                                    <input
                                        value={link.href}
                                        onChange={(e) => updateArrayItem('footer.socialLinks', idx, 'href', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-heading focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        placeholder="https://github.com/username"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => removeItem('footer.socialLinks', idx)}
                                        className="p-3 rounded-xl text-text/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button
                        variant="ghost"
                        onClick={() => addItem('footer.socialLinks', emptySocialLink)}
                        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-primary hover:bg-primary/5 text-text/50 hover:text-primary transition-all"
                    >
                        <Plus size={18} /> Add Social Link
                    </Button>
                </div>
            </CollapsibleSection>

            {/* Newsletter */}
            <CollapsibleSection title="Newsletter Widget" icon={Send}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Headline</label>
                        <input
                            value={footer.newsletter?.title || ''}
                            onChange={(e) => updateField('footer.newsletter.title', e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            placeholder="Stay Updated"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Sub-headline</label>
                        <input
                            value={footer.newsletter?.subtitle || ''}
                            onChange={(e) => updateField('footer.newsletter.subtitle', e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            placeholder="Get monthly sustainability tips..."
                        />
                    </div>
                </div>
            </CollapsibleSection>

            {/* Developer Credits */}
            <CollapsibleSection title="Developer Credits" icon={User} defaultOpen={false}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Developer Name</label>
                        <input
                            value={footer.credits?.author || ''}
                            onChange={(e) => updateField('footer.credits.author', e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            placeholder="Omar Faruk"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Developer URL</label>
                        <input
                            value={footer.credits?.authorUrl || ''}
                            onChange={(e) => updateField('footer.credits.authorUrl', e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            placeholder="https://github.com/username"
                        />
                    </div>
                </div>
            </CollapsibleSection>

            {/* Floating Save Button for Mobile */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
                <Button
                    onClick={handleSave}
                    loading={saveMutation.isPending}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 px-6 py-4 rounded-2xl font-bold"
                >
                    <Save size={20} />
                    Save
                </Button>
            </div>
        </div>
    )
}
