import { useEffect, useState } from "react";
import { useTonWallet, useTonConnectUI, CHAIN } from '@tonconnect/ui-react';
import { useInitData } from "@telegram-apps/sdk-react";
import { toast } from "react-toastify";

import API from "@/libs/API";
import { OWNER_ADDRESS, IS_MAINNET, PRICE } from "@/libs/constants";

const Shop = () => {
    const initData = useInitData();

    const wallet = useTonWallet();
    const [tonConnectUI,] = useTonConnectUI();

    const [ticket, setTicket] = useState(0);
    const [fishes, setFishes] = useState(0);
    const [goldenFishes, setGoldenFishes] = useState(0);
    const [superFishes, setSuperFishes] = useState(0);

    useEffect(() => {
        API.get(`/users/get/${initData?.user?.id}`).then(res => {
            setFishes(res.data.fish);
            setTicket(res.data.ticket);
            setGoldenFishes(res.data.golden);
            setSuperFishes(res.data.super);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (!wallet) return;
        if (tonConnectUI.wallet?.account.chain !== CHAIN.MAINNET) {
            toast.error("Please change your network to mainnet.");
        }
    }, [wallet]);

    const handleSwapClick = (fish: number) => {
        const yes = confirm('Are you sure?');
        if (yes) API.post('/play/swap', { userid: initData?.user?.id, fish })
            .then(res => {
                if (res.data.success) {
                    toast.success('You got tickets.');
                    setTicket(res.data.ticket);
                    setFishes(res.data.fish);
                } else {
                    toast.error(res.data.msg);
                }
            }).catch(err => {
                console.error(err);
                toast.error(err.message);
            });
    }

    const handlePurchase = (type: "golden" | "super") => {
        if (wallet) {
            const amount = type === "super" ? (PRICE.SUPER * Math.pow(10, 9)).toString() : (PRICE.GOLEN * Math.pow(10, 9)).toString();
            tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                network: IS_MAINNET ? CHAIN.MAINNET : CHAIN.TESTNET,
                messages: [
                    {
                        address: OWNER_ADDRESS,
                        amount: amount,
                    }
                ]
            }).then(res => {
                console.log('Transaction success:', res);
                return API.post('users/play/purchase', { userid: initData?.user?.id, type });
            }).then(res => {
                if (res.data.success) {
                    toast.success('Purchased successfully.');
                    if (type === "golden") setGoldenFishes(res.data.golden);
                    if (type === "super") setSuperFishes(res.data.super);
                } else {
                    toast.error(res.data.msg);
                }
            }).catch(err => {
                toast.error('Something went wrong.');
                console.error(err);
            });
        } else {
            tonConnectUI.openModal();
        }
    }

    return (
        <div className="pt-[16px] px-[14px] pb-[20px]">
            <div className="flex items-end justify-around p-3 my-5 border rounded-[10px]">
                <div className="flex flex-col items-center gap-[18px]">
                    <img src="/imgs/ticket.png" alt="" className="w-[48px]" />
                    <span>{ticket}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <img src="/imgs/fish.png" alt="" className="w-[48px] -scale-x-100" />
                    <span>{fishes}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <img className="w-[48px] h-[48px]" src="/imgs/goldfish.png" alt="" />
                    <span>{goldenFishes}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <img className="w-[48px] h-[48px]" src="/imgs/rainbow.png" alt="" />
                    <span>{superFishes}</span>
                </div>
            </div>
            <div className="">
                <h1 className="text-[22px]">Get Items</h1>
                <div className="mt-[10px] flex flex-col gap-[9px]">
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[5px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="flex flex-col items-center gap-px">
                                <img className="w-[48px] h-[48px]" src="/imgs/goldfish.png" alt="" />
                                <span className="text-[10px]">{ PRICE.GOLEN } TON</span>
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Golden Fish</div>
                                <div className="text-[12px]">Auto fishing 10 fish</div>
                            </div>
                        </div>
                        <button onClick={() => handlePurchase("golden")} className="bg-primary w-[120px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">{wallet ? 'Purchase' : 'Connect Wallet'}</button>
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[5px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="flex flex-col items-center">
                                <img className="w-[48px] h-[48px]" src="/imgs/rainbow.png" alt="" />
                                <span className="text-[10px] -mt-px">{ PRICE.SUPER } TON</span>
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Super Fish</div>
                                <div className="text-[12px]">Auto fishing 50 fish</div>
                            </div>
                        </div>
                        <button onClick={() => handlePurchase("super")} className="bg-primary w-[120px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">{wallet ? 'Purchase' : 'Connect Wallet'}</button>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <h1 className="text-[22px]">Get Ticket</h1>
                <div className="mt-[10px] flex flex-col gap-[9px]">
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/fish.png" alt="" className="w-[36px] h-[36px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Get 1 ticket with 20 fish</div>
                                <div className="bg-[#C49F4A] border border-primary rounded-full w-[64px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/pass.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 1</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleSwapClick(20)} className="bg-primary w-[80px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Swap</button>
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/fish.png" alt="" className="w-[36px] h-[36px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Get 3 ticket with 50 fish</div>
                                <div className="bg-[#C49F4A] border border-primary rounded-full w-[64px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/pass.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 3</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleSwapClick(50)} className="bg-primary w-[80px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Swap</button>
                    </div>
                    <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] pl-[20px] py-[15px] pr-[8px] flex justify-between items-center">
                        <div className="flex gap-[10px]">
                            <div className="w-[48px] h-[48px] rounded-[8px] bg-[#2DA9E6] flex justify-center items-center">
                                <img src="/imgs/fish.png" alt="" className="w-[36px] h-[36px]" />
                            </div>
                            <div className="flex flex-col justify-center gap-[6px]">
                                <div className="text-[15px] leading-none">Get 5 ticket with 100 fish</div>
                                <div className="bg-[#C49F4A] border border-primary rounded-full w-[64px] h-[21px] flex justify-center items-center gap-[5px]">
                                    <img src="/imgs/pass.png" alt="" className="w-[19px] h-[19px]" />
                                    <span className="text-[12px] leading-none">+ 5</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleSwapClick(100)} className="bg-primary w-[80px] h-[36px] rounded-[5px] text-[14px] hover:-translate-y-1 hover:drop-shadow-md hover:active:translate-y-0 hover:active:drop-shadow-none transition-all duration-100">Swap</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop;