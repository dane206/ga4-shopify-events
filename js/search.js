// Utility functions for data sanitization
const sanitize = {
    string: (value, defaultValue = '') => 
        value ? String(value).trim() : defaultValue,
    
    number: (value, defaultValue = 0) => {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : parseFloat(num.toFixed(2));
    },
    
    currency: (value) => {
        const currency = value?.toUpperCase?.() || 'USD';
        return ['USD', 'CAD', 'GBP', 'EUR'].includes(currency) ? currency : 'USD';
    }
};

// Track search events
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Track search form submissions
        const searchForms = document.querySelectorAll('form[action="/search"]');
        
        searchForms.forEach(form => {
            form.addEventListener('submit', () => {
                try {
                    const searchInput = form.querySelector('input[type="search"], input[name="q"]');
                    const searchTerm = sanitize.string(searchInput?.value);
                    
                    if (!searchTerm) return;

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push search event
                    window.dataLayer.push({
                        event: 'search',
                        search_term: searchTerm,
                        search_type: 'site_search',
                        search_location: form.closest('header') ? 'header' : 'page'
                    });
                } catch (error) {
                    console.error('Error pushing search event:', error.message);
                }
            });
        });

        // Track search results page
        if (window.location.pathname === '/search') {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const searchTerm = sanitize.string(urlParams.get('q'));
                const searchType = urlParams.get('type') || 'product';
                
                // Get filter data
                const filters = {};
                urlParams.forEach((value, key) => {
                    if (key !== 'q' && key !== 'type') {
                        filters[key] = value;
                    }
                });

                // Get sort data
                const sort = urlParams.get('sort_by');

                // Get results data
                const resultsCount = sanitize.number(
                    document.querySelector('[data-search-count]')?.dataset?.searchCount
                );

                // Push search results event
                window.dataLayer.push({
                    event: 'view_search_results',
                    search_term: searchTerm,
                    search_type: searchType,
                    search_filters: filters,
                    search_sort: sort,
                    search_results: resultsCount
                });
            } catch (error) {
                console.error('Error pushing search results event:', error.message);
            }
        }
    } catch (error) {
        console.error('Error setting up search tracking:', error.message);
    }
}); 
