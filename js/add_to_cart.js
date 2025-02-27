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

// Track add to cart events
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find all add to cart forms
        const addToCartForms = document.querySelectorAll(
            'form[action="/cart/add"]'
        );

        addToCartForms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                try {
                    // Get product and variant data
                    const product = window.ShopifyAnalytics?.meta?.product;
                    const variantId = form.querySelector('[name="id"]')?.value;
                    const quantity = Number(form.querySelector('[name="quantity"]')?.value || 1);
                    const variant = product?.variants?.find(v => v.id.toString() === variantId);

                    if (!product || !variant) return;

                    // Get cart token
                    const cartResponse = await fetch('/cart.js');
                    const cart = await cartResponse.json();
                    const cartToken = cart.token;

                    // Determine cart type
                    const cartType = form.closest('[data-ajax-cart]') 
                        ? 'mini_cart' 
                        : form.closest('[data-quick-add]')
                            ? 'quick_add'
                            : 'product_page';

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push add_to_cart event with enhanced parameters
                    window.dataLayer.push({
                        event: 'add_to_cart',
                        ecommerce: {
                            currency: sanitize.currency(window.Shopify?.currency?.active),
                            value: sanitize.number(variant.price / 100) * quantity,
                            cart_token: sanitize.string(cartToken),
                            cart_type: sanitize.string(cartType),
                            items: [{
                                item_name: sanitize.string(product.title),
                                item_id: sanitize.string(product.id),
                                item_sku: sanitize.string(variant.sku),
                                price: sanitize.number(variant.price / 100),
                                currency: sanitize.currency(window.Shopify?.currency?.active),
                                item_brand: sanitize.string(product.vendor),
                                item_category: sanitize.string(product.type),
                                item_variant: sanitize.string(variant.title),
                                quantity: quantity
                            }]
                        }
                    });
                } catch (error) {
                    console.error('Error pushing add_to_cart event:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up add_to_cart tracking:', error.message);
    }
}); 
