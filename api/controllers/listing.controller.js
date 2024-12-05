import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Increment Views Controller
export const userViews = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid or missing listing ID' });
    }

    // Find the listing and increment views
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
/*export const dashboardData= async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalReviews = await Review.countDocuments({});
    res.json({ totalListings, totalUsers, totalReviews });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}; */
export const subscribe= async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate data
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to database
    const newSubscription = new Subscription({ name, email, phone });
    await newSubscription.save();

    res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const allListings = async (req, res) => {
  try {
    const listings = await Listing.find(); // Use the correct model name
    res.json(listings); // Respond with the listings
  } catch (err) {
    console.error("Error fetching all listings:", err);
    res.status(500).json({ message: 'Failed to fetch all listings', error: err });
  }
};
export const totalListingsCount = async (req, res) => {
  try {
    const listing = await Listing.countDocuments({});
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing count:", err);
    res.status(500).json({ message: 'Failed to fetch number for all listings', error: err });
  }
};

