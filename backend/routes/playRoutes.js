const express = require('express');
const router = express.Router();
const {
    authenticateUser,
} = require('../middleware/authentication');

const {
    starFishing,
    swapTicket,
    addPlayedFish,
    purchaseItems,
    useItem,
} = require('../controllers/playController');

router.post('/start', authenticateUser, starFishing);
router.post('/swap', authenticateUser, swapTicket);
router.post('/fish', authenticateUser, addPlayedFish);
router.post('/purchase', authenticateUser, purchaseItems);
router.post('/useitem', authenticateUser, useItem);

module.exports = router;
