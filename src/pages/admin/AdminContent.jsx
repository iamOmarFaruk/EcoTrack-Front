import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Plus, Save, Trash2 } from 'lucide-react'

const emptyTestimonial = { name: '', role: '', quote: '', initials: '', colorClass: 'bg-emerald-100 text-emerald-700' }
const emptyStep = { title: '', description: '', icon: 'target' }
const emptySocial = { label: 'GitHub', href: '', icon: 'github' }
const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))

export default function AdminContent() {
  const queryClient = useQueryClient()
  const [contentForm, setContentForm] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'content'],
    queryFn: () => adminApi.getContent()
  })

  const saveMutation = useMutation({
    mutationFn: (payload) => adminApi.updateContent(payload),
    onSuccess: () => {
      showSuccess('Content updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'content'] })
    },
    onError: (err) => showError(err.message || 'Failed to save content')
  })

  useEffect(() => {
    if (data?.data || data) {
      const incoming = data.data || data
      setContentForm(clone(incoming))
    }
  }, [data])

  if (isLoading || !contentForm) {
    return <EcoLoader />
  }

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

  const updateArrayItem = (key, index, field, value) => {
    setContentForm((prev) => {
      const copy = clone(prev)
      copy[key][index][field] = value
      return copy
    })
  }

  const addItem = (key, template) => {
    setContentForm((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), clone(template)]
    }))
  }

  const removeItem = (key, index) => {
    setContentForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }))
  }

  const handleSave = (section) => {
    const payload = {}
    if (section === 'testimonials' || section === 'howItWorks') {
      payload[section] = contentForm[section]
    } else if (section === 'footer') {
      payload.footer = contentForm.footer
    } else {
      Object.assign(payload, contentForm)
    }
    saveMutation.mutate(payload)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text/40">Content Studio</p>
          <h1 className="text-2xl font-bold text-heading">Manage testimonials, how it works, and footer</h1>
        </div>
        <Button onClick={() => handleSave('all')} className="flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400">
          <Save size={16} /> Save All
        </Button>
      </div>

      {/* Testimonials */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text/40">Community voices</p>
            <h3 className="text-xl font-semibold text-heading">Testimonials</h3>
          </div>
          <Button variant="ghost" onClick={() => addItem('testimonials', emptyTestimonial)} className="flex items-center gap-2 text-text/70 hover:bg-muted hover:text-heading">
            <Plus size={16} /> Add testimonial
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {contentForm.testimonials?.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex justify-between">
                <p className="text-sm uppercase tracking-wide text-text/50">#{idx + 1}</p>
                <button onClick={() => removeItem('testimonials', idx)} className="text-text/50 hover:text-danger">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <input
                  value={item.name}
                  onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <input
                  value={item.role}
                  onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)}
                  placeholder="Role"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <textarea
                  value={item.quote}
                  onChange={(e) => updateArrayItem('testimonials', idx, 'quote', e.target.value)}
                  placeholder="Quote"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={item.initials}
                    onChange={(e) => updateArrayItem('testimonials', idx, 'initials', e.target.value)}
                    placeholder="Initials"
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <input
                    value={item.colorClass || ''}
                    onChange={(e) => updateArrayItem('testimonials', idx, 'colorClass', e.target.value)}
                    placeholder="Tailwind color classes"
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => handleSave('testimonials')} className="flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400">
            <Save size={16} /> Save testimonials
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text/40">Process</p>
            <h3 className="text-xl font-semibold text-heading">How it works</h3>
          </div>
          <Button variant="ghost" onClick={() => addItem('howItWorks', emptyStep)} className="flex items-center gap-2 text-text/70 hover:bg-muted hover:text-heading">
            <Plus size={16} /> Add step
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {contentForm.howItWorks?.map((step, idx) => (
            <div key={`${step.title}-${idx}`} className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex justify-between">
                <p className="text-sm uppercase tracking-wide text-text/50">Step {idx + 1}</p>
                <button onClick={() => removeItem('howItWorks', idx)} className="text-text/50 hover:text-danger">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <input
                  value={step.title}
                  onChange={(e) => updateArrayItem('howItWorks', idx, 'title', e.target.value)}
                  placeholder="Title"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateArrayItem('howItWorks', idx, 'description', e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <input
                  value={step.icon}
                  onChange={(e) => updateArrayItem('howItWorks', idx, 'icon', e.target.value)}
                  placeholder="Icon (target/trending-up/chat)"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => handleSave('howItWorks')} className="flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400">
            <Save size={16} /> Save steps
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text/40">Footer</p>
            <h3 className="text-xl font-semibold text-heading">Contact, newsletter & socials</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wide text-text/50">Brand description</label>
            <textarea
              value={contentForm.footer?.brand?.description || ''}
              onChange={(e) => updateField('footer.brand.description', e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wide text-text/50">Address</label>
                <input
                  value={contentForm.footer?.contact?.address || ''}
                  onChange={(e) => updateField('footer.contact.address', e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-text/50">Phone</label>
                <input
                  value={contentForm.footer?.contact?.phone || ''}
                  onChange={(e) => updateField('footer.contact.phone', e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-text/50">Email</label>
                <input
                  value={contentForm.footer?.contact?.email || ''}
                  onChange={(e) => updateField('footer.contact.email', e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wide text-text/50">Newsletter</label>
            <input
              value={contentForm.footer?.newsletter?.title || ''}
              onChange={(e) => updateField('footer.newsletter.title', e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Title"
            />
            <textarea
              value={contentForm.footer?.newsletter?.subtitle || ''}
              onChange={(e) => updateField('footer.newsletter.subtitle', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Subtitle"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-text/50">Social links</p>
                <Button variant="ghost" onClick={() => addItem('footer.socialLinks', emptySocial)} className="flex items-center gap-2 text-text/70 hover:bg-muted hover:text-heading">
                  <Plus size={14} /> Add
                </Button>
              </div>
              {contentForm.footer?.socialLinks?.map((link, idx) => (
                <div key={`${link.label}-${idx}`} className="grid grid-cols-[1fr,1fr,auto] items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
                  <input
                    value={link.label}
                    onChange={(e) => {
                      const copy = [...contentForm.footer.socialLinks]
                      copy[idx] = { ...copy[idx], label: e.target.value }
                      setContentForm((prev) => ({ ...prev, footer: { ...prev.footer, socialLinks: copy } }))
                    }}
                    className="w-full bg-transparent text-sm text-heading outline-none"
                    placeholder="Label"
                  />
                  <input
                    value={link.href}
                    onChange={(e) => {
                      const copy = [...contentForm.footer.socialLinks]
                      copy[idx] = { ...copy[idx], href: e.target.value }
                      setContentForm((prev) => ({ ...prev, footer: { ...prev.footer, socialLinks: copy } }))
                    }}
                    className="w-full bg-transparent text-sm text-heading outline-none"
                    placeholder="URL"
                  />
                  <button onClick={() => {
                    setContentForm((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        socialLinks: prev.footer.socialLinks.filter((_, i) => i !== idx)
                      }
                    }))
                  }} className="text-text/50 hover:text-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => handleSave('footer')} className="flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400">
            <Save size={16} /> Save footer
          </Button>
        </div>
      </div>
    </div>
  )
}
