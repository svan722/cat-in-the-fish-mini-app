const fs = require('fs');
const path = require('path');

const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const Follow = require('../models/Follow');
const BoostItem = require('../models/BoostItem');
const History = require('../models/PayHistory');

const logger = require('../helper/logger');
const { BONUS, TELEGRAM, LEADERBOARD_SHOW_USER_COUNT } = require('../helper/constants');
const { isUserTGJoined } = require('../helper/botHelper');

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
const purchaseItems = async (req, res) => {
  const { userid, type } = req.body;
  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
  }
  if(type === "golden") {
    user.golden ++;
    await user.save();
  }
  if(type === "super") {
    user.super ++;
    await user.save();
  }
  const history = new History({
    user: user._id,
    quantity: type === "super" ? 5 : (type === "golden" ? 1 : 0)
  });
  await history.save();
  return res.status(StatusCodes.OK).json({success: true, golden: user.golden, super: user.super});
}
const useItem = async (req, res) => {
  const { userid, type } = req.body;
  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
  }
  if(type === "golden") {
    user.golden --;
    await user.save();
  }
  if(type === "super") {
    user.super --;
    await user.save();
  }
  return res.status(StatusCodes.OK).json({success: true, golden: user.golden, super: user.super});
}
module.exports = {
    starFishing,
    swapTicket,
    addPlayedFish,
    purchaseItems,
    useItem,
};
