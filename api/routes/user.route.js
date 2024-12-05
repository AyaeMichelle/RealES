import express from 'express';
import {deleteEachUser, deleteUser, getUser, getUserListings, getUsers, test, totalUsersCount, UpdateRole, updateUser} from '../controllers/user.controller.js';
import { verifyToken, } from '../utils/verifyUser.js';

const router = express.Router();
// Public test route
router.get('/test', test);

// Protected routes
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken,deleteUser); 
router.delete('/users/:id', verifyToken,deleteEachUser);
router.put('/users/:id', verifyToken,UpdateRole);
router.get('/listings/:id', verifyToken, getUserListings); 
router.get('/users',verifyToken,getUsers);
router.get('/:id', verifyToken, getUser);
router.get('/total/count',totalUsersCount);


export default router;
