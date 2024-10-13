import { Fragment, useEffect, useState } from "react";
import { useInitData } from "@telegram-apps/sdk-react";

import API from "@/libs/API";
import { LINK } from "@/libs/constants";
import { Link } from "@/components/Link";

const Splash = ({ onClick }: { onClick: () => void }) => {
    const [showJoinChannel, setShowJoinChannel] = useState(false);
    const initData = useInitData();
    useEffect(() => {
        const style = document.body.style.background;
        document.body.style.background = "none";

        API.post('/users/jointg', {
            userid: initData?.user?.id,
            type: 'channel'
        }).then(res => {
            if (res.data.status === "notyet") {
                setShowJoinChannel(true);
            }
        }).catch(console.error);

        return () => {
            document.body.style.background = style;
        }
    }, []);

    const handleModal = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setShowJoinChannel(false);
    }

    return <Fragment>
        <div onClick={onClick} className="absolute cursor-pointer w-screen h-screen bg-[url('/imgs/splash.png')] bg-cover bg-center">
            <h1 className="text-center text-[#F1F3B1] font-extrabold text-[25px] mt-[60vh]">Please tap to continue</h1>
        </div>
        { showJoinChannel && <div onClick={handleModal} className="absolute flex items-center justify-center w-screen h-screen py-2">
            <div className="w-full max-w-[359px] h-[501px] border border-[#FFFFFF91] rounded-[16px] bg-[#8AA6B7B2] backdrop-blur-sm flex flex-col items-center">
                <div className="w-[169px] h-[169px] bg-gradient-to-b from-[#BEC1AE75] to-[#F0DD9975] rounded-full flex justify-center items-center mt-[48px]">
                    <img className="w-[118px] h-[118px]" src="/imgs/telegram.png" alt="" />
                </div>
                <h1 className="mt-[20px] text-[40px] text-secondary font-extrabold leading-none text-center">TELEGRAM CHANNEL</h1>
                <p className="mt-[16px] mb-[20px] text-center text-[16px]">Subscribe to Telegram:<br />To farm bananas and complete tasks</p>
                <Link to={LINK.TELEGRAM_CHANNEL} className="rounded-[10px] flex justify-center items-center bg-primary border-b-2 box-content border-[#C6F0FF] text-[20px] hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-100 outline-none h-12 w-[299px]">Subscribe Telegram Channel</Link>
            </div>
        </div> }
    </Fragment>
}

export default Splash;