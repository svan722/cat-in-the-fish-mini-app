import { useState, useEffect } from 'react';
import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import { useTonWallet, useTonConnectModal } from '@tonconnect/ui-react';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';

import Button from '@/components/Button';
import API from '@/libs/API';
import { LINK, PLATFORM } from '@/libs/constants';
import { Link } from '@/components/Link';

const Task = () => {
    const initData = useInitData();
    const utils = useUtils();
    const wallet = useTonWallet();
    const { open } = useTonConnectModal();

    const [dailyRemainSecond, setDailyRemainSecond] = useState(0);
    // const [isJoinedTelegramGroup, setJoinedTelegramGroup] = useState(false);
    const [isJoinedTelegramChannel, setJoinedTelegramChannel] = useState(false);
    // const [isFollowingYouTube, setFollowingYouTube] = useState(false);
    const [isFollowingX, setFollowingX] = useState(false);
    const [isInviteFive, setInviteFive] = useState(false);
    const [dailyReward, setDailyReward] = useState(1000);
    const [isRetweetX, setRetweetX] = useState(false);
    const [isConnectedWallet, setConnectedWallet] = useState(false);

    const [showRetweetModal, setShowRetweetModal] = useState(false);
    const [showJoinTGChannelModal, setShowJoinTGChannelModal] = useState(false);
    const [showFollowXModal, setShowFollowXModal] = useState(false);

    useEffect(() => {
        API.get(`/users/get/${initData?.user?.id}`).then(res => {
            setFollowingX(res.data.xFollowed);
            setRetweetX(res.data.xTweet);
            // setFollowingYouTube(res.data.youtubeSubscribed);
            setJoinedTelegramChannel(res.data.telegramChannelJoined);
            // setJoinedTelegramGroup(res.data.telegramGroupJoined);
            setInviteFive(res.data.inviteFive);
            setConnectedWallet(res.data.walletConnected);
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

    // const handleJoinTelegramGroup = () => {
    //     API.post('/users/jointg', {
    //         userid: initData?.user?.id,
    //         type: 'group'
    //     }).then(res => {
    //         if(res.data.success) {
    //             setJoinedTelegramGroup(true);
    //             toast.success(res.data.msg);
    //         }
    //         else toast.error(res.data.msg);
    //     }).catch(console.error);
    // }

    const handleJoinTelegramChannel = () => {
        API.post('/users/jointg', {
            userid: initData?.user?.id,
            type: 'channel'
        }).then(res => {
            if (res.data.success) {
                setJoinedTelegramChannel(true);
                toast.success(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    const handleFollowX = () => {
        API.post('/users/followx', { userid: initData?.user?.id, username: initData?.user?.username }).then(res => {
            if (res.data.success) {
                setFollowingX(true);
                toast.success(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    const handleRetweetX = () => {
        API.post('/users/tweet', { userid: initData?.user?.id, username: initData?.user?.username }).then(res => {
            if (res.data.success) {
                setRetweetX(true);
                toast.success(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(err => console.error(err));
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

    // const handleTGGroupLink = () => {
    //     utils.openTelegramLink(LINK.TELEGRAM_GROUP);
    // }

    const handleTGChannelLink = () => {
        utils.openTelegramLink(LINK.TELEGRAM_CHANNEL);
    }

    const handleXLink = () => {
        API.post('/users/follow', { userid: initData?.user?.id, platform: PLATFORM.X }).catch(console.error);
        utils.openLink(LINK.X);
    }

    const handleRetweekLink = () => {
        API.post('/users/follow', { userid: initData?.user?.id, platform: PLATFORM.TWEET }).catch(console.error);
        utils.openLink(LINK.TWEET);
    }

    // const handleYoutubeLink = () => {
    //     API.post('/users/follow', { userid: initData?.user?.id, platform: PLATFORM.YOUTUBE }).catch(console.error);
    //     utils.openLink(LINK.YOUTUBE);
    // }

    const handleInviteFiveFriends = () => {
        API.post('/users/invite/task', { userid: initData?.user?.id, count: 5 }).then(res => {
            if (res.data.success) {
                setInviteFive(true);
            } else {
                toast.error(res.data.msg);
            }
        }).catch(console.error);
    }

    const handleConnectWallet = () => {
        if (isConnectedWallet) return;
        if (wallet) {
            API.post(`/users/connect_wallet`, { userid: initData?.user?.id }).then(res => {
                if (res.data.success) {
                    setConnectedWallet(true);
                    toast.success(res.data.msg);
                } else toast.error(res.data.msg);
            }).catch(console.error)
        } else {
            open();
        }
    }

    return (
        <div className="pt-[16px] px-[14px] pb-[20px]">
            <div className="h-[calc(100vh-135px)] overflow-y-auto">
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
                                        <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
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
                                <div className="w-[48px] h-[48px] rounded-[8px] bg-[#272B2F] flex justify-center items-center">
                                    <img src="/imgs/x-icon.svg" alt="" className="w-[26px] h-[24px]" />
                                </div>
                                <div className="flex flex-col justify-center gap-[6px]">
                                    <div className="text-[15px] leading-none">Retweet our blog</div>
                                    <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                        <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
                                        <span className="text-[12px] leading-none">+ 1000</span>
                                    </div>
                                </div>
                            </div>
                            <button disabled={isRetweetX} onClick={() => setShowRetweetModal(true)} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>
                        </div>
                        {/* <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/tg-icon.svg" alt="" className="w-[26px] h-[21px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Follow TG Chat</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
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
                    </div> */}
                    </div>
                </div>
                <div className="task-list mt-[27px]">
                    <h1 className="text-[17px]">Task List</h1>
                    <div className="mt-[16px] flex flex-col gap-[9px]">
                        <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                            <div className="flex gap-[10px]">
                                <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                    <img src="/imgs/wallet.svg" alt="" className="w-[26px] h-[21px]" />
                                </div>
                                <div className="flex flex-col justify-center gap-[6px]">
                                    <div className="text-[15px] leading-none">Connect Wallet</div>
                                    <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                        <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
                                        <span className="text-[12px] leading-none">+ 1000</span>
                                    </div>
                                </div>
                            </div>
                            <button disabled={isConnectedWallet} onClick={handleConnectWallet} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">{isConnectedWallet ? 'Connected' : (wallet ? 'Redeem' : 'Connect')}</button>
                        </div>
                        <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                            <div className="flex gap-[10px]">
                                <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                    <img src="/imgs/tg-icon.svg" alt="" className="w-[26px] h-[21px]" />
                                </div>
                                <div className="flex flex-col justify-center gap-[6px]">
                                    <div className="text-[15px] leading-none">Join our TG channel</div>
                                    <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                        <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
                                        <span className="text-[12px] leading-none">+ 1000</span>
                                    </div>
                                </div>
                            </div>
                            <button disabled={isJoinedTelegramChannel} onClick={() => setShowJoinTGChannelModal(true)} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>
                        </div>
                        <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                            <div className="flex gap-[10px]">
                                <div className="w-[48px] h-[48px] rounded-[8px] bg-[#272B2F] flex justify-center items-center">
                                    <img src="/imgs/x-icon.svg" alt="" className="w-[26px] h-[24px]" />
                                </div>
                                <div className="flex flex-col justify-center gap-[6px]">
                                    <div className="text-[15px] leading-none">Join Twitter channel</div>
                                    <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                        <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
                                        <span className="text-[12px] leading-none">+ 1000</span>
                                    </div>
                                </div>
                            </div>
                            <button disabled={isFollowingX} onClick={() => setShowFollowXModal(true)} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>
                        </div>
                        {/*<div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#FC0301] flex justify-center items-center">
                                <img src="/imgs/play.svg" alt="" className="w-[16px] h-[16px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Join Youtube channel</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
                                    <span className="text-[12px] leading-none">+ 20</span>
                                </div>
                            </div>
                        </div>
                        <Modal
                            header={<Modal.Header />}
                            trigger={<button disabled={isFollowingYouTube} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>}
                        >
                            <Placeholder
                                header={<span className="text-black dark:text-white">Join Youtube channel</span>}
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
                                        <img src="/imgs/coin.png" alt="" className="w-[15px] h-[15px]" />
                                        <span className="text-[12px] leading-none">+ 5,000</span>
                                    </div>
                                </div>
                            </div>
                            <button disabled={isInviteFive} onClick={handleInviteFiveFriends} className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:drop-shadow-none disabled:bg-white disabled:text-primary">Complete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[20px] w-full h-[79px] grid grid-cols-4 items-center justify-center px-[20px] rounded-[16px] bg-[#8AA6B799] backdrop-blur-md">
                <Link to="/" className="flex flex-col items-center gap-[4px] group hover:stroke-primary stroke-white transition-all duration-200 hover:scale-125 hover:active:scale-100">
                    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.9148 21.8968H11.1697V15.1157H16.4895V21.8968H20.7444V11.5246L13.8296 6.29474L6.9148 11.5246V21.8968ZM5.76233 23.0493V10.9484L13.8296 4.85416L21.8969 10.9484V23.0493H15.337V16.2682H12.3222V23.0493H5.76233Z" />
                    </svg>
                    <span className="text-[10px] group-hover:text-primary leading-none transition-all duration-200">HOME</span>
                </Link>
                <Link to="/task" className="flex flex-col items-center gap-[4px] group stroke-primary transition-all duration-200 hover:scale-125 hover:active:scale-100">
                    <svg width="28" height="28" fill="none" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.03363 10.7963C4.03363 6.79379 4.03363 4.79195 5.21491 3.54844C6.39619 2.30493 8.29776 2.30493 12.1009 2.30493H15.5583C19.3614 2.30493 21.263 2.30493 22.4443 3.5496C23.6256 4.7908 23.6256 6.79264 23.6256 10.7952V16.8617C23.6256 20.8643 23.6256 22.8661 22.4443 24.1096C21.263 25.3531 19.3614 25.3543 15.5583 25.3543H12.1009C8.29776 25.3543 6.39619 25.3543 5.21491 24.1096C4.03363 22.8684 4.03363 20.8666 4.03363 16.864V10.7963Z" strokeWidth="1.7287" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.21973 2.30493L9.31423 2.8731C9.54472 4.2526 9.65997 4.94293 10.144 5.35321C10.6257 5.76233 11.3253 5.76233 12.7244 5.76233H14.9337C16.3316 5.76233 17.0311 5.76233 17.5152 5.35321C17.9992 4.94293 18.1145 4.2526 18.3438 2.8731L18.4395 2.30493M9.21973 18.4395H13.8296M9.21973 12.6771H18.4395" strokeWidth="1.7287" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] text-primary leading-none transition-all duration-200">TASK</span>
                </Link>
                <Link to="/leaderboard" className="flex flex-col items-center gap-[4px] group hover:fill-primary fill-white transition-all duration-200 hover:scale-125 hover:active:scale-100">
                    <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="27px" width="27px" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z"></path>
                    </svg>
                    <span className="text-[10px] group-hover:text-primary text-white leading-none">LEADERBOARD</span>
                </Link>
                <Link to="/invite" className="flex flex-col items-center gap-[4px] group hover:fill-primary fill-white transition-all duration-200 hover:scale-125 hover:active:scale-100">
                    <svg width="27" height="27" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2_358)">
                            <path d="M20.3733 19.88H20.2051C20.0066 18.9137 19.6572 18.0249 19.1567 17.2138C18.6563 16.4028 18.048 15.7039 17.3318 15.1171C16.6156 14.5304 15.8089 14.0731 14.9115 13.7452C14.0141 13.4173 13.0736 13.2534 12.09 13.2534C11.3307 13.2534 10.5973 13.3526 9.88972 13.551C9.18218 13.7495 8.5221 14.0256 7.90948 14.3794C7.29686 14.7331 6.74032 15.1646 6.23987 15.6737C5.73942 16.1827 5.30799 16.7436 4.94559 17.3562C4.5832 17.9688 4.30277 18.6289 4.10432 19.3365C3.90586 20.044 3.80663 20.7774 3.80663 21.5367H2.14996C2.14996 20.5013 2.30096 19.5047 2.60296 18.5469C2.90496 17.5892 3.3407 16.7048 3.91018 15.8937C4.47966 15.0826 5.15268 14.3621 5.92924 13.7322C6.70581 13.1024 7.58591 12.6062 8.56956 12.2438C7.59454 11.6053 6.83523 10.8029 6.29164 9.83648C5.74804 8.87009 5.47193 7.80016 5.4633 6.62668C5.4633 5.71206 5.63587 4.85353 5.98101 4.05108C6.32615 3.24863 6.79641 2.54541 7.39177 1.94141C7.98714 1.33742 8.69036 0.862849 9.50144 0.517709C10.3125 0.17257 11.1754 0 12.09 0C13.0046 0 13.8631 0.17257 14.6656 0.517709C15.468 0.862849 16.1713 1.3331 16.7753 1.92847C17.3793 2.52383 17.8538 3.22706 18.199 4.03813C18.5441 4.84921 18.7167 5.71206 18.7167 6.62668C18.7167 7.19616 18.6476 7.7527 18.5096 8.2963C18.3715 8.83989 18.1644 9.35328 17.8883 9.83648C17.6122 10.3197 17.2887 10.764 16.9176 11.1696C16.5466 11.5751 16.1109 11.9332 15.6104 12.2438C16.5768 12.6149 17.4655 13.1239 18.2766 13.7711C19.0877 14.4182 19.7866 15.1775 20.3733 16.049V19.88ZM7.11997 6.62668C7.11997 7.31696 7.2494 7.95978 7.50826 8.55515C7.76711 9.15052 8.12088 9.67685 8.56956 10.1342C9.01824 10.5915 9.54458 10.9496 10.1486 11.2084C10.7526 11.4673 11.3997 11.5967 12.09 11.5967C12.7716 11.5967 13.4145 11.4673 14.0185 11.2084C14.6224 10.9496 15.1488 10.5958 15.5975 10.1471C16.0461 9.69843 16.4042 9.17209 16.6717 8.56809C16.9392 7.9641 17.0686 7.31696 17.06 6.62668C17.06 5.94503 16.9306 5.30221 16.6717 4.69821C16.4129 4.09422 16.0591 3.56788 15.6104 3.1192C15.1617 2.67052 14.6311 2.31244 14.0185 2.04495C13.4058 1.77747 12.763 1.64804 12.09 1.65667C11.3997 1.65667 10.7569 1.7861 10.1615 2.04495C9.56615 2.30381 9.03981 2.65758 8.5825 3.10626C8.12519 3.55494 7.76711 4.08559 7.50826 4.69821C7.2494 5.31084 7.11997 5.95366 7.11997 6.62668ZM23.6867 21.5367H27V23.1934H23.6867V26.5067H22.03V23.1934H18.7167V21.5367H22.03V18.2234H23.6867V21.5367Z" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2_358">
                                <rect width="26.5067" height="26.5067" transform="translate(0.493286)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span className="text-[10px] group-hover:text-primary leading-none transition-all duration-200">FRIEND</span>
                </Link>
            </div>
            { showRetweetModal && <div onClick={() => setShowRetweetModal(false)} className="fixed inset-0 z-10 flex items-center justify-center w-screen h-screen backdrop-blur-md">
                <div onClick={e => e.stopPropagation()} className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] px-[17px] py-[19px] w-[300px] h-[180px] flex flex-col justify-between">
                    <div className="leading-tight">
                        <h1 className="font-semibold text-[24px] text-center">Retweet our blog</h1>
                    </div>
                    <Button onClick={handleRetweekLink} height={36}>RETWEET</Button>
                    <Button onClick={handleRetweetX} height={36}>COMPLETE</Button>
                </div>
            </div> }
            { showJoinTGChannelModal && <div onClick={() => setShowJoinTGChannelModal(false)} className="fixed inset-0 z-10 flex items-center justify-center w-screen h-screen backdrop-blur-md">
                <div onClick={e => e.stopPropagation()} className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] px-[17px] py-[19px] w-[300px] h-[180px] flex flex-col justify-between">
                    <div className="leading-tight">
                        <h1 className="font-semibold text-[24px] text-center">Join our TG channel</h1>
                    </div>
                    <Button onClick={handleTGChannelLink} height={36}>JOIN</Button>
                    <Button onClick={handleJoinTelegramChannel} height={36}>COMPLETE</Button>
                </div>
            </div> }
            { showFollowXModal && <div onClick={() => setShowFollowXModal(false)} className="fixed inset-0 z-10 flex items-center justify-center w-screen h-screen backdrop-blur-md">
                <div onClick={e => e.stopPropagation()} className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] px-[17px] py-[19px] w-[300px] h-[180px] flex flex-col justify-between">
                    <div className="leading-tight">
                        <h1 className="font-semibold text-[24px] text-center">Join Twitter channel</h1>
                    </div>
                    <Button onClick={handleXLink} height={36}>JOIN</Button>
                    <Button onClick={handleFollowX} height={36}>COMPLETE</Button>
                </div>
            </div> }
        </div>
    )
}

export default Task;