// Utility functions for data sanitization
const sanitize = {
    string: (value, defaultValue = '') => 
        value ? String(value).trim() : defaultValue,
    
    number: (value, defaultValue = 0) => {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : parseFloat(num.toFixed(2));
    },
    
    currency: (value) => 
        (value?.toUpperCase?.() || 'USD').slice(0, 3)
};

// Track purchase event
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Only fire on order status page
        if (!window.Shopify?.checkout || window.Shopify.checkout.step !== 'thank_you') {
            return;
        }

        // Get checkout data
        const checkout = window.Shopify.checkout;
        const currency = checkout.currency || 'USD';
        const items = checkout.line_items || [];

        // Clear previous ecommerce data
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });

        // Push purchase event
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
                transaction_id: sanitize.string(checkout.order_id),
                value: sanitize.number(checkout.total_price),
                tax: sanitize.number(checkout.total_tax),
                shipping: sanitize.number(checkout.shipping_rate?.price || 0),
                currency: sanitize.currency(currency),
                items: items.map(item => ({
                    item_name: sanitize.string(item.title),
                    item_id: sanitize.string(item.product_id),
                    item_sku: sanitize.string(item.sku),
                    price: sanitize.number(item.price),
                    currency: sanitize.currency(currency),
                    quantity: sanitize.number(item.quantity)
                }))
            }
        });
    } catch (error) {
        console.error('Error pushing purchase event:', error);
    }
}); 
