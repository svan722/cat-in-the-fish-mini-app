const User = require('../models/User');
const logger = require('../helper/logger');
const { createJWT } = require('../utils/jwt');
const { BONUS } = require('../helper/constants');

const login = async (userid, username, firstname, lastname, is_premium, inviter) => {
    logger.info(`authlogin userid=${userid}, username=${username}, firstname=${firstname}, lastname=${lastname}, inviter=${inviter}, premium=${is_premium}`);
  
    if (!userid) {
      logger.error('authlogin not found userid');
      return {success: false, msg: 'failed'};
    }
  
    var user = await User.findOne({ userid });
    if (!user) {
      user = await User.create({
        userid,
        username,
        firstname, lastname,
        isPremim: is_premium,
        inviter,
      });
      if(inviter && inviter != '') {
        var inviteUser = await User.findOne({userid: inviter});
        if(inviteUser && !inviteUser.friends.includes(user._id)) {
          logger.info('inviter bonus start')
          inviteUser.friends.push(user._id);

          const calcInviteBonus = (count, is_premium) => {
            var value = is_premium ? BONUS.INVITE_FRIEND_WITH_PREMIUM : BONUS.INVITE_FRIEND;
            if(count < 10) {
                value *= 1;
            } else if(count < 100) {
                value *= 1.3;
            } else if(count < 500) {
                value *= 1.5;
            } else if(count < 1000) {
                value *= 1.8;
            } else {
                value *= 2;
            }
            return Math.floor(value);
          };
          
          const inviteBonus = calcInviteBonus(inviteUser.friends.length, is_premium);
          inviteUser.addOnion(inviteBonus);
          await inviteUser.save();
        }
      }
    }
    const token = createJWT({ payload: { userid, username } });
    return {success: true, token, msg: 'login success'};
};

module.exports = login;