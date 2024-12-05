import User from "../models/user.model.js";
import mongoose from 'mongoose';
import Listing from "../models/listing.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const test =(req,res) => {
    res.json({message:'API is working'});
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };
  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You do not have permission to delete this user!'));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted!');
    } catch (error) {
      next(error);
    }
  };
  export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings );
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  };
  
  export const getUser = async (req, res) => {
    const { id } = req.params;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
  };

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({},'id email role'); // Fetch all users
    res.status(200).send({message: 'Users Found successfully',users});
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};
//get all users count
export const totalUsersCount = async (req, res) => {
  try {
    const users = await User.countDocuments({});
    res.json(users);
  } catch (err) {
    console.error("Error fetching user count:", err);
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};
//delete a User
export const deleteEachUser = async (req, res) => {
try{

  const { id } = req.params;
  const user=await User.findByIdAndDelete(id)
  
  if(!user){
    return res.status(404).send({message: 'User not found'});
  }
  res.status(200).send({message: 'User deleted successfully',user});
}
catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: 'Failed to delete user', error: err });
  }

};
//update a user role
export const UpdateRole = async (req, res) => {
  try{
  
    const { id } = req.params;
    const {role} =req.body;
    const user=await User.findByIdAndUpdate(id, {role}, {new:true} );
    
    if(!user){
      return res.status(404).send({message: 'User not found'});
    }
    res.status(200).send({message: 'User deleted successfully',user});
  }
  catch (err) {
      console.error("Error updating user role:", err);
      res.status(500).json({ message: 'Failed to update user role ', error: err });
    }
  
  };