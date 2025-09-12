const axios = require('axios');

/**
 * @desc    Get VRL consignment tracking details by calling their internal API
 * @route   GET /api/v1/tracking/vrl/:trackingId
 * @access  Public
 */
const getVrlTracking = async (req, res) => {
    try {
        const { trackingId } = req.params;
        
        // Validate tracking ID format
        if (!trackingId || typeof trackingId !== 'string' || !/^[A-Za-z0-9]{8,15}$/.test(trackingId)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid VRL tracking ID. Please provide a valid 8-15 character alphanumeric ID.' 
            });
        }

        // Target the internal AJAX endpoint the VRL website uses
        const apiUrl = `https://www.vrlgroup.in/track_consignment.aspx?lrtrack=1&lrno=${encodeURIComponent(trackingId)}`;

        const response = await axios.post(apiUrl, null, { // Body is null as params are in URL
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'Referer': 'https://www.vrlgroup.in/track_consignment.aspx'
            },
            timeout: 15000
        });

        // Axios automatically parses the JSON response if the content-type is correct.
        // We will check if the data is a string and parse it, otherwise we use it directly.
        let jsonData;
        if (typeof response.data === 'string') {
            try {
                jsonData = JSON.parse(response.data);
            } catch (e) {
                console.error("Failed to parse response from VRL:", response.data);
                throw new Error("Received an invalid response from the tracking service.");
            }
        } else {
            jsonData = response.data;
        }


        // Check for failure status from the API
        if (jsonData.Status !== "Success" || !jsonData.shipment || jsonData.shipment.length === 0) {
            return res.status(404).json({
                success: false,
                error: jsonData.Msg || 'No tracking information found for this consignment number.'
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
        console.error('Error fetching VRL tracking information:', error.message);
        let errorMessage = 'Failed to fetch tracking information';
        let statusCode = 500;
        
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            errorMessage = 'Request to VRL tracking service timed out';
            statusCode = 504;
        } else if (error.response) {
            errorMessage = `VRL service responded with status ${error.response.status}`;
            statusCode = 502;
        }
        
        res.status(statusCode).json({
            success: false,
            error: errorMessage
        });
    }
};

module.exports = {
    getVrlTracking
};