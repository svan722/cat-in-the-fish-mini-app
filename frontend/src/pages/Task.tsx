const Task = () => {
    
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
                                    <span className="text-[12px] leading-none">+ 100,000</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Check now</button>
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
                                    <span className="text-[12px] leading-none">+ 100,000</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Check now</button>
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
                                    <span className="text-[12px] leading-none">+ 100,000</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Complete</button>
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
                                    <span className="text-[12px] leading-none">+ 100,000</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Complete</button>
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#FC0301] flex justify-center items-center">
                                <img src="/imgs/play.svg" alt="" className="w-[16px] h-[16px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Join Youtube channel</div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 100,000</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Complete</button>
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#0C0C0D] flex justify-center items-center">
                                <img src="/imgs/invite-plus.svg" alt="" className="w-[27px] h-[23px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Invite 5 Friends </div>
                                <div className="bg-primary rounded-full w-[94px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/fish.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 100,000</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-primary w-[95px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Complete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Task;