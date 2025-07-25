const orderConfirmationTemplate = (order) => {
    const { _id, shippingInfo, orderItems, totalPrice } = order;

    // --- Layout for Desktop ---
    const itemsHtmlDesktop = orderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top;">
                <img src="${item.image}" alt="${item.name}" width="60" style="vertical-align: middle; margin-right: 15px; border-radius: 4px;">
                ${item.name}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; vertical-align: top;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; vertical-align: top;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; vertical-align: top;">₹${(item.quantity * item.price).toFixed(2)}</td>
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
                    <p style="margin: 4px 0 0 0;">Quantity: ${item.quantity}</p>
                    <p style="margin: 4px 0 0 0;">Price: ₹${item.price.toFixed(2)}</p>
                    <p style="margin: 4px 0 0 0;"><b>Subtotal: ₹${(item.quantity * item.price).toFixed(2)}</b></p>
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
                <h1>Order Confirmed! 🎉</h1>
            </div>
            <p>Hi ${shippingInfo.businessName},</p>
            <p>Thank you for your order with DhagaKart. We've received it and are getting it ready for you.</p>
            
            <h2 style="border-top: 1px solid #ddd; padding-top: 20px;">Order Details (ID: ${_id})</h2>
            
            <h3>Shipping Address</h3>
            <p style="font-size: 15px; color: #555;">
                ${shippingInfo.address}<br>
                ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}<br>
                ${shippingInfo.country}<br>
                <b>Contact:</b> ${shippingInfo.phoneNo}
            </p>

            <h3>Order Summary</h3>
            
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
            
            <hr style="border: none; border-top: 2px solid #eee; margin-top: 20px;">
            <h3 class="total">Grand Total: ₹${totalPrice.toFixed(2)}</h3>

            <p style="margin-top: 30px;">We will notify you again once your order has been shipped. Thanks for shopping with us!</p>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} DhagaKart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = orderConfirmationTemplate;