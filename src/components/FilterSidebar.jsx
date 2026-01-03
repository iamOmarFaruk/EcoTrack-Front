import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'

export default function FilterSidebar({
    filters,
    setFilter,
    clearFilters,
    categories,
    className
}) {
    const sortOptions = [
        { value: 'createdAt', label: 'Newest', order: 'desc' },
        { value: 'startDate', label: 'Starting Soon', order: 'asc' },
        { value: 'participants', label: 'Most Popular', order: 'desc' },
        { value: 'endDate', label: 'Ending Soon', order: 'asc' }
    ]

    const statusOptions = [
        { value: 'active', label: 'Active Now' },
        { value: 'completed', label: 'Completed' },
        { value: 'upcoming', label: 'Upcoming' }
    ]

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Search Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Search</h3>
                    {/* Mobile Clear Button (Optional, if needed for tight spaces) */}
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search challenges..."
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-surface/50 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none focus:bg-surface hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-md placeholder:text-text/40 text-heading font-medium"
                    />
                    <svg
                        className="absolute left-3.5 top-3.5 w-5 h-5 text-text/40 group-focus-within:text-primary transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Featured Toggle */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${filters.featured ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-heading">Featured Only</span>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.featured}
                            onChange={(e) => setFilter('featured', e.target.checked)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${filters.featured ? 'bg-primary' : 'bg-border'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${filters.featured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                </label>
            </div>

            {/* Sort By */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Sort By</h3>
                <div className="space-y-2">
                    {sortOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${filters.sortBy === option.value
                                ? 'border-primary/50 bg-primary/5 shadow-sm'
                                : 'border-transparent hover:bg-surface/50 hover:border-border'
                                }`}
                            onClick={() => {
                                setFilter('sortBy', option.value)
                                setFilter('order', option.order)
                            }}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${filters.sortBy === option.value ? 'border-primary' : 'border-text/30'
                                }`}>
                                {filters.sortBy === option.value && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                            </div>
                            <span className={`text-sm ${filters.sortBy === option.value ? 'font-medium text-heading' : 'text-text/70'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.slice(1).map((category) => { // Skip 'All' since we use multi-select style logic or specific selection
                        const isSelected = filters.category === category
                        return (
                            <button
                                key={category}
                                onClick={() => setFilter('category', isSelected ? 'All' : category)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${isSelected
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                    : 'bg-surface border-border text-text/70 hover:border-primary/30 hover:text-primary'
                                    }`}
                            >
                                {category}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Status</h3>
                <div className="space-y-2">
                    {statusOptions.map((status) => (
                        <label key={status.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.status === status.value ? 'bg-primary border-primary' : 'border-text/30 group-hover:border-primary/50'
                                }`}>
                                {filters.status === status.value && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.status === status.value}
                                onChange={() => setFilter('status', filters.status === status.value ? '' : status.value)}
                            />
                            <span className={`text-sm ${filters.status === status.value ? 'font-medium text-heading' : 'text-text/70'}`}>
                                {status.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-dashed border-border">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    )
}
