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

// Track product page views
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Get product data from ShopifyAnalytics
        const product = window.ShopifyAnalytics?.meta?.product;
        
        if (!product) return;

        // Get selected variant
        const selectedVariant = product.variants.find(v => 
            v.id === (window.ShopifyAnalytics?.meta?.selectedVariantId)
        ) || product.variants[0];

        // Check for bundle products
        const isBundle = product.tags?.some(tag => 
            tag.toLowerCase().includes('bundle')
        );

        // Get cross-sell products
        const crossSellProducts = Array.from(
            document.querySelectorAll('[data-product-recommendations] [data-product-id]')
        ).map(el => ({
            id: el.dataset.productId,
            title: el.dataset.productTitle
        }));

        // Clear previous ecommerce data
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });

        // Push view_item event with enhanced parameters
        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                currency: sanitize.currency(window.Shopify?.currency?.active),
                value: sanitize.number(selectedVariant.price / 100),
                bundle: isBundle,
                cross_sell_products: crossSellProducts.map(p => ({
                    item_id: sanitize.string(p.id),
                    item_name: sanitize.string(p.title)
                })),
                items: [{
                    item_name: sanitize.string(product.title),
                    item_id: sanitize.string(product.id),
                    item_sku: sanitize.string(selectedVariant.sku),
                    price: sanitize.number(selectedVariant.price / 100),
                    currency: sanitize.currency(window.Shopify?.currency?.active),
                    item_brand: sanitize.string(product.vendor),
                    item_category: sanitize.string(product.type),
                    item_variant: sanitize.string(selectedVariant.title),
                    bundle: isBundle,
                    quantity: 1
                }]
            }
        });

        // Track variant changes
        document.querySelectorAll('[name="id"]').forEach(select => {
            select.addEventListener('change', () => {
                try {
                    const newVariant = product.variants.find(v => 
                        v.id.toString() === select.value
                    );

                    if (!newVariant) return;

                    window.dataLayer.push({ ecommerce: null });
                    window.dataLayer.push({
                        event: 'view_item',
                        ecommerce: {
                            currency: sanitize.currency(window.Shopify?.currency?.active),
                            value: sanitize.number(newVariant.price / 100),
                            bundle: isBundle,
                            items: [{
                                item_name: sanitize.string(product.title),
                                item_id: sanitize.string(product.id),
                                item_sku: sanitize.string(newVariant.sku),
                                price: sanitize.number(newVariant.price / 100),
                                currency: sanitize.currency(window.Shopify?.currency?.active),
                                item_brand: sanitize.string(product.vendor),
                                item_category: sanitize.string(product.type),
                                item_variant: sanitize.string(newVariant.title),
                                bundle: isBundle,
                                quantity: 1
                            }]
                        }
                    });
                } catch (error) {
                    console.error('Error pushing variant change event:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error pushing view_item event:', error.message);
    }
}); 
