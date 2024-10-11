const fs = require('fs');
const path = require('path');

const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const Follow = require('../models/Follow');
const BoostItem = require('../models/BoostItem');
const BoostPurchaseHistory = require('../models/BoostPurchaseHistory');

const logger = require('../helper/logger');
const { BONUS, TELEGRAM, LEADERBOARD_SHOW_USER_COUNT } = require('../helper/constants');
const { isUserTGJoined } = require('../helper/botHelper');

const getUser = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ userid });
  res.status(StatusCodes.OK).json(user);
}

const getAllFriends = async (req, res) => {
  const { userid } = req.params;
  if(!userid) {
    logger.error(`cannot find userid=${userid}`);
    return res.status(StatusCodes.OK).json({});
  }
  const user = await User.findOne({ userid }).populate('friends').select('friends');

  res.status(StatusCodes.OK).json(user);
};

const getAllUserCount = async (req, res) => {
  const userCount = await User.countDocuments();
  res.status(StatusCodes.OK).json({count: userCount});
};

const connectWallet = async (req, res) => {
  const { userid } = req.body;
  var user = await User.findOne({ userid });
  if(user) {
    if(user.walletConnected) {
      return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already received!'});
    }
    user.walletConnected = true;
    const bonus = BONUS.WALLET_CONNECT;
    user.addFish(bonus);

    await user.save();
    return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Received wallet connect bonus', fish: user.fish, bonus: bonus});
  }
  return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no userid!'});
}

const joinTelegram = async (req, res) => {
  const { userid, type } = req.body;
  var user = await User.findOne({ userid });
  if(user) {
    const isDBTGJoined = type == 'channel' ? user.telegramChannelJoined : user.telegramGroupJoined;
    if(isDBTGJoined) {
      return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already received!'});
    }
    const isTGJoined = await isUserTGJoined(userid, type == 'channel' ? TELEGRAM.CHANNEL_ID : TELEGRAM.GROUP_ID);
    if(!isTGJoined) {
      return res.status(StatusCodes.OK).json({success: false, status: 'notyet', msg: `Not joined telegram ${type} yet!`});
    }
    var bonus = 0;
    if(type == 'channel') {
      bonus = BONUS.JOIN_TG_CHANNEL;
      user.telegramChannelJoined = true;
    } else {
      bonus = BONUS.JOIN_TG_GROUP;
      user.telegramGroupJoined = true;
    }
    user.addFish(bonus);

    await user.save();
    return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Received telegram joined bonus', fish: user.fish, bonus: bonus});
  }
  return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no userid!'});
};
const followX = async (req, res) => {
  const { userid, username } = req.body;
  if(!username || username == '') {
    return res.status(StatusCodes.OK).json({success: false, status: 'nousername', msg: 'Please input username!'});
  }
  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no userid!'});
  }

  if(user.xFollowed) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already received!'});
  }

  var follow = await Follow.findOne({ userid, platform: 'X'  });
  if(!follow) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nofollow', msg: 'Not follow yet!'});
  }
  follow.username = username;
  await follow.save();

  user.xFollowed = true;
  user.addFish(BONUS.FOLLOW_X_ACCOUNT);

  await user.save();
  return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Received follow X bonus', fish: user.fish, bonus: BONUS.FOLLOW_X_ACCOUNT});
};

const retweet = async (req, res) => {
  const { userid, username } = req.body;

  if(!username || username == '') {
    return res.status(StatusCodes.OK).json({success: false, status: 'nousername', msg: 'Please input username!'});
  }

  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no userid!'});
  }
  if(user.xTweet) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already received!'});
  }

  var follow = await Follow.findOne({ userid, platform: 'Tweet' });
  if(!follow) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nofollow', msg: 'Not tweet X yet!'});
  }
  follow.username = username;
  await follow.save();

  user.xTweet = true;
  user.addFish(BONUS.RETWEET_POST);

  await user.save();
  return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Received retweet bonus.', fish: user.fish, bonus: BONUS.RETWEET_POST});
};

