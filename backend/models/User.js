const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../helper/logger');


const UserSchema = new mongoose.Schema({
  userid: { type: String, unique: true, required: [true, 'Please provide telegram id'] },
  username: { type: String, default: '' },
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  inviter: { type: String, default: '' },
  isPremium: { type: Boolean, default: false },

  walletConnected: { type: Boolean, default: false },
  telegramChannelJoined: { type: Boolean, default: false },
  telegramGroupJoined: { type: Boolean, default: false },
  youtubeSubscribed: { type: Boolean, default: false },
  xFollowed: { type: Boolean, default: false },
  xTweet: { type: Boolean, default: false },
  
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  ticket: { type: Number, default: 1 },
  fish: { type: Number, default: 0 },

  totalScore: { type: Number, default: 0 },
  weeklyScore: { type: Number, default: 0 },
  monthlyScore: { type: Number, default: 0 },

  lastRewardDate: { type: Date },
  rewardStreak: { type: Number, default: 0 },

  boosts: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'BoostItem' },
    endTime: { type: Date, default: Date.now },
  }],
});

// Method to add fish with totalScore, weeklyScore, monthlyScore
UserSchema.methods.addFish = async function(value) {
  this.fish += value;
  this.totalScore += value;
  this.weeklyScore += value;
  this.monthlyScore += value;

  return this;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
