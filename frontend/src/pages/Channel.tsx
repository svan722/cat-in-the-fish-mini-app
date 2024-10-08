import Button from "@/components/Button";

const Channel = () => {
    return (
        <div className="flex items-center justify-center w-screen h-screen py-2">
            <div className="w-full max-w-[359px] h-[501px] border border-[#FFFFFF91] rounded-[16px] bg-[#8AA6B7B2] backdrop-blur-sm flex flex-col items-center">
                <div className="w-[169px] h-[169px] bg-gradient-to-b from-[#BEC1AE75] to-[#F0DD9975] rounded-full flex justify-center items-center mt-[48px]">
                    <img className="w-[118px] h-[118px]" src="/imgs/telegram.png" alt="" />
                </div>
                <h1 className="mt-[20px] text-[40px] text-secondary font-extrabold leading-none text-center">TELEGRAM CHANNEL</h1>
                <p className="mt-[16px] mb-[20px] text-center text-[16px]">Subscribe to Telegram:<br />To farm bananas and complete tasks</p>
                <Button width={299} height={48}>Subscribe Telegram Channel</Button>
            </div>
        </div>
    )
}

export default Channel;