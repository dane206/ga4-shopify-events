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

// Track add_payment_info event
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Only fire on payment step
        if (!window.Shopify?.checkout || window.Shopify.checkout.step !== 'payment_method') {
            return;
        }

        // Get checkout data
        const checkout = window.Shopify.checkout;
        const currency = checkout.currency || 'USD';
        const items = checkout.line_items || [];

        // Listen for payment method selection
        document.querySelectorAll('[data-select-gateway]').forEach(button => {
            button.addEventListener('click', () => {
                try {
                    const paymentMethod = sanitize.string(
                        button.getAttribute('data-select-gateway')
                    );

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push add_payment_info event
                    window.dataLayer.push({
                        event: 'add_payment_info',
                        ecommerce: {
                            currency: sanitize.currency(currency),
                            value: sanitize.number(checkout.total_price),
                            payment_type: paymentMethod,
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
                    console.error('Error pushing add_payment_info event:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up add_payment_info tracking:', error);
    }
}); 
