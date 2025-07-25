const orderConfirmationTemplate = (order) => {
    const { _id, shippingInfo, orderItems, totalPrice } = order;

    // Create HTML table rows for each item in the order
    // We add 'data-label' attributes for the mobile view
    const itemsHtml = orderItems.map(item => `
        <tr>
            <td data-label="Product" style="padding: 10px; border-bottom: 1px solid #ddd;">
                <img src="${item.image}" alt="${item.name}" width="50" style="vertical-align: middle; margin-right: 10px; border-radius: 4px;">
                ${item.name}
            </td>
            <td data-label="Quantity" style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td data-label="Price" style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
            <td data-label="Subtotal" style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            h1, h2, h3 { color: #000; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 10px; }
            th { background-color: #f4f4f4; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 20px; font-size: 0.9em; text-align: center; color: #777; }

            /* --- Responsive Styles for Mobile --- */
            @media screen and (max-width: 600px) {
                .container {
                    width: 100%;
                    padding: 10px;
                    margin: 0;
                    border: none;
                    border-radius: 0;
                }
                
                /* Hide table headers on mobile */
                table thead {
                    display: none;
                }
                
                /* Make table rows and cells stack vertically */
                table tr {
                    display: block;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #007bff;
                }
                
                table td {
                    display: block;
                    text-align: right; /* Align cell content to the right */
                    border-bottom: 1px dotted #ccc;
                }
                
                /* Add labels before the cell content */
                table td::before {
                    content: attr(data-label); /* Use the data-label as a prefix */
                    float: left; /* Align the label to the left */
                    font-weight: bold;
                }

                /* First cell (product name) alignment */
                table td:first-child {
                    text-align: left; /* Keep product name left-aligned */
                }

                 table td:first-child::before {
                    display: none; /* Don't show a label for the main product cell */
                }

                .total {
                    text-align: center;
                    margin-top: 25px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Confirmed! 🎉</h1>
            <p>Hi ${shippingInfo.businessName},</p>
            <p>Thank you for your order with DhagaKart. We've received it and are getting it ready for you.</p>
            
            <h2>Order Details (ID: ${_id})</h2>
            
            <h3>Shipping Address</h3>
            <p>
                ${shippingInfo.address}<br>
                ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}<br>
                ${shippingInfo.country}<br>
                <b>Contact:</b> ${shippingInfo.phoneNo}
            </p>

            <h3>Order Summary</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="text-align: center;">Quantity</th>
                        <th style="text-align: right;">Price</th>
                        <th style="text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <h3 class="total">Grand Total: ₹${totalPrice.toFixed(2)}</h3>

            <p>We will notify you again once your order has been shipped. Thanks for shopping with us!</p>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} DhagaKart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = orderConfirmationTemplate;