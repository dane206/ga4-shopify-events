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

// Track promotion views
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find all promotional elements
        const promotions = document.querySelectorAll('[data-promotion-id]');
        
        // Track impression frequency
        const impressionMap = new Map();

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const promo = entry.target;
                    const promoId = promo.dataset.promotionId;

                    // Check if already viewed in this session
                    if (impressionMap.get(promoId)) return;
                    impressionMap.set(promoId, true);

                    try {
                        // Get promotion data
                        const promoData = {
                            id: sanitize.string(promo.dataset.promotionId),
                            name: sanitize.string(promo.dataset.promotionName),
                            creative: sanitize.string(promo.dataset.promotionCreative),
                            position: sanitize.string(promo.dataset.promotionPosition)
                        };

                        // Get A/B test data if available
                        const abTest = promo.dataset.abTest ? {
                            test_id: sanitize.string(promo.dataset.abTest),
                            variant: sanitize.string(promo.dataset.abVariant)
                        } : null;

                        // Clear previous ecommerce data
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({ ecommerce: null });

                        // Push view_promotion event with enhanced parameters
                        window.dataLayer.push({
                            event: 'view_promotion',
                            ecommerce: {
                                items: [{
                                    promotion_id: promoData.id,
                                    promotion_name: promoData.name,
                                    creative_name: promoData.creative,
                                    creative_slot: promoData.position,
                                    impression_frequency: 1,
                                    ...(abTest && {
                                        ab_test_id: abTest.test_id,
                                        ab_test_variant: abTest.variant
                                    })
                                }]
                            }
                        });

                        // Stop observing after first view
                        observer.unobserve(promo);
                    } catch (error) {
                        console.error('Error pushing view_promotion event:', error.message);
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        // Start observing promotions
        promotions.forEach(promo => {
            observer.observe(promo);
        });
    } catch (error) {
        console.error('Error setting up promotion view tracking:', error.message);
    }
}); 
