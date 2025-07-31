// File: src/routes/index.js
const express           = require('express');
const pool              = require('../config/database');
const authRoutes        = require('./auth.routes');
const portfolioRoutes   = require('./portfolio.routes');
const gigpostRoutes     = require('./gigpost.routes');
const gigsRoutes        = require('./gigs.routes');    // your original gigs.routes
const gigs1Routes       = require('./gigs1.routes');   // the new version
const gigsstatusRoutes  = require('./gigsstatus.routes'); 
const skillsRoutes      = require('./skills.routes');
const studentRoutes     = require('./studenthome.routes');
const gigApplication = require('./gigApplications.routes');
const portfolioAttachRoutes = require('./portfolioattach.routes');
const gigApplications1   = require('./gigApplications1.routes');
const deliverablesRoutes = require('./deliverables.routes');


const router = express.Router();
 
// Health check
router.get('/health', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    return res.json({
      server: 'up',
      database: rows[0].result === 1 ? 'connected' : 'error'
    });
  } catch (err) {
    next(err);
  }
});

// Mount your existing endpoints
router.use('/auth',      authRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/recruiter', gigpostRoutes);
router.use('/gigs',      gigsRoutes);      // still available at /gigs
router.use('/skills',    skillsRoutes);
router.use('/students',  studentRoutes);
router.use('/gigs1',     gigs1Routes);    
router.use('/gig_application', gigApplication);
router.use('/gigsstatus',  gigsstatusRoutes); 
router.use('/', portfolioAttachRoutes);
router.use('/gig_applications', gigApplications1);
router.use('/gig_applications_deliverable', deliverablesRoutes);


module.exports = router;