const subscribe_youtube = async (req, res) => {
  const { userid, username } = req.body;

  if(!username || username == '') {
    return res.status(StatusCodes.OK).json({success: false, status: 'nousername', msg: 'Please input username!'});
  }

  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no userid!'});
  }

  if(user.youtubeSubscribed) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already received!'});
  }

  var follow = await Follow.findOne({ userid, platform: 'YouTube' });
  if(!follow) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nofollow', msg: 'Not subscribe yet!'});
  }
  follow.username = username;
  await follow.save();

  user.youtubeSubscribed = true;
  user.addFish(BONUS.SUBSCRIBE_YOUTUBE);

  await user.save();
  return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'received subscribe youtube bonus', fish: user.fish, bonus: BONUS.SUBSCRIBE_YOUTUBE});
};

const visit_website = async (req, res) => {
  const { userid } = req.body;
  const username = "test";

  if(!username || username == '') {
    return res.status(StatusCodes.OK).json({success: false, status: 'nousername', msg: 'Please input username!'});
  }

  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no userid!'});
  }
  if(user.visitWebSite) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already received!'});
  }

  var follow = await Follow.findOne({ userid, platform: 'Site' });
  if(!follow) {
    follow = await Follow.create({
      userid,
      platform: 'Site'
    });
  }
  follow.username = username;
  await follow.save();

  user.visitWebSite = true;
  user.addFish(BONUS.VISIT_WEBSITE);

  await user.save();
  return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Received visit website bonus', fish: user.fish, bonus: BONUS.VISIT_WEBSITE});
};

const follow_task_do = async (req, res) => {
  const { userid, platform } = req.body;

  var follow = await Follow.findOne({ userid, platform });
  if(follow) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Already followed!'});
  }
  follow = await Follow.create({
    userid,
    platform
  });
  return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Follow success!'});
};

const inviteTask = async (req, res) => {
  const { userid, count } = req.body;

  const user = await User.findOne({ userid });
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Can not find user!' });
  }
  if(user.inviteFive) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'already', msg: 'You have to claim already!' });
  }
  if(count != 5) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'invalid', msg: 'Invalid number!' });
  }
  if(user.friends.length < 5) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'notyet', msg: 'Not yet completed!' });
  }
  user.inviateFive = true;
  user.addFish(BONUS.INVITE_FIVE_FRIENT);
  await user.save();
  return res.status(StatusCodes.OK).json({success: true, status: 'success', msg: 'Invite five friends task Completed!'});
};

const getAvatarImage = (req, res) => {
  const { userid } = req.params;
  const url = path.join(__dirname, '..', 'uploads/avatars', userid + '.jpg');
  const isExist = fs.existsSync(url);
  if (isExist) {
    res.sendFile(url);
  }
  else res.sendFile(path.join(__dirname, '..', 'uploads/avatars', 'default.png'));
}

