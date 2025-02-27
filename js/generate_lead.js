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

// Track lead generation events
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find all lead forms
        const leadForms = document.querySelectorAll('form[data-lead-form]');
        
        // Track multi-step progress
        const stepProgress = new Map();

        leadForms.forEach(form => {
            // Initialize step tracking if multi-step
            if (form.dataset.multiStep) {
                stepProgress.set(form, {
                    currentStep: 1,
                    totalSteps: sanitize.number(form.dataset.totalSteps)
                });
            }

            // Track step changes in multi-step forms
            const stepButtons = form.querySelectorAll('[data-step-button]');
            stepButtons.forEach(button => {
                button.addEventListener('click', () => {
                    try {
                        const progress = stepProgress.get(form);
                        if (!progress) return;

                        const newStep = sanitize.number(button.dataset.stepTarget);
                        progress.currentStep = newStep;

                        // Push step change event
                        window.dataLayer.push({
                            event: 'lead_step_change',
                            form_id: sanitize.string(form.dataset.formId),
                            form_type: sanitize.string(form.dataset.formType),
                            step_number: newStep,
                            total_steps: progress.totalSteps
                        });
                    } catch (error) {
                        console.error('Error pushing lead step change event:', error.message);
                    }
                });
            });

            // Track form submissions
            form.addEventListener('submit', () => {
                try {
                    // Get form data
                    const formData = {
                        id: sanitize.string(form.dataset.formId),
                        type: sanitize.string(form.dataset.formType),
                        location: sanitize.string(form.dataset.formLocation),
                        value: sanitize.number(form.dataset.leadValue)
                    };

                    // Get user input fields
                    const userFields = Array.from(form.elements)
                        .filter(element => !['submit', 'button', 'reset'].includes(element.type))
                        .map(element => ({
                            name: element.name,
                            type: element.type,
                            required: element.required
                        }));

                    // Clear previous ecommerce data
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ ecommerce: null });

                    // Push generate_lead event with enhanced parameters
                    window.dataLayer.push({
                        event: 'generate_lead',
                        ecommerce: {
                            form_id: formData.id,
                            form_type: formData.type,
                            form_location: formData.location,
                            lead_value: formData.value,
                            currency: sanitize.currency(window.Shopify?.currency?.active),
                            form_fields: userFields.length,
                            required_fields: userFields.filter(f => f.required).length,
                            ...(stepProgress.get(form) && {
                                multi_step: true,
                                total_steps: stepProgress.get(form).totalSteps
                            })
                        }
                    });
                } catch (error) {
                    console.error('Error pushing generate_lead event:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up lead generation tracking:', error.message);
    }
}); 
