import React from 'react'
import Button from './ui/Button'

export default function EventFilterSidebar({
    filters,
    setFilter,
    clearFilters,
    categories,
    className
}) {
    const sortOptions = [
        { value: 'date', label: 'Event Date', order: 'asc' },
        { value: 'createdAt', label: 'Recently Added', order: 'desc' },
        { value: 'capacity', label: 'Capacity', order: 'desc' }
    ]

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const availabilityOptions = [
        { value: 'all', label: 'All Events' },
        { value: 'available', label: 'Spots Available' }
    ]

    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'this-week', label: 'Next 7 Days' }
    ]

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Search Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Search</h3>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search events..."
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

            {/* Date Range Filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">When</h3>
                <div className="flex flex-wrap gap-2">
                    {dateRangeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter('dateRange', option.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${filters.dateRange === option.value
                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                : 'bg-surface border-border text-text/70 hover:border-primary/30 hover:text-primary'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const isSelected = filters.category === category
                        return (
                            <button
                                key={category}
                                onClick={() => setFilter('category', category)}
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

            {/* Availability */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Availability</h3>
                <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${filters.availability === option.value ? 'border-primary' : 'border-text/30 group-hover:border-primary/50'
                                }`}>
                                {filters.availability === option.value && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                )}
                            </div>
                            <input
                                type="radio"
                                className="hidden"
                                checked={filters.availability === option.value}
                                onChange={() => setFilter('availability', option.value)}
                            />
                            <span className={`text-sm ${filters.availability === option.value ? 'font-medium text-heading' : 'text-text/70'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
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
                                onChange={() => setFilter('status', status.value)}
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