const claimDailyReward = async (req, res) => {
  const oneDay = 24 * 60 * 60 * 1000;
  try {
    const { userid } = req.body;
    const user = await User.findOne({ userid });

    if (!user) {
      return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Can not find user!' });
    }

    const now = new Date();
    const lastRewardDate = user.lastRewardDate || new Date(0);

    const timeSinceLastReward = now - lastRewardDate;
    
    const isConsecutiveDay = timeSinceLastReward < 2 * oneDay;
    user.rewardStreak = isConsecutiveDay ? (user.rewardStreak + 1) : 1;
    const reward = BONUS.DAILY_REWARD * user.rewardStreak;

    var status = 'notyet';
    if (timeSinceLastReward >= oneDay) {
      user.addFish(reward);
      user.lastRewardDate = now;
      if(req.body.status == 1) {
        await user.save();
        status = 'success';
        console.log('Daily reward claimed successfully');
      }

      return res.status(StatusCodes.OK).json({ 
        success: true,
        status,
        reward,
        ms: req.body.status == 1 ? oneDay : 0,
      });
    } else {
      const ms = oneDay - timeSinceLastReward;
      return res.status(StatusCodes.OK).json({ success: true, ms, status, reward });
    }
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return res.status(StatusCodes.OK).json({ success: false, status: 'error', msg: 'Server unknown error!' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { userid, type } = req.params;
    var users = [];
    const self = await User.findOne({ userid }).select('-password');
    var rank = -1; 
    if (type == "week"){
      users = await User.find({}).sort({ weeklyScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ weeklyScore: { $gt: self.weeklyScore } });
    } else if (type == "month"){
      users = await User.find({}).sort({ monthlyScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ monthlyScore: { $gt: self.monthlyScore } });
    } else if (type == "total"){
      users = await User.find({}).sort({ fish: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ fish: { $gt: self.fish } });
    }
    return res.status(StatusCodes.OK).json({users, rank:rank + 1, self});

  } catch(error){
    console.log("getLeaderboard error=", error);
  }
}

const purchaseBoost = async (req, res) => {
  const { userid, boostid } = req.body;
  const quantity = 1;
  const user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'Not found user!'});
  }
  
  const boostItem = await BoostItem.findOne({boostid});
  if(!boostItem) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noboostitem', msg: 'Not found boost item!'});
  }

  // Create boost purchase history
  const purchaseHistory = new BoostPurchaseHistory({
    user: user._id,
    boostItem: boostItem._id,
    quantity,
  });
  await purchaseHistory.save();

  // Update user boosts
  const boostIndex = user.boosts.findIndex(b => b.item.equals(boostItem._id));
  if (boostIndex !== -1) {
      user.boosts[boostIndex].usesRemaining += quantity;
  } else {
      user.boosts.push({
          item: boostItem._id,
          usesRemaining: quantity,
      });
  }
  await user.save();
  
  return res.status(StatusCodes.OK).json({success: true, msg: 'Purchase boost successfully!'});
}

const useBoost = async (req, res) => {
  const { userid, boostid } = req.body;
  const user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'Not found user!'});
  }

  const boost = user.boosts.find(b => b.item.equals(boostid));
  if (!boost || boost.usesRemaining <= 0) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noboostitem', msg: 'Not found boost item!'});
  }

  // Use the boost
  user.fish += boost.bonus;
  boost.usesRemaining -= 1;
  if (boost.usesRemaining === 0) {
    user.boosts = user.boosts.filter(b => !b.item.equals(boostid));
  }
  await user.save();
  
  return res.status(StatusCodes.OK).json({success: true, msg: 'Use boost successfully!'});
}

const getAllBoost = async (req, res) => {
  const boosts = await BoostItem.find({});
  return res.status(StatusCodes.OK).json({boosts});
}

const addBoost = async (req, res) => {
  const { boostid, title, description, maxUses, price, bonus } = req.body;
  const boostItem = await BoostItem.findOne({boostid});
  if(boostItem) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Boost name already exist!'});
  }
  await BoostItem.create({
    boostid,
    title,
    description,
    maxUses,
    price,
    bonus
  });
  return res.status(StatusCodes.OK).json({status: true, msg: 'Boost add success!'});
}

const getMyBoost = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ userid }).populate('boosts.item');
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'Not found user!'});
  }
  
  return res.status(StatusCodes.OK).json({success: true, boosts: user.boosts});
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
module.exports = {
  getUser,
  getAllFriends,
  getLeaderboard,
  getAllUserCount,
  
  connectWallet,
  joinTelegram,
  followX,
  retweet,
  subscribe_youtube,
  visit_website,
  follow_task_do,
  inviteTask,

  getAvatarImage,

  claimDailyReward,

  purchaseBoost,
  useBoost,
  getAllBoost,
  addBoost,
  getMyBoost,
  getTotalBoostHistory,
};
