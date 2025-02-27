# GA4 E-commerce Event Tracking for Shopify Plus

Complete implementation of Google Analytics 4 e-commerce events for Shopify Plus stores.

## Overview

This package provides standardized tracking for 15 core GA4 e-commerce events:

### Theme Events

- `view_item_list` - Collection/list views
- `select_item` - Product clicks
- `view_item` - Product page views
- `add_to_cart` - Cart additions
- `view_cart` - Cart views
- `remove_from_cart` - Cart removals
- `view_promotion` - Promotional views
- `select_promotion` - Promotional clicks
- `search` - Site search
- `generate_lead` - Form submissions
- `login_signup` - Authentication

### Checkout Events (Shopify Plus)

- `begin_checkout` - Checkout initiation
- `add_shipping_info` - Shipping selection
- `add_payment_info` - Payment selection
- `purchase` - Order completion

## Features

- Enhanced error handling
- Currency validation
- A/B test support
- Multi-step form tracking
- Social login tracking
- Cart source/token tracking
- Bundle/cross-sell detection
- Enhanced category support
- Comprehensive data validation
- Detailed error messaging

## Technical Details

### Browser Compatibility

- Chrome 83+
- Firefox 78+
- Safari 13+
- Edge 84+
- iOS Safari 13.4+
- Chrome for Android 83+

### Performance Impact

- Average file size: 5-10KB per script
- Lazy loading enabled
- Minimal DOM operations
- Debounced event handlers
- Efficient selectors

### Dependencies

- No external libraries required
- Native JavaScript ES6+
- Shopify Ajax API
- GTM data layer

### File Sizes (minified)

- Theme events: ~45KB total
- Checkout events: ~20KB total
- Total implementation: ~65KB

## Implementation Examples

### Common Scenarios

```liquid
<div class="collection-grid"
     data-list-id="{{ collection.handle }}"
     data-list-name="{{ collection.title }}">
  {% for product in collection.products %}
    {% render 'product-card' with enhanced_tracking: true %}
  {% endfor %}
</div>
```

```liquid
<form action="/cart/add" 
      data-cart-form
      data-product-id="{{ product.id }}">
  // Form contents
</form>
```

```liquid
<form data-lead-form
      data-total-steps="3"
      data-form-id="newsletter_popup">
  // Form steps
</form>
```

### Best Practices

1. Data Attributes

- Use consistent naming
- Include required fields
- Validate values
- Handle empty states

2. Error Handling

- Catch all promises
- Log meaningful errors
- Fail gracefully
- Maintain user experience

3. Performance

- Lazy load scripts
- Debounce events
- Use efficient selectors
- Minimize DOM operations

### Troubleshooting Guide

Common Issues:

1. Events not firing
   - Check script loading
   - Verify data attributes
   - Check console errors
   - Test GTM triggers

2. Missing data
   - Validate liquid variables
   - Check data layer
   - Verify selectors
   - Test edge cases

3. Performance issues
   - Monitor loading time
   - Check browser tools
   - Verify lazy loading
   - Test mobile devices

## Development Notes

### Code Standards

- ES6+ JavaScript
- Consistent formatting
- JSDoc comments
- Error handling
- Type checking
- Data validation

### Testing Framework

- Jest for unit tests
- Cypress for E2E
- GTM preview mode
- GA4 DebugView
- Browser console

### Build Process

1. Development
   - ESLint validation
   - Prettier formatting
   - TypeScript checking
   - Unit tests

2. Production
   - Minification
   - Source maps
   - Version tagging
   - CDN deployment

### Version History

- v1.0.0 - Initial release
- v1.1.0 - Enhanced error handling
- v1.2.0 - A/B test support
- v1.3.0 - Multi-step forms

## Security

### Data Handling

- No PII collection
- Data sanitization
- Secure transmission
- Error masking

### PII Considerations

- Email hashing
- Phone number masking
- Address exclusion
- User ID handling

### GDPR Compliance

- Consent checking
- Data minimization
- Purpose limitation
- Storage limits

### Cookie Requirements

- Essential only
- Consent based
- Configurable
- Documentation

## Installation

1. Copy JS files to theme assets:
   - Theme events to `/assets/`
   - Checkout events to `/checkout/`

2. Add script tags to theme.liquid
3. Add script tags to checkout.liquid (Plus only)
4. Add required data attributes to templates
5. Test implementation

## Documentation

See `implementation.txt` for detailed:

- File requirements
- Data attributes
- Theme updates
- Testing steps
- Validation checklist

## Requirements

- Shopify Plus store
- Google Tag Manager
- GA4 property
- Theme access
- Checkout.liquid access (Plus)

## Testing

1. Use GTM Preview mode
2. Check browser console
3. Verify GA4 DebugView
4. Validate data layer
5. Test checkout flow
6. Verify error handling

## Support

For implementation support:

1. Review implementation.txt
2. Check browser console
3. Verify data attributes
4. Test in GTM preview

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## License

MIT License - see LICENSE file

## Authors

Dane
