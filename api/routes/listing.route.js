import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, userViews, subscribe, totalListingsCount, allListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.post('/subscribe',subscribe);
router.post('/views/increment/:id', userViews)
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/all',allListings);
router.get('/total/count',totalListingsCount);
//router.get('/dashboard-data',dashboardData);

export default router;
