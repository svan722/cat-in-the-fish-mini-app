const express = require('express');
const router = express.Router();
const {
    authenticateUser,
} = require('../middleware/authentication');

const {
    starFishing,
    swapTicket,
    addPlayedFish,

    useBoost,
    getAllBoost,
    addBoost,
    getTotalBoostHistory,

    generateInvoice,
} = require('../controllers/playController');

router.post('/start', authenticateUser, starFishing);
router.post('/swap', authenticateUser, swapTicket);
router.post('/fish', authenticateUser, addPlayedFish);

router.post('/boost/use', authenticateUser, useBoost);
router.post('/boost/add', authenticateUser, addBoost);
router.get('/boost/getall', authenticateUser, getAllBoost);
router.get('/boost/gethistory', authenticateUser, getTotalBoostHistory);

router.post('/invoice', authenticateUser, generateInvoice);

module.exports = router;
