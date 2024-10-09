import { Link } from "@/components/Link";

const Farm = () => {
    return (
        <div className="w-screen h-screen flex items-end p-[15px] pb-[65px]">
            <div className="w-full max-w-[359px] h-[501px] pt-[48px] border border-[#FFFFFF91] rounded-[16px] bg-[#8AA6B7B2] backdrop-blur-sm flex flex-col items-center">
                <div className="w-[169px] h-[169px] rounded-full bg-[#FFFFFF85] flex items-center justify-center">
                    <img className="w-[118px] h-[118px]" src="/imgs/tg-fish.svg" alt="" />
                </div>
                <h1 className="mt-[20px] text-[40px] text-secondary font-extrabold leading-none text-center">FARM FISH</h1>
                <p className="mt-[16px] text-center text-[16px] leading-none">At the end of each season, a percentage of<br />the token supply will be distributed<br />among all players</p>
                <div className="flex justify-center items-center mt-[32px] gap-[4px] mb-[20px]">
                    <button className="flex items-center justify-center gap-[6px] w-[112px] h-[30px] rounded-[10px] border border-dotted border-[#FFDC8D] bg-[#C49F4A]">
                        <img className="w-[21px] h-[21px]" src="/imgs/fish.png" alt="" />
                        <span className="text-[10px] leading-none">Fish x Player</span>
                    </button>
                    <img className="w-[17px] h-[17px]" src="/imgs/equal.svg" alt="" />
                    <button className="flex items-center justify-center gap-[6px] w-[84px] h-[30px] rounded-[10px] border border-dotted border-[#73E3FC] bg-[#07A5FF]">
                        <img className="w-[19px] h-[17px]" src="/imgs/pause.png" alt="" />
                        <span className="text-[10px] leading-none">% PUSS</span>
                    </button>
                </div>
                <Link to="/" className="rounded-[10px] flex justify-center items-center bg-primary border-b-2 box-content border-[#C6F0FF] text-[20px] hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-100 outline-none w-[299px] h-[48px]">BACK</Link>
            </div>
        </div>
    )
}

export default Farm;