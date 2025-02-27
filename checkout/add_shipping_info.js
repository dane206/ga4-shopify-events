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

// Track add_shipping_info event
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Only fire on shipping step
        if (!window.Shopify?.checkout || window.Shopify.checkout.step !== 'shipping_method') {
            return;
        }

        // Get checkout and shipping data
        const checkout = window.Shopify.checkout;
        const currency = checkout.currency || 'USD';
        const items = checkout.line_items || [];
        const shipping = checkout.shipping_rate || {};

        // Listen for shipping method selection
        document.querySelectorAll('[name="checkout[shipping_rate][id]"]').forEach(input => {
            input.addEventListener('change', () => {
                try {
                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push add_shipping_info event
                    window.dataLayer.push({
                        event: 'add_shipping_info',
                        ecommerce: {
                            currency: sanitize.currency(currency),
                            value: sanitize.number(checkout.total_price),
                            shipping_tier: sanitize.string(shipping.name),
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
                    console.error('Error pushing add_shipping_info event:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up add_shipping_info tracking:', error);
    }
}); 
