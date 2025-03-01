const express = require('express');
const Counter = require('../models/Counter');
const router = express.Router();

router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    // Find and update counter, create if doesn't exist
    const counter = await Counter.findOneAndUpdate(
      { key },
      { 
        $inc: { count: 1 },
        lastVisit: Date.now(),
      },
      { new: true, upsert: true }
    );
    
    // Create a more professional SVG badge with the count
    const count = counter.count;
    const label = req.query.label || 'Visit count:';
    const color = req.query.color || '4c1';
    const labelColor = req.query.labelColor || '555';
    const style = req.query.style || 'flat';
    
    // Calculate dimensions
    const labelWidth = Math.max(label.length * 6.5, 50) + 10;
    const countWidth = Math.max(count.toString().length * 8, 25) + 10;
    const totalWidth = labelWidth + countWidth;
    const height = 20;
    
    // Generate SVG based on style
    let svg;
    
    if (style === 'flat-square') {
      svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
        <rect width="${labelWidth}" height="${height}" fill="#${labelColor}"/>
        <rect width="${countWidth}" height="${height}" x="${labelWidth}" fill="#${color}"/>
        <text x="${labelWidth/2}" y="${height/2 + 4}" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" fill="white">${label}</text>
        <text x="${labelWidth + countWidth/2}" y="${height/2 + 4}" font-weight="bold" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" fill="white">${count}</text>
      </svg>
      `;
    } else if (style === 'plastic') {
      svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
        <linearGradient id="a" x2="0" y2="100%">
          <stop offset="0" stop-color="#eee" stop-opacity=".1"/>
          <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
        <rect rx="4" width="${totalWidth}" height="${height}" fill="#${labelColor}"/>
        <rect rx="4" x="${labelWidth}" width="${countWidth}" height="${height}" fill="#${color}"/>
        <rect rx="4" width="${totalWidth}" height="${height}" fill="url(#a)"/>
        <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
          <text x="${labelWidth/2}" y="${height/2 + 4}">${label}</text>
          <text x="${labelWidth + countWidth/2}" y="${height/2 + 4}" font-weight="bold">${count}</text>
        </g>
      </svg>
      `;
    } else if (style === 'for-the-badge') {
      svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth + 10}" height="${height + 10}">
        <rect rx="3" width="${totalWidth + 10}" height="${height + 8}" fill="#${labelColor}"/>
        <rect rx="3" x="${labelWidth + 5}" width="${countWidth + 5}" height="${height + 8}" fill="#${color}"/>
        <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
          <text x="${labelWidth/2 + 5}" y="${height/2 + 8}" font-weight="bold" transform="uppercase">${label.toUpperCase()}</text>
          <text x="${labelWidth + countWidth/2 + 5}" y="${height/2 + 8}" font-weight="bold">${count}</text>
        </g>
      </svg>
      `;
    } else {
      // Default flat style
      svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
        <linearGradient id="a" x2="0" y2="100%">
          <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
          <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
        <rect rx="3" width="${totalWidth}" height="${height}" fill="#${labelColor}"/>
        <rect rx="3" x="${labelWidth}" width="${countWidth}" height="${height}" fill="#${color}"/>
        <rect rx="3" width="${totalWidth}" height="${height}" fill="url(#a)"/>
        <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
          <text x="${labelWidth/2}" y="${height/2 + 4}">${label}</text>
          <text x="${labelWidth + countWidth/2}" y="${height/2 + 4}">${count}</text>
        </g>
      </svg>
      `.trim();
    }
    
    // Set headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.send(svg);
  } catch (error) {
    console.error('Error generating badge:', error);
    
    // Send a fallback badge on error
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
      <rect width="120" height="20" rx="3" fill="#555"/>
      <text x="60" y="14" textAnchor="middle" fill="#fff" fontFamily="Arial" fontSize="11">Error</text>
    </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(svg);
  }
});

// Add a variant that doesn't increment the counter
router.get('/view/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    // Find counter without incrementing
    const counter = await Counter.findOne({ key });
    const count = counter ? counter.count : 0;
    
    // Use the same badge rendering logic as above
    const label = req.query.label || 'Visit count: ';
    const color = req.query.color || '4c1';
    const labelColor = req.query.labelColor || '555';
    const style = req.query.style || 'flat';
    
    // Calculate dimensions
    const labelWidth = Math.max(label.length * 6.5, 50) + 10;
    const countWidth = Math.max(count.toString().length * 8, 25) + 10;
    const totalWidth = labelWidth + countWidth;
    const height = 20;
    
    // Generate a simple flat SVG badge
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
      <linearGradient id="a" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <rect rx="3" width="${totalWidth}" height="${height}" fill="#${labelColor}"/>
      <rect rx="3" x="${labelWidth}" width="${countWidth}" height="${height}" fill="#${color}"/>
      <rect rx="3" width="${totalWidth}" height="${height}" fill="url(#a)"/>
      <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
        <text x="${labelWidth/2}" y="${height/2 + 4}">${label}</text>
        <text x="${labelWidth + countWidth/2}" y="${height/2 + 4}">${count}</text>
      </g>
    </svg>
    `.trim();
    
    // Set headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'max-age=60'); // Cache for 60 seconds
    
    res.send(svg);
  } catch (error) {
    console.error('Error viewing badge:', error);
    res.status(500).send('Error generating badge');
  }
});

module.exports = router;
