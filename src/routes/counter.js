const express = require('express');
const Counter = require('../models/Counter');
const router = express.Router();

// Increment counter and return current value
router.get('/hit/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const referer = req.get('referer') || 'unknown';
    
    // Find and update counter, create if doesn't exist
    const counter = await Counter.findOneAndUpdate(
      { key },
      { 
        $inc: { count: 1 },
        lastVisit: Date.now(),
      },
      { new: true, upsert: true }
    );
    
    // Return counter value with JSONP support for direct script usage
    const callback = req.query.callback;
    const data = { count: counter.count };
    
    if (callback) {
      // JSONP response for cross-origin requests
      res.setHeader('Content-Type', 'application/javascript');
      res.send(`${callback}(${JSON.stringify(data)})`);
    } else {
      // Regular JSON response
      res.json(data);
    }
  } catch (error) {
    console.error('Error updating counter:', error);
    res.status(500).json({ error: 'Failed to update counter' });
  }
});

// Get current counter value without incrementing
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const counter = await Counter.findOne({ key });
    const count = counter ? counter.count : 0;
    
    // Support for JSONP
    const callback = req.query.callback;
    const data = { count };
    
    if (callback) {
      res.setHeader('Content-Type', 'application/javascript');
      res.send(`${callback}(${JSON.stringify(data)})`);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error retrieving counter:', error);
    res.status(500).json({ error: 'Failed to get counter value' });
  }
});

module.exports = router;
