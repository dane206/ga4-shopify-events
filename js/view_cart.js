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

// Track cart views
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Track main cart page
        if (window.location.pathname.includes('/cart')) {
            fetch('/cart.js')
                .then(response => response.json())
                .then(cart => {
                    if (!cart.items?.length) return;

                    // Get cart source
                    const cartSource = new URLSearchParams(window.location.search).get('ref') || 
                                     document.referrer || 
                                     'direct';

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push view_cart event with enhanced parameters
                    window.dataLayer.push({
                        event: 'view_cart',
                        ecommerce: {
                            currency: sanitize.currency(cart.currency),
                            value: sanitize.number(cart.total_price / 100),
                            cart_id: sanitize.string(cart.token),
                            cart_type: 'main_cart',
                            cart_source: sanitize.string(cartSource),
                            abandoned_cart: false,
                            items: cart.items.map(item => ({
                                item_name: sanitize.string(item.title),
                                item_id: sanitize.string(item.product_id),
                                item_sku: sanitize.string(item.sku),
                                price: sanitize.number(item.price / 100),
                                currency: sanitize.currency(cart.currency),
                                item_brand: sanitize.string(item.vendor),
                                item_category: sanitize.string(item.product_type),
                                item_variant: sanitize.string(item.variant_title),
                                quantity: sanitize.number(item.quantity)
                            }))
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching cart data:', error.message);
                });
        }

        // Track mini-cart views
        const miniCartTriggers = document.querySelectorAll('[data-cart-trigger]');
        miniCartTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                fetch('/cart.js')
                    .then(response => response.json())
                    .then(cart => {
                        if (!cart.items?.length) return;

                        window.dataLayer.push({ ecommerce: null });
                        window.dataLayer.push({
                            event: 'view_cart',
                            ecommerce: {
                                currency: sanitize.currency(cart.currency),
                                value: sanitize.number(cart.total_price / 100),
                                cart_id: sanitize.string(cart.token),
                                cart_type: 'mini_cart',
                                cart_source: 'header_icon',
                                abandoned_cart: false,
                                items: cart.items.map(item => ({
                                    item_name: sanitize.string(item.title),
                                    item_id: sanitize.string(item.product_id),
                                    item_sku: sanitize.string(item.sku),
                                    price: sanitize.number(item.price / 100),
                                    currency: sanitize.currency(cart.currency),
                                    item_brand: sanitize.string(item.vendor),
                                    item_category: sanitize.string(item.product_type),
                                    item_variant: sanitize.string(item.variant_title),
                                    quantity: sanitize.number(item.quantity)
                                }))
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching mini-cart data:', error.message);
                    });
            });
        });
    } catch (error) {
        console.error('Error setting up cart view tracking:', error.message);
    }
}); 
