const sampleOrderConfirmationTemplate = (order) => {
    const { _id, shippingInfo = {}, orderItems = [], itemsPrice = 0, shippingPrice = 0, totalPrice = 0, taxPrice = 0, discount = 0 } = order;

    // --- Layout for Desktop ---
    const itemsHtmlDesktop = orderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top;">
                <img src="${item.image}" alt="${item.name}" width="60" style="vertical-align: middle; margin-right: 15px; border-radius: 4px;">
                ${item.name}
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Sample Order</p>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; vertical-align: top;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; vertical-align: top;">₹${((item.unit?.price || item.price || 0).toFixed(2))}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; vertical-align: top;">₹${(((item.unit?.price || item.price || 0) * (item.quantity || 1)).toFixed(2))}</td>
        </tr>
    `).join('');

    // --- Simpler, Stacked Layout for Mobile ---
    const itemsHtmlMobile = orderItems.map(item => `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
            <tr>
                <td width="80" valign="top">
                    <img src="${item.image}" alt="${item.name}" width="65" style="border-radius: 4px;">
                </td>
                <td valign="top" style="padding-left: 15px;">
                    <p style="margin: 0; font-weight: bold; color: #333;">${item.name}</p>
                    <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">Sample Order</p>
                    <p style="margin: 4px 0 0 0;">Quantity: ${item.quantity || 1}</p>
                    <p style="margin: 4px 0 0 0;">Price: ₹${((item.unit?.price || item.price || 0).toFixed(2))}</p>
                    <p style="margin: 4px 0 0 0;"><b>Subtotal: ₹${(((item.unit?.price || item.price || 0) * (item.quantity || 1)).toFixed(2))}</b></p>
                </td>
            </tr>
        </table>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            p { font-size: 16px; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: left; }
            .header h1 { font-size: 24px; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 20px; font-size: 0.9em; text-align: center; color: #777; }
            
            .mobile-only { display: none; }
            .desktop-only { display: table; }
            .sample-badge {
                display: inline-block;
                background-color: #f0f7ff;
                color: #0066cc;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
                margin-left: 8px;
                vertical-align: middle;
            }

            /* --- Responsive Styles for Mobile --- */
            @media screen and (max-width: 600px) {
                .container { width: 100% !important; padding: 15px !important; }
                .desktop-only { display: none !important; }
                .mobile-only { display: block !important; }
                .total { text-align: center !important; }
            }
        </style>
    </head>
    <body style="background-color: #f4f4f4;">
        <div class="container" style="background-color: #ffffff; border-radius: 8px;">
            <div class="header">
                <h1>Sample Order Confirmed! <span class="sample-badge">SAMPLE</span></h1>
            </div>
            <p>Hi ${shippingInfo.fullName || 'there'},</p>
            <p>Thank you for requesting a sample from DhagaKart. We've received your request and will process it shortly.</p>
            
            <h2 style="border-top: 1px solid #ddd; padding-top: 20px;">Sample Request Details (ID: ${_id})</h2>
            
            <h3>Shipping Address</h3>
            <p style="font-size: 15px; color: #555;">
                ${shippingInfo.address}<br>
                ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}<br>
                ${shippingInfo.country || 'India'}<br>
                <b>Contact:</b> ${shippingInfo.phoneNo}
                ${shippingInfo.email ? `<br><b>Email:</b> ${shippingInfo.email}` : ''}
            </p>

            <h3>Sample Order Summary</h3>
            
            <table class="desktop-only" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th style="text-align: left; padding-bottom: 10px; border-bottom: 2px solid #eee;">Product</th>
                        <th style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #eee;">Quantity</th>
                        <th style="text-align: right; padding-bottom: 10px; border-bottom: 2px solid #eee;">Price</th>
                        <th style="text-align: right; padding-bottom: 10px; border-bottom: 2px solid #eee;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtmlDesktop}
                </tbody>
            </table>

            <div class="mobile-only">
                ${itemsHtmlMobile}
            </div>
            
            <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em; margin: 20px 0;">
                <span>Total Amount:</span>
                <span>₹${(totalPrice || 0).toFixed(2)}</span>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #17a2b8;">
                <h3 style="margin-top: 0; color: #0c5460;">Important Notes:</h3>
                <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li>This is a sample order. Please review the products before placing bulk orders.</li>
                    <li>Standard delivery time is 5-7 business days.</li>
                    <li>For any queries regarding your sample order, please contact our support team.</li>
                    ${shippingPrice === 0 ? '<li>Free shipping applied to this order.</li>' : ''}
                </ul>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing DhagaKart for your business needs!</p>
                <p>© ${new Date().getFullYear()} DhagaKart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = sampleOrderConfirmationTemplate;
