import { useState, useEffect, Fragment } from 'react';
import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';

import { Modal, Placeholder, Button } from '@telegram-apps/telegram-ui';
import API from '@/libs/API';
import { LINK, PLATFORM } from '@/libs/constants';

const Task = () => {
    const initData = useInitData();
    const utils = useUtils();

    const [dailyRemainSecond, setDailyRemainSecond] = useState(0);
    const [isJoinedTelegramGroup, setJoinedTelegramGroup] = useState(false);
    const [isJoinedTelegramChannel, setJoinedTelegramChannel] = useState(false);
    // const [isFollowingYouTube, setFollowingYouTube] = useState(false);
    const [isFollowingX, setFollowingX] = useState(false);
    const [isInviteFive, setInviteFive] = useState(false);
    const [dailyReward, setDailyReward] = useState(100);

    useEffect(() => {
        API.get(`/users/get/${initData?.user?.id}`).then(res => {
            setFollowingX(res.data.xFollowed);
            // setFollowingYouTube(res.data.youtubeSubscribed);
            setJoinedTelegramChannel(res.data.telegramChannelJoined);
            setJoinedTelegramGroup(res.data.telegramGroupJoined);
            setInviteFive(res.data.inviteFive);
        }).catch(console.error);
        handleClaimDailyReward();
    }, [initData]);

    const handleClaimDailyReward = (status = 0) => {
        API.post(`/users/claim/daily`, { userid: initData?.user?.id, status }).then(res => {
            if (res.data.success) {
                setDailyRemainSecond(res.data.ms);
                setDailyReward(res.data.reward);
                if (res.data.status == 'success') {
                    toast.success('Claimed successfully.');
                }
            } else {
                toast.error(res.data.msg);
            }
        }).catch(console.error);
    }

    const handleJoinTelegramGroup = () => {
        API.post('/users/jointg', {
            userid: initData?.user?.id,
            type: 'group'
        }).then(res => {
            if(res.data.success) {
                setJoinedTelegramGroup(true);
                // setOpenGroupModal(false);
                toast.success(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    const handleJoinTelegramChannel = () => {
        API.post('/users/jointg', {
            userid: initData?.user?.id,
            type: 'channel'
        }).then(res => {
            if(res.data.success) {
                setJoinedTelegramChannel(true);
                // setOpenChannelModal(false);
                toast.success(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    const handleFollowX = () => {
        API.post('/users/followx', { userid:initData?.user?.id, username: initData?.user?.username }).then(res => {
            if(res.data.success) {
                setFollowingX(true);
                // setOpenFollowXModal(false);
                toast.success(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    // const handleFollowYoutube = () => {
    //     API.post('/users/subscribe_youtube', { userid:initData?.user?.id, username: initData?.user?.username }).then(res => {
    //         if(res.data.success) {
    //             setFollowingYouTube(true);
    //             // setOpenRetweetXModal(false);
    //             toast.success(res.data.msg);
    //         }
    //         else toast.error(res.data.msg);
    //     }).catch(console.error);
    // }

    const handleTGGroupLink = () => {
        utils.openTelegramLink(LINK.TELEGRAM_GROUP);
    }

    const handleTGChannelLink = () => {
        utils.openTelegramLink(LINK.TELEGRAM_CHANNEL);
    }

    const handleXLink = () => {
        API.post('/users/follow', { userid: initData?.user?.id, platform: PLATFORM.X }).catch(console.error);
        utils.openLink(LINK.X);
    }

    // const handleYoutubeLink = () => {
    //     API.post('/users/follow', { userid: initData?.user?.id, platform: PLATFORM.YOUTUBE }).catch(console.error);
    //     utils.openLink(LINK.YOUTUBE);
    // }

    const handleInviteFiveFriends = () => {
        API.post('/users/invite/task', { userid: initData?.user?.id, count: 5 }).then(res => {
            if(res.data.success) {
                setInviteFive(true);
            } else {
                toast.error(res.data.msg);
            }
        }).catch(console.error);
    }

    return (
        <div className="pt-[16px] px-[14px] pb-[20px]">
            <div className="daily-task">
                <h1 className="text-[17px]">Daily Tasks</h1>
                <div className="mt-[16px] flex flex-col gap-[9px]">
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/medal.png" alt="" className="w-[48px] h-[48px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Daily reward</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ {dailyReward}</span>
                                </div>
                            </div>
                        </div>
                        {
                            dailyRemainSecond > 0 ?
                                <button className="w-[95px] h-[36px] rounded-[5px] text-[14px] cursor-not-allowed bg-white text-primary">
                                    <Countdown date={Date.now() + dailyRemainSecond} intervalDelay={1000} precision={3} onComplete={() => setDailyRemainSecond(0)} renderer={(props) => <span className="text-primary">{props.hours.toString().padStart(2, '0')} : {props.minutes.toString().padStart(2, '0')} : {props.seconds.toString().padStart(2, '0')}</span>} />
                                </button> :
                                <button onClick={() => handleClaimDailyReward(1)} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Check now</button>
                        }
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/tg-icon.svg" alt="" className="w-[26px] h-[21px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Follow TG Chat</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 250</span>
                                </div>
                            </div>
                        </div>
                        <Modal
                            header={<Modal.Header />}
                            trigger={<button disabled={isJoinedTelegramGroup} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>}
                        >
                            <Placeholder
                                header="Follow TG Chat"
                                action={
                                    <Fragment>
                                        <Button onClick={handleTGGroupLink} size="m" stretched>Follow</Button>
                                        <Button onClick={handleJoinTelegramGroup} size="m" stretched>Check now</Button>
                                    </Fragment>
                                }
                            />
                        </Modal>
                    </div>
                </div>
            </div>
            <div className="task-list mt-[27px]">
                <h1 className="text-[17px]">Task List</h1>
                <div className="mt-[16px] flex flex-col gap-[9px]">
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/tg-icon.svg" alt="" className="w-[26px] h-[21px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Join our TG channel</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 300</span>
                                </div>
                            </div>
                        </div>
                        <Modal
                            header={<Modal.Header />}
                            trigger={<button disabled={isJoinedTelegramChannel} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>}
                        >
                            <Placeholder
                                header="Join our TG channel"
                                action={
                                    <Fragment>
                                        <Button onClick={handleTGChannelLink} size="m" stretched>Join</Button>
                                        <Button onClick={handleJoinTelegramChannel} size="m" stretched>Complete</Button>
                                    </Fragment>
                                }
                            />
                        </Modal>
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#272B2F] flex justify-center items-center">
                                <img src="/imgs/x-icon.svg" alt="" className="w-[26px] h-[24px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Join Twitter channel</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 300</span>
                                </div>
                            </div>
                        </div>
                        <Modal
                            header={<Modal.Header />}
                            trigger={<button disabled={isFollowingX} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>}
                        >
                            <Placeholder
                                header="Join Twitter channel"
                                action={
                                    <Fragment>
                                        <Button onClick={handleXLink} size="m" stretched>Join</Button>
                                        <Button onClick={handleFollowX} size="m" stretched>Complete</Button>
                                    </Fragment>
                                }
                            />
                        </Modal>
                    </div>
                    {/*<div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#FC0301] flex justify-center items-center">
                                <img src="/imgs/play.svg" alt="" className="w-[16px] h-[16px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Join Youtube channel</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 20</span>
                                </div>
                            </div>
                        </div>
                        <Modal
                            header={<Modal.Header />}
                            trigger={<button disabled={isFollowingYouTube} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>}
                        >
                            <Placeholder
                                header="Join Youtube channel"
                                action={
                                    <Fragment>
                                        <Button onClick={handleYoutubeLink} size="m" stretched>Join</Button>
                                        <Button onClick={handleFollowYoutube} size="m" stretched>Complete</Button>
                                    </Fragment>
                                }
                            />
                        </Modal>
                    </div>*/}
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#0C0C0D] flex justify-center items-center">
                                <img src="/imgs/invite-plus.svg" alt="" className="w-[27px] h-[23px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Invite 5 Friends </div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 5,000</span>
                                </div>
                            </div>
                        </div>
                        <button disabled={isInviteFive} onClick={handleInviteFiveFriends} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Task;