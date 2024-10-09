import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import { toast } from "react-toastify";

import { LINK } from "@/libs/contant";
import { Link } from "@/components/Link";
import Button from "@/components/Button";

const Invite = () => {
    const initData = useInitData();
    const utils = useUtils();

    const handleClickInviteLink = () => {
        const link = LINK.TELEGRAM_MINIAPP + '?startapp=' + initData?.user?.id;
        const shareText = 'Join our telegram mini app.';
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
        utils.openTelegramLink(fullUrl);
    }

    const handleInviteLinkCopyButton = () => {
        const link = LINK.TELEGRAM_MINIAPP + '?startapp=' + initData?.user?.id;
        navigator.clipboard.writeText(link)
            .then(() => toast.success('Copied.'))
            .catch();
    }

    return (
        <div className="flex flex-col h-[100vh]">
            <Link to="/farm"><img className="absolute top-[27px] right-[27px] w-[30px] h-[30px] cursor-pointer hover:scale-125 hover:active:scale-100 transition-all duration-200" src="/imgs/info.png" alt="" /></Link>
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-[102px] h-[102px] rounded-full bg-gradient-to-b from-[#BEC1AE94] to-[#F0DD9994] flex items-center justify-center">
                    <img className="w-[71px] h-[71px]" src="/imgs/users.png" alt="" />
                </div>
                <h1 className="text-secondary font-extrabold text-[40px] mt-[16px] leading-none">Invite frens</h1>
                <p className="text-[16px] leading-none">Invite friends, compete and earn more</p>
            </div>
            <div className="rounded-t-[34px] border-t-4 border-white bg-[#8AA6B7B2] h-[356px] backdrop-blur-sm px-[21px] pt-[16px]">
                <h2 className="text-[16px]">How it works</h2>
                <div className="relative text-[14px] ml-[27px] leading-none">
                    <div className="absolute h-[100px] top-[9px] left-[2px] border border-white"></div>
                    <div className="mt-[3px]">
                        <div className="flex items-center gap-2">
                            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
                            <p className="font-thin">Share your invitation link</p>
                        </div>
                        <p className="text-[#BEBEBE] ml-[14px] leading-none">Get a play pass for each fren</p>
                    </div>
                    <div className="mt-[24px]">
                        <div className="flex items-center gap-2">
                            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
                            <p className="font-thin">Your friends join Fish</p>
                        </div>
                        <p className="text-[#BEBEBE] ml-[14px] leading-none">Get a play pass for each fren</p>
                    </div>
                    <div className="mt-[24px]">
                        <div className="flex items-center gap-2">
                            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
                            <div className="flex items-center">
                                <span>1 friends =</span>
                                <div className="ml-[6px] flex gap-[3px] items-center justify-center w-[53px] h-[13px] bg-[#C49F4A] rounded-[3px] border-[0.5px] border-dotted border-[#FFD471]">
                                    <img className="w-[13px] h-[13px]" src="/imgs/fish.png" alt="" />
                                    <span className="text-[11px]">1000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-[40px]">
                    <Button onClick={handleClickInviteLink} width={275} height={48}>Invite a friend</Button>
                    <Button onClick={handleInviteLinkCopyButton} width={52} height={48}>
                        <img className="w-[24px] h-[24px]" src="/imgs/copy.svg" alt="" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Invite;