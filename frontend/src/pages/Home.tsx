import { useEffect, useState } from "react";
import API from "@/libs/API";
import { Link } from "@/components/Link";
import { useApp } from "@/providers/AppProvider";
import { useInitData } from "@telegram-apps/sdk-react";

const Home = () => {
    const app = useApp();
    const initData  = useInitData();
    const [fish, setFish] = useState(0);
    const [ticket, setTicket] = useState(0);

    useEffect(() => {
        API.get(`/users/get/${initData?.user?.id}`).then(res => {
            setFish(res.data.fish);
            setTicket(res.data.ticket);
        }).catch(console.error);
    }, []);

    return (
        <div className="flex flex-col items-center w-screen h-screen pt-[23px] pb-[29px] px-[17px]">
            <div className="flex items-center gap-[5px] mx-auto">
                <button onClick={app?.toggleMusic} className={`w-[45px] h-[45px] border border-[#C6F0FF85] rounded-full bg-gradient-to-b from-[#38AFE3B0] to-[#1E94D3B0] flex items-center justify-center hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-200 ${ app?.volume === "on" ? 'fill-white' : 'fill-red-400'}`}>
                    <svg width="28" height="27" viewBox="0 0 28 27" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.80451 17.9564C1.81964 17.9564 1.02194 17.1587 1.02194 16.1739C1.02194 14.8476 1.02194 13.0437 1.02194 11.7175C1.02194 10.7326 1.81964 9.93488 2.80451 9.93488H6.36965C6.36965 9.93488 11.3011 3.76272 12.9589 1.6887C13.2976 1.26445 13.811 1.01757 14.3538 1.01847C14.6996 1.01936 15.1096 1.01934 15.5044 1.02023C16.402 1.02112 17.1586 1.68959 17.271 2.57998C18.1827 9.99993 18.1881 17.2835 17.2781 24.4325C17.1613 25.3211 16.4029 25.9843 15.5071 25.9825C15.0891 25.9825 14.655 25.9807 14.2976 25.9798C13.7905 25.9789 13.3074 25.7614 12.9696 25.3817C11.3181 23.5234 6.36965 17.9564 6.36965 17.9564H2.80451Z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.80453 18.8477H5.96948L12.3039 25.9735C12.8092 26.5431 13.5338 26.8693 14.295 26.8711L15.5071 26.8737C16.8485 26.8773 17.9867 25.8817 18.1614 24.5493C18.1614 24.5475 18.1623 24.5457 18.1623 24.5457C19.0821 17.3236 19.0767 9.96607 18.156 2.47125L18.1551 2.46856C17.9867 1.13252 16.8521 0.129828 15.5053 0.128936C15.1105 0.128045 14.7005 0.12806 14.3547 0.127168C13.541 0.126277 12.7709 0.496146 12.2629 1.13163L5.94096 9.04358H2.80453C1.32767 9.04358 0.130676 10.2406 0.130676 11.7174V16.1739C0.130676 17.6507 1.32767 18.8477 2.80453 18.8477ZM2.80453 17.0651C2.31254 17.0651 1.91325 16.6659 1.91325 16.1739C1.91325 14.8476 1.91325 13.0437 1.91325 11.7174C1.91325 11.2254 2.31254 10.8262 2.80453 10.8262H6.36967C6.64062 10.8262 6.89643 10.7031 7.06577 10.491L13.655 2.24487C13.8244 2.03274 14.0811 1.90974 14.3529 1.90974L15.5036 1.91151C15.9519 1.91151 16.3307 2.24576 16.3868 2.69051C17.2888 10.0338 17.2951 17.2425 16.394 24.3175C16.3351 24.7605 15.9563 25.0921 15.5089 25.0912L14.3003 25.0885C14.0463 25.0885 13.8048 24.9798 13.6363 24.7899L7.03546 17.3646C6.867 17.1739 6.62458 17.0651 6.36967 17.0651H2.80453ZM23.7319 6.32961C25.5332 10.9277 25.5332 16.0723 23.7319 20.6704C23.5519 21.1285 23.7782 21.6464 24.2364 21.8255C24.6945 22.0047 25.2123 21.7792 25.3915 21.321C27.3559 16.3049 27.3559 10.6951 25.3915 5.67899C25.2123 5.22087 24.6945 4.99536 24.2364 5.17451C23.7782 5.35366 23.5519 5.87149 23.7319 6.32961Z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.8878 9.21393C21.7181 12.1121 21.7181 15.1981 20.8878 18.0962C20.7531 18.5694 21.0271 19.0635 21.4995 19.199C21.9727 19.3353 22.4668 19.0613 22.6023 18.5874C23.5247 15.3696 23.5247 11.9406 22.6023 8.72277C22.4668 8.24885 21.9727 7.97485 21.4995 8.1111C21.0271 8.24662 20.7531 8.74076 20.8878 9.21393Z" />
                    </svg>
                </button>
                <div className="cursor-pointer w-[235px] h-[63px] rounded-full bg-[#2198C2D4] border border-dotted border-[#A4EBFF] backdrop-blur-sm flex items-center justify-center gap-[13px]">
                    <img className="w-[24px] h-[24px]" src="/imgs/x.svg" alt="" />
                    <div className="text-[16px]">To Earn Coin,Join In<br />Twitter</div>
                </div>
                <Link to="/farm" className="w-[45px] h-[45px] flex items-center justify-center border border-[#C6F0FF85] rounded-full bg-gradient-to-b from-[#38AFE3B0] to-[#1E94D3B0] text-[40px] leading-none rotate-180 font-extrabold hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-200">!</Link>
            </div>
            <div className="flex flex-col justify-around items-center flex-1 mt-[20px] w-full">
                <div className="text-center">
                    <p className="text-[10px]">Your Balance</p>
                    <p className="text-[21px] leading-none font-extrabold">{ fish }</p>
                </div>
                <div className="w-[169px] h-[169px] rounded-full bg-gradient-to-b from-[#BEC1AEA6] to-[#F0DD99A6] flex items-center justify-center">
                    <img className="w-[118px] h-[118px]" src="/imgs/tg-fish.svg" alt="" />
                </div>
                <button className="flex justify-center items-center gap-3 rounded-full bg-primary w-[92px] h-[45px]">
                    <div className="w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center">
                        <img className="w-[13px] h-[6px]" src="/imgs/point.svg" alt="" />
                    </div>
                    <span className="font-bold text-[20px]">{ ticket }</span>
                </button>
                <Link to="/play" className="rounded-[10px] flex justify-center items-center bg-primary border-b-2 box-content border-[#C6F0FF] text-[20px] w-full h-[64px] hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-100">PLAY GAMES</Link>
            </div>
            <div className="w-full h-[79px] flex items-center justify-between px-[49px] rounded-[16px] bg-[#8AA6B799] backdrop-blur-md">
                <Link to="/" className="flex flex-col items-center gap-[4px] fill-primary hover:scale-125 transition-all duration-200">
                    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.9148 21.8968H11.1697V15.1157H16.4895V21.8968H20.7444V11.5246L13.8296 6.29474L6.9148 11.5246V21.8968ZM5.76233 23.0493V10.9484L13.8296 4.85416L21.8969 10.9484V23.0493H15.337V16.2682H12.3222V23.0493H5.76233Z" />
                    </svg>
                    <span className="text-[10px] text-primary leading-none">HOME</span>
                </Link>
                <Link to="/task" className="flex flex-col items-center gap-[4px] group hover:stroke-primary stroke-white transition-all duration-200 hover:scale-125">
                    <svg width="28" height="28" fill="none" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.03363 10.7963C4.03363 6.79379 4.03363 4.79195 5.21491 3.54844C6.39619 2.30493 8.29776 2.30493 12.1009 2.30493H15.5583C19.3614 2.30493 21.263 2.30493 22.4443 3.5496C23.6256 4.7908 23.6256 6.79264 23.6256 10.7952V16.8617C23.6256 20.8643 23.6256 22.8661 22.4443 24.1096C21.263 25.3531 19.3614 25.3543 15.5583 25.3543H12.1009C8.29776 25.3543 6.39619 25.3543 5.21491 24.1096C4.03363 22.8684 4.03363 20.8666 4.03363 16.864V10.7963Z" strokeWidth="1.7287" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.21973 2.30493L9.31423 2.8731C9.54472 4.2526 9.65997 4.94293 10.144 5.35321C10.6257 5.76233 11.3253 5.76233 12.7244 5.76233H14.9337C16.3316 5.76233 17.0311 5.76233 17.5152 5.35321C17.9992 4.94293 18.1145 4.2526 18.3438 2.8731L18.4395 2.30493M9.21973 18.4395H13.8296M9.21973 12.6771H18.4395" strokeWidth="1.7287" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] group-hover:text-primary leading-none transition-all duration-200">TASK</span>
                </Link>
                <Link to="/invite" className="flex flex-col items-center gap-[4px] group hover:fill-primary fill-white transition-all duration-200 hover:scale-125">
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
        </div>
    )
}

export default Home;