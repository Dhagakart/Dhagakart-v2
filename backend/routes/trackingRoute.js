// import express from 'express';
// import axios from 'axios';
// import cheerio from 'cheerio';

// const router = express.Router();

// /**
//  * @route   GET /api/tracking/vrl/:trackingId
//  * @desc    Get tracking information from VRL
//  * @access  Public
//  */
// router.get('/vrl/:trackingId', async (req, res) => {
//   try {
//     const { trackingId } = req.params;
    
//     // Validate tracking ID format (VRL tracking IDs typically follow a specific format)
//     if (!trackingId || typeof trackingId !== 'string' || !/^[A-Za-z0-9]+$/.test(trackingId)) {
//       return res.status(400).json({ success: false, error: 'Invalid VRL tracking ID' });
//     }

//     // Make request to VRL tracking page
//     const response = await axios.post('https://www.vrlgroup.in/track_consignment.aspx', 
//       `txt_cons_no=${encodeURIComponent(trackingId)}&btn_track=Track`, 
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//           'Accept-Language': 'en-US,en;q=0.5',
//           'Origin': 'https://www.vrlgroup.in',
//           'Referer': 'https://www.vrlgroup.in/track_consignment.aspx'
//         }
//       }
//     );

//     // Parse the HTML response
//     const $ = cheerio.load(response.data);
    
//     // Extract tracking information from VRL's tracking page
//     // Note: These selectors might need adjustment based on VRL's actual HTML structure
//     const trackingData = {
//       status: $('.status-text').first().text().trim() || 'In Transit',
//       lastUpdate: new Date().toLocaleString(),
//       timeline: [],
//       details: {}
//     };

//     // Extract timeline events
//     $('.timeline-item').each((i, el) => {
//       trackingData.timeline.push({
//         status: $(el).find('.status').text().trim(),
//         location: $(el).find('.location').text().trim(),
//         timestamp: $(el).find('.time').text().trim(),
//         completed: i === 0 // First item is usually the most recent/completed
//       });
//     });

//     // Extract package details
//     trackingData.details = {
//       origin: $('.origin-address').text().trim(),
//       destination: $('.destination-address').text().trim(),
//       expectedDelivery: $('.expected-delivery').text().trim(),
//       weight: $('.package-weight').text().trim(),
//       courierPartner: 'Delhivery'
//     };

//     res.json({
//       success: true,
//       trackingId,
//       ...trackingData
//     });

//   } catch (error) {
//     console.error('Error fetching tracking information:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch tracking information',
//       details: error.message
//     });
//   }
// });

// export default router;
