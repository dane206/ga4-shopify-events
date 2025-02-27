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

// Track cart item removals
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find all remove buttons and quantity inputs
        const removeButtons = document.querySelectorAll('[data-cart-remove]');
        const quantityInputs = document.querySelectorAll('[data-cart-qty]');

        // Track direct removals
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                try {
                    const item = button.closest('[data-cart-item]');
                    const removalSource = button.closest('[data-ajax-cart]') 
                        ? 'mini_cart' 
                        : 'cart_page';

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push remove_from_cart event
                    window.dataLayer.push({
                        event: 'remove_from_cart',
                        ecommerce: {
                            currency: sanitize.currency(window.Shopify?.currency?.active),
                            value: sanitize.number(item.dataset.itemPrice) * 
                                  sanitize.number(item.dataset.itemQuantity),
                            removal_source: sanitize.string(removalSource),
                            removal_type: 'button_click',
                            items: [{
                                item_name: sanitize.string(item.dataset.itemTitle),
                                item_id: sanitize.string(item.dataset.itemId),
                                item_sku: sanitize.string(item.dataset.itemSku),
                                price: sanitize.number(item.dataset.itemPrice),
                                currency: sanitize.currency(window.Shopify?.currency?.active),
                                quantity: sanitize.number(item.dataset.itemQuantity)
                            }]
                        }
                    });
                } catch (error) {
                    console.error('Error pushing remove_from_cart event:', error.message);
                }
            });
        });

        // Track quantity changes to zero
        let originalValues = new Map();
        
        quantityInputs.forEach(input => {
            // Store original value
            originalValues.set(input, input.value);

            input.addEventListener('change', () => {
                try {
                    const originalValue = originalValues.get(input);
                    const newValue = sanitize.number(input.value);
                    
                    if (newValue === 0 && originalValue > 0) {
                        const item = input.closest('[data-cart-item]');
                        const removalSource = input.closest('[data-ajax-cart]')
                            ? 'mini_cart'
                            : 'cart_page';

                        window.dataLayer.push({ ecommerce: null });
                        window.dataLayer.push({
                            event: 'remove_from_cart',
                            ecommerce: {
                                currency: sanitize.currency(window.Shopify?.currency?.active),
                                value: sanitize.number(item.dataset.itemPrice) * 
                                      sanitize.number(originalValue),
                                removal_source: sanitize.string(removalSource),
                                removal_type: 'quantity_zero',
                                items: [{
                                    item_name: sanitize.string(item.dataset.itemTitle),
                                    item_id: sanitize.string(item.dataset.itemId),
                                    item_sku: sanitize.string(item.dataset.itemSku),
                                    price: sanitize.number(item.dataset.itemPrice),
                                    currency: sanitize.currency(window.Shopify?.currency?.active),
                                    quantity: sanitize.number(originalValue)
                                }]
                            }
                        });
                    }
                    
                    // Update stored value
                    originalValues.set(input, newValue);
                } catch (error) {
                    console.error('Error pushing remove_from_cart event for quantity change:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up remove_from_cart tracking:', error.message);
    }
}); 
