// const axios = require('axios');
// const cheerio = require('cheerio');

// /**
//  * @desc    Get VRL consignment tracking details
//  * @route   GET /api/v1/tracking/vrl/:trackingId
//  * @access  Public
//  */
// const getVrlTracking = async (req, res) => {
//     try {
//         const { trackingId } = req.params;
        
//         // Validate tracking ID format (VRL tracking IDs are typically 10-12 alphanumeric characters)
//         if (!trackingId || typeof trackingId !== 'string' || !/^[A-Za-z0-9]{10,12}$/.test(trackingId)) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'Invalid VRL tracking ID. Please provide a valid 10-12 character alphanumeric ID.' 
//             });
//         }

//         // Make request to VRL tracking page
//         const response = await axios.post(
//             'https://www.vrlgroup.in/track_consignment.aspx',
//             `txt_cons_no=${encodeURIComponent(trackingId)}&btn_track=Track`,
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//                     'Accept-Language': 'en-US,en;q=0.5',
//                     'Origin': 'https://www.vrlgroup.in',
//                     'Referer': 'https://www.vrlgroup.in/track_consignment.aspx'
//                 },
//                 timeout: 10000 // 10 seconds timeout
//             }
//         );

//         // Parse the HTML response
//         const $ = cheerio.load(response.data);
        
//         // Check if tracking data was found
//         const noDataMessage = $('.alert-danger, .error-message').text().trim();
//         if (noDataMessage.toLowerCase().includes('no record found') || 
//             noDataMessage.toLowerCase().includes('invalid consignment')) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'No tracking information found for this consignment number.'
//             });
//         }

//         // Extract consignment details
//         const consignmentDetails = {};
//         $('table.table tbody tr').each((i, row) => {
//             const cols = $(row).find('td');
//             if (cols.length >= 2) {
//                 const key = $(cols[0]).text().trim().replace(/[\s:]+$/, '');
//                 const value = $(cols[1]).text().trim();
//                 if (key && value) {
//                     // Convert keys to camelCase for consistency
//                     const formattedKey = key
//                         .toLowerCase()
//                         .replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());
//                     consignmentDetails[formattedKey] = value;
//                 }
//             }
//         });

//         // Extract tracking history
//         const trackingHistory = [];
//         $('table.table-hover tbody tr').each((i, row) => {
//             const cols = $(row).find('td');
//             if (cols.length >= 4) {
//                 trackingHistory.push({
//                     date: $(cols[0]).text().trim(),
//                     time: $(cols[1]).text().trim(),
//                     status: $(cols[2]).text().trim(),
//                     location: $(cols[3]).text().trim(),
//                     remarks: $(cols[4] || '').text().trim()
//                 });
//             }
//         });

//         // Structure the response
//         const trackingData = {
//             success: true,
//             trackingId,
//             carrier: 'VRL',
//             consignmentDetails,
//             trackingHistory,
//             lastUpdated: new Date().toISOString()
//         };

//         res.json(trackingData);

//     } catch (error) {
//         console.error('Error fetching VRL tracking information:', error);
        
//         let errorMessage = 'Failed to fetch tracking information';
//         let statusCode = 500;
        
//         if (error.code === 'ECONNABORTED') {
//             errorMessage = 'Request to VRL tracking service timed out';
//             statusCode = 504; // Gateway Timeout
//         } else if (error.response) {
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             errorMessage = `VRL service responded with status ${error.response.status}`;
//             statusCode = 502; // Bad Gateway
//         } else if (error.request) {
//             // The request was made but no response was received
//             errorMessage = 'No response received from VRL tracking service';
//             statusCode = 502; // Bad Gateway
//         }
        
//         res.status(statusCode).json({
//             success: false,
//             error: errorMessage,
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// module.exports = {
//     getVrlTracking
// };
