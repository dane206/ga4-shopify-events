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
        // Add currency validation
        return ['USD', 'CAD', 'GBP', 'EUR'].includes(currency) ? currency : 'USD';
    }
};

// Track collection/list page views
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Get all products on the page
        const products = window.ShopifyAnalytics?.meta?.products || [];
        const listId = window.location.pathname;
        const listName = document.querySelector('h1')?.textContent?.trim() || listId;
        
        // Add list type detection
        const listType = window.location.pathname.includes('/collections/') 
            ? 'collection' 
            : window.location.pathname.includes('/search') 
                ? 'search' 
                : 'other';

        if (!products.length) return;

        // Clear previous ecommerce data
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });

        // Push view_item_list event with enhanced parameters
        window.dataLayer.push({
            event: 'view_item_list',
            ecommerce: {
                list_id: sanitize.string(listId),
                list_name: sanitize.string(listName),
                list_type: sanitize.string(listType),
                items: products.map((product, index) => ({
                    item_name: sanitize.string(product.title),
                    item_id: sanitize.string(product.id),
                    item_sku: sanitize.string(product.variants?.[0]?.sku),
                    price: sanitize.number(product.price / 100),
                    currency: sanitize.currency(window.Shopify?.currency?.active),
                    item_brand: sanitize.string(product.vendor),
                    item_category: sanitize.string(product.type),
                    index: index + 1,
                    item_list_id: sanitize.string(listId),
                    item_list_name: sanitize.string(listName),
                    item_list_type: sanitize.string(listType)
                }))
            }
        });
    } catch (error) {
        console.error('Error pushing view_item_list event:', error.message);
    }
}); 
