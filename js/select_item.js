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

// Track product clicks in lists
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find all product links
        const productLinks = document.querySelectorAll(
            'a[data-product-id]'
        );

        productLinks.forEach(link => {
            link.addEventListener('click', () => {
                try {
                    // Get product data from attributes
                    const productData = {
                        id: sanitize.string(link.dataset.productId),
                        title: sanitize.string(link.dataset.productTitle),
                        sku: sanitize.string(link.dataset.productSku),
                        price: sanitize.number(link.dataset.productPrice),
                        vendor: sanitize.string(link.dataset.productVendor),
                        type: sanitize.string(link.dataset.productType),
                        index: sanitize.number(link.dataset.productIndex)
                    };

                    // Get list data
                    const listId = window.location.pathname;
                    const listName = document.querySelector('h1')?.textContent?.trim() || listId;
                    const listType = window.location.pathname.includes('/collections/') 
                        ? 'collection' 
                        : window.location.pathname.includes('/search') 
                            ? 'search' 
                            : 'other';

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push select_item event with enhanced parameters
                    window.dataLayer.push({
                        event: 'select_item',
                        ecommerce: {
                            list_id: sanitize.string(listId),
                            list_name: sanitize.string(listName),
                            list_type: sanitize.string(listType),
                            items: [{
                                item_name: productData.title,
                                item_id: productData.id,
                                item_sku: productData.sku,
                                price: productData.price,
                                currency: sanitize.currency(window.Shopify?.currency?.active),
                                item_brand: productData.vendor,
                                item_category: productData.type,
                                item_category2: sanitize.string(link.dataset.productCategory2),
                                item_category3: sanitize.string(link.dataset.productCategory3),
                                item_category4: sanitize.string(link.dataset.productCategory4),
                                item_category5: sanitize.string(link.dataset.productCategory5),
                                index: productData.index,
                                item_list_id: sanitize.string(listId),
                                item_list_name: sanitize.string(listName),
                                item_list_type: sanitize.string(listType)
                            }]
                        }
                    });
                } catch (error) {
                    console.error('Error pushing select_item event:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up select_item tracking:', error.message);
    }
}); 
