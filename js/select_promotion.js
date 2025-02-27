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

// Track promotion clicks
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find all clickable promotions
        const promotions = document.querySelectorAll(
            'a[data-promotion-id], ' +
            'button[data-promotion-id], ' +
            '[data-promotion-id][role="button"]'
        );

        promotions.forEach(promo => {
            promo.addEventListener('click', () => {
                try {
                    // Get promotion data
                    const promoData = {
                        id: sanitize.string(promo.dataset.promotionId),
                        name: sanitize.string(promo.dataset.promotionName),
                        creative: sanitize.string(promo.dataset.promotionCreative),
                        position: sanitize.string(promo.dataset.promotionPosition),
                        group: sanitize.string(promo.dataset.promotionGroup),
                        referrer: document.referrer || 'direct'
                    };

                    // Get A/B test data if available
                    const abTest = promo.dataset.abTest ? {
                        test_id: sanitize.string(promo.dataset.abTest),
                        variant: sanitize.string(promo.dataset.abVariant)
                    } : null;

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push select_promotion event with enhanced parameters
                    window.dataLayer.push({
                        event: 'select_promotion',
                        ecommerce: {
                            items: [{
                                promotion_id: promoData.id,
                                promotion_name: promoData.name,
                                creative_name: promoData.creative,
                                creative_slot: promoData.position,
                                promotion_group: promoData.group,
                                referral_source: promoData.referrer,
                                ...(abTest && {
                                    ab_test_id: abTest.test_id,
                                    ab_test_variant: abTest.variant
                                })
                            }]
                        }
                    });
                } catch (error) {
                    console.error('Error pushing select_promotion event:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up promotion click tracking:', error.message);
    }
}); 
