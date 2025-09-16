// const axios = require('axios');

// /**
//  * @desc    Get VRL consignment tracking details by calling their internal API
//  * @route   GET /api/v1/tracking/vrl/:trackingId
//  * @access  Public
//  */
// const getVrlTracking = async (req, res) => {
//     try {
//         const { trackingId } = req.params;
//         
//         // Validate tracking ID format
//         if (!trackingId || typeof trackingId !== 'string' || !/^[A-Za-z0-9]{8,15}$/.test(trackingId)) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'Invalid VRL tracking ID. Please provide a valid 8-15 character alphanumeric ID.' 
//             });
//         }

//         // Target the internal AJAX endpoint the VRL website uses
//         const apiUrl = `https://www.vrlgroup.in/track_consignment.aspx?lrtrack=1&lrno=${encodeURIComponent(trackingId)}`;

//         const response = await axios.post(apiUrl, null, { // Body is null as params are in URL
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
//                 'Referer': 'https://www.vrlgroup.in/track_consignment.aspx'
//             },
//             timeout: 15000
//         });

//         // Axios automatically parses the JSON response if the content-type is correct.
//         // We will check if the data is a string and parse it, otherwise we use it directly.
//         let jsonData;
//         if (typeof response.data === 'string') {
//             try {
//                 jsonData = JSON.parse(response.data);
//             } catch (e) {
//                 console.error("Failed to parse response from VRL:", response.data);
//                 throw new Error("Received an invalid response from the tracking service.");
//             }
//         } else {
//             jsonData = response.data;
//         }


//         // Check for failure status from the API
//         if (jsonData.Status !== "Success" || !jsonData.shipment || jsonData.shipment.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 error: jsonData.Msg || 'No tracking information found for this consignment number.'
//             });
//         }

//         const shipment = jsonData.shipment[0];

//         // Map the API data to a clean format
//         const consignmentDetails = {
//             consignmentNo: shipment.lrno,
//             fromCity: shipment.origin,
//             toCity: shipment.bookingtocode,
//             bookingDate: shipment.shipDate,
//             noOfArticles: shipment.noa,
//             currentStatus: shipment.track.length > 0 ? shipment.track[0].Status : 'Details Received'
//         };

//         const trackingHistory = shipment.track.map(item => ({
//             date: item.scanDate,
//             time: item.scanTime,
//             status: item.Status,
//             location: item.ldfromcity
//         })).reverse(); // Reverse to show chronological order

//         const trackingData = {
//             success: true,
//             trackingId,
//             carrier: 'VRL',
//             consignmentDetails,
//             trackingHistory,
//             lastUpdated: new Date().toISOString()
//         };

//         res.json(trackingData);

//     } catch (error) {
//         console.error('Error fetching VRL tracking information:', error.message);
//         let errorMessage = 'Failed to fetch tracking information';
//         let statusCode = 500;
//         
//         if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
//             errorMessage = 'Request to VRL tracking service timed out';
//             statusCode = 504;
//         } else if (error.response) {
//             errorMessage = `VRL service responded with status ${error.response.status}`;
//             statusCode = 502;
//         }
//         
//         res.status(statusCode).json({
//             success: false,
//             error: errorMessage
//         });
//     }
// };

// module.exports = {
//     getVrlTracking
// };




const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Helper function for consistent error logging
const logError = (error, context = {}) => {
    const errorId = uuidv4();
    const timestamp = new Date().toISOString();
    const errorData = {
        errorId,
        timestamp,
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...(error.response && {
                response: {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: error.response.data
                }
            }),
            ...(error.config && {
                request: {
                    url: error.config.url,
                    method: error.config.method,
                    headers: error.config.headers,
                    params: error.config.params,
                    data: error.config.data
                }
            })
        },
        context
    };

    console.error('TRACKING_ERROR:', JSON.stringify(errorData, null, 2));
    return errorId;
};

/**
 * @desc    Get VRL consignment tracking details by calling their internal API
 * @route   GET /api/v1/tracking/vrl/:trackingId
 * @access   Public
 */
const getVrlTracking = async (req, res) => {
    try {
        const { trackingId } = req.params;

        // Validate tracking ID format
        if (!trackingId || typeof trackingId !== 'string' || !/^[A-Za-z0-9]{8,15}$/.test(trackingId)) {
            const error = new Error('Invalid VRL tracking ID format');
            error.name = 'ValidationError';
            error.details = { trackingId };
            const errorId = logError(error, { trackingId });

            return res.status(400).json({
                success: false,
                error: 'Invalid VRL tracking ID. Please provide a valid 8-15 character alphanumeric ID.',
                errorId
            });
        }

        // Target the internal AJAX endpoint the VRL website uses
        const apiUrl = `https://www.vrlgroup.in/track_consignment.aspx?lrtrack=1&lrno=${encodeURIComponent(trackingId)}`;

        const response = await axios.post(apiUrl, null, { // Body is null as params are in URL
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'Referer': 'https://www.vrlgroup.in/track_consignment.aspx'
            },
            timeout: 120000
        });

        // Parse the response data
        let jsonData;
        try {
            jsonData = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;
        } catch (parseError) {
            const error = new Error('Failed to parse VRL API response');
            error.name = 'ParseError';
            error.originalError = parseError.message;
            error.responseData = response.data;
            const errorId = logError(error, { trackingId, responseHeaders: response.headers });

            return res.status(502).json({
                success: false,
                error: 'Received an invalid response from the tracking service.',
                errorId
            });
        }


        // Check for failure status from the API
        if (jsonData.Status !== "Success" || !jsonData.shipment || jsonData.shipment.length === 0) {
            const error = new Error('No tracking data found for consignment');
            error.name = 'NotFoundError';
            error.apiResponse = jsonData;
            const errorId = logError(error, { trackingId, apiStatus: jsonData.Status });

            return res.status(404).json({
                success: false,
                error: jsonData.Msg || 'No tracking information found for this consignment number.',
                errorId
            });
        }

        const shipment = jsonData.shipment[0];

        // Map the API data to a clean format
        const consignmentDetails = {
            consignmentNo: shipment.lrno,
            fromCity: shipment.origin,
            toCity: shipment.bookingtocode,
            bookingDate: shipment.shipDate,
            noOfArticles: shipment.noa,
            currentStatus: shipment.track.length > 0 ? shipment.track[0].Status : 'Details Received'
        };

        const trackingHistory = shipment.track.map(item => ({
            date: item.scanDate,
            time: item.scanTime,
            status: item.Status,
            location: item.ldfromcity
        })).reverse(); // Reverse to show chronological order

        const trackingData = {
            success: true,
            trackingId,
            carrier: 'VRL',
            consignmentDetails,
            trackingHistory,
            lastUpdated: new Date().toISOString()
        };

        res.json(trackingData);

    } catch (error) {
        let errorMessage = 'Failed to fetch tracking information';
        let statusCode = 500;
        let errorId;

        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            errorMessage = 'Request to VRL tracking service timed out';
            statusCode = 504;
            errorId = logError(error, {
                trackingId: req.params.trackingId,
                errorType: 'TimeoutError'
            });
        } else if (error.response) {
            errorMessage = `VRL service responded with status ${error.response.status}`;
            statusCode = error.response.status >= 500 ? 502 : 400;
            errorId = logError(error, {
                trackingId: req.params.trackingId,
                errorType: 'ApiError',
                responseStatus: error.response.status,
                responseData: error.response.data
            });
        } else {
            errorId = logError(error, {
                trackingId: req.params.trackingId,
                errorType: error.name || 'UnknownError'
            });
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            errorId,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    getVrlTracking
};