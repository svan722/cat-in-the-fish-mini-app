const fs = require('fs');
const path = require('path');

const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const Follow = require('../models/Follow');
const BoostItem = require('../models/BoostItem');

const logger = require('../helper/logger');
const { BONUS, TELEGRAM, LEADERBOARD_SHOW_USER_COUNT } = require('../helper/constants');
const { isUserTGJoined, createInvoiceLink } = require('../helper/botHelper');

const starFishing = async (req, res) => {
  const { userid } = req.body;
  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
  }
  if(user.ticket <= 0) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noticket', msg: 'There is no ticket!'});
  }
  user.ticket -= 1;
  await user.save();
  return res.status(StatusCodes.OK).json({success: true, ticket: user.ticket});
}

const swapTicket = async (req, res) => {
    const { userid, fish } = req.body;
    var user = await User.findOne({ userid });
    if(!user) {
      return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
    }
    if(fish == 20) {
        user.ticket += 1;
    } else if(fish == 50) {
        user.ticket += 3;
    } else if(fish == 100) {
        user.ticket += 5;
    } else {
        return res.status(StatusCodes.OK).json({success: false, status: 'invalid', msg: 'Invalid fish count!'});
    }
    if(user.fish < fish) {
        return res.status(StatusCodes.OK).json({success: false, status: 'nofish', msg: 'There are not enough fish!'});
    }
    user.addFish(-fish);
    await user.save();
    return res.status(StatusCodes.OK).json({success: true, ticket: user.ticket, fish: user.fish});
}
const addPlayedFish = async (req, res) => {
    const { userid, fish } = req.body;
    var user = await User.findOne({ userid });
    if(!user) {
      return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
    }
    user.addFish(fish);
    await user.save();
    return res.status(StatusCodes.OK).json({success: true, ticket: user.ticket, fish: user.fish});
}

//boost
const useBoost = async (req, res) => {
  const { userid, boostid } = req.body;
  var user = await User.findOne({ userid }).populate('boosts.item');
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'Not found user!'});
  }

  const boost = user.boosts.find(b => b.item.boostid == boostid);
  if (!boost || boost.usesRemaining <= 0) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noboostitem', msg: 'Not found boost item!'});
  }

  boost.usesRemaining -= 1;
  if (boost.usesRemaining === 0) {
    user.boosts = user.boosts.filter(b => b.item.boostid != boostid);
  }
  await user.save();
  
  return res.status(StatusCodes.OK).json({success: true, msg: 'Use boost successfully!'});
}
const getAllBoost = async (req, res) => {
  const boosts = await BoostItem.find({});
  return res.status(StatusCodes.OK).json({boosts});
}
const addBoost = async (req, res) => {
  const { boostid, title, description, logo, maxUses, price, bonus } = req.body;
  const boostItem = await BoostItem.findOne({boostid});
  if(boostItem) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Boost name already exist!'});
  }
  await BoostItem.create({
    boostid,
    title,
    description,
    logo,
    maxUses,
    price,
    bonus
  });
  return res.status(StatusCodes.OK).json({status: true, msg: 'Boost add success!'});
}
const getTotalBoostHistory = async (req, res) => {
  const result = await BoostPurchaseHistory.aggregate([
    {
      $lookup: {
        from: 'boostitems', // The name of the BoostItem collection
        localField: 'boostItem',
        foreignField: '_id',
        as: 'boostDetails',
      },
    },
    {
      $unwind: '$boostDetails', // Unwind to access boost details
    },
    {
      $group: {
        _id: null,
        totalUniqueUsers: { $addToSet: '$user' }, // Collect unique users
        totalPrice: { $sum: { $multiply: ['$quantity', '$boostDetails.price'] } }, // Calculate total price
      },
    },
    {
      $project: {
        _id: 0,
        totalUniqueUsers: { $size: '$totalUniqueUsers' }, // Count unique users
        totalPrice: 1, // Include total price
      },
    },
  ]);
  return res.status(StatusCodes.OK).json({success: true, result});
}
//star invoice
const generateInvoice = async(req, res) => {
  const {userid, boostid} = req.body;
  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
  }
  const boost = await BoostItem.findOne({boostid});
  if(!boost) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noboost', msg: 'There is no boost item!'});
  }

  const payload = { userid: user._id, boostid: boost._id };
  const invoiceLink = await createInvoiceLink(boost.title, boost.description, JSON.stringify(payload), boost.price);
  console.log("invoiceLink=", invoiceLink);
  return res.status(StatusCodes.OK).json({success: true, link: invoiceLink});
}
module.exports = {
    starFishing,
    swapTicket,
    addPlayedFish,

    useBoost,
    getAllBoost,
    addBoost,
    getTotalBoostHistory,

    generateInvoice,
};
