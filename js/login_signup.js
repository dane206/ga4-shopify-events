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

// Track login and signup events
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Find authentication forms
        const authForms = document.querySelectorAll(
            'form[action="/account/login"], ' +
            'form[action="/account"], ' +
            'form[action="/account/register"]'
        );

        // Track social login buttons
        const socialButtons = document.querySelectorAll('[data-social-login]');

        // Track form submissions
        authForms.forEach(form => {
            form.addEventListener('submit', () => {
                try {
                    // Determine auth type
                    const isLogin = form.action.includes('login');
                    const isSignup = form.action.includes('register');
                    
                    // Get method
                    const method = 'email';
                    
                    // Get location
                    const location = form.closest('[data-auth-modal]')
                        ? 'modal'
                        : form.closest('header')
                            ? 'header'
                            : 'page';

                    // Push auth attempt event
                    window.dataLayer.push({
                        event: isLogin ? 'login_attempt' : 'signup_attempt',
                        auth_type: isLogin ? 'login' : 'signup',
                        auth_method: method,
                        auth_location: location
                    });

                    // Listen for success/error
                    const checkAuthStatus = setInterval(() => {
                        const errorElement = form.querySelector('.errors');
                        const successElement = document.querySelector('.shopify-success');

                        if (errorElement) {
                            clearInterval(checkAuthStatus);
                            // Push error event
                            window.dataLayer.push({
                                event: isLogin ? 'login_error' : 'signup_error',
                                auth_type: isLogin ? 'login' : 'signup',
                                auth_method: method,
                                error_type: 'validation',
                                error_message: sanitize.string(errorElement.textContent)
                            });
                        }

                        if (successElement) {
                            clearInterval(checkAuthStatus);
                            // Push success event
                            window.dataLayer.push({
                                event: isLogin ? 'login' : 'sign_up',
                                auth_type: isLogin ? 'login' : 'signup',
                                auth_method: method,
                                auth_location: location
                            });
                        }
                    }, 100);

                    // Clear interval after 5 seconds
                    setTimeout(() => {
                        clearInterval(checkAuthStatus);
                    }, 5000);

                } catch (error) {
                    console.error('Error pushing auth event:', error.message);
                }
            });
        });

        // Track social login clicks
        socialButtons.forEach(button => {
            button.addEventListener('click', () => {
                try {
                    const provider = sanitize.string(button.dataset.socialProvider);
                    const location = button.closest('[data-auth-modal]')
                        ? 'modal'
                        : button.closest('header')
                            ? 'header'
                            : 'page';

                    // Push social auth attempt event
                    window.dataLayer.push({
                        event: 'login_attempt',
                        auth_type: 'login',
                        auth_method: provider,
                        auth_location: location
                    });
                } catch (error) {
                    console.error('Error pushing social auth event:', error.message);
                }
            });
        });

    } catch (error) {
        console.error('Error setting up auth tracking:', error.message);
    }
}); 
