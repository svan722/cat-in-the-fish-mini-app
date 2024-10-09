import { Fragment, useState, useRef, useEffect } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useTimer } from "react-use-precision-timer";
import { toast } from "react-toastify";
import { useInitData } from "@telegram-apps/sdk-react";

import { ObjectInfo, ObjectType } from "@/libs/types";
import Fish from "@/components/objects/Fish";
import Snow from "@/components/objects/Snow";
import Bomb from "@/components/objects/Bomb";

import API from "@/libs/API";
import { GAME } from "@/libs/contant";

const Renderer = (props: CountdownRenderProps) => {
    return (
        <span className="font-bold text-[20px]">{ props.minutes.toString().padStart(2, '0') } : { props.seconds.toString().padStart(2, '0') }</span>
    )
}

const Play = () => {
    const initData = useInitData();
    const countdown = useRef<Countdown>(null!);
    const [ticket, setTicket] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [endTime, setEndTime] = useState(Date.now() + GAME.DURATION);
    const claimed = useRef(0);
    const [objects, setObjects] = useState<ObjectInfo[]>([]);

    const [showStartButton, setShowStartButton] = useState(true);
    const [showBombEffect, setShowBombEffect] = useState(false);

    const addObject = () => {
        const random = Math.random();
        let type: ObjectType;
        let callback;
        if (random < 0.85) {
            type = "fish";
            callback = clickFish;
        } else if (random < 0.95) {
            type = "bomb";
            callback = clickBomb;
        } else {
            type = "snow";
            callback = clickSnow;
        }
        const newObject: ObjectInfo = {
            id: Date.now(),
            type: type,
            left: Math.random() * 100,
            status: "falling",
            callback: callback
        }
        setObjects(prev => [...prev, newObject]);
        setTimeout(removeObject, GAME.FALL_TIME + 2 * GAME.FROZEN_TIME, newObject.id);
    }

    const removeObject = (id: number) => {
        setObjects(prev => prev.filter(fish => fish.id !== id));
    }

    const timer = useTimer({ delay: 300, startImmediately: false }, addObject);

    const handleGameOver = () => {
        setPlaying(false);
        timer.stop();
        setTimeout(endGame, GAME.FALL_TIME + GAME.FROZEN_TIME);
    }

    const handleStart = () => {
        API.post('/play/start', { userid: initData?.user?.id })
            .then(res => {
                if (res.data.success) {
                    setTicket(res.data.ticket);
                    startGame();
                } else {
                    toast.error(res.data.msg);
                }
            }).catch(err => {
                console.error(err);
                toast.error(err.message);
            });
    }

    const clickFish = () => {
        claimed.current++;
    }

    const clickBomb = () => {
        setShowBombEffect(true);
        if (claimed.current > 10) claimed.current -= 10;
        else claimed.current = 0;
        setTimeout(setShowBombEffect, 3000, false);
    }

    const clickSnow = () => {
        countdown.current.pause();
        timer.pause();
        setObjects(prev => prev.map(prev => ({ ...prev, status: "stopped" })));
        setTimeout(() => {
            timer.resume();
            countdown.current.start();
            setObjects(prev => prev.map(prev => ({ ...prev, status: "falling" })));
        }, GAME.FROZEN_TIME);
    }

    const startGame = () => {
        setEndTime(Date.now() + GAME.DURATION);
        setPlaying(true);
        setShowStartButton(false);
        countdown.current.start();
        timer.start();
    }

    const endGame = () => {
        console.log('gameover:', claimed.current);
        API.post('/play/fish', { userid: initData?.user?.id, fish: claimed.current })
            .then(res => {
                if (res.data.success) {
                    toast.success(`You got ${ claimed.current } fishes!`);
                    setEndTime(Date.now() + GAME.DURATION);
                    claimed.current = 0;
                    setShowStartButton(true);
                } else {
                    toast.error(res.data.msg);
                }
            }).catch(err => {
                console.error(err);
                toast.error(err.message);
            });
    }

    useEffect(() => {
        API.get(`/users/get/${initData?.user?.id}`).then(res => {
            setTicket(res.data.ticket);
        }).catch(console.error);
    }, []);

    return (
        <Fragment>
            <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
                { showBombEffect && <div className="absolute inset-0 bg-red-500 animate-bomb" /> }
                <div className="absolute z-10 left-[29px] top-[29px] w-[107px] h-[46px] rounded-[10px] bg-primary flex items-center justify-center gap-[4px] border-b-2 border-dotted border-white">
                    <img className={`w-[19px] h-[19px] ${playing ? 'animate-spin' : 'animate-none'}`} src="/imgs/clock.svg" alt="" />
                    <Countdown ref={countdown} date={endTime} onComplete={handleGameOver} renderer={Renderer} autoStart={false} />
                </div>
                <div className="absolute z-10 right-[29px] top-[29px] px-[8px] h-[46px] rounded-[10px] bg-[#FFB200B2] flex items-center justify-center gap-[4px] border-b-2 border-dotted border-white">
                    <img className="w-[21px] h-[21px]" src="/imgs/point.svg" alt="" />
                    <span className="font-bold text-[20px]">{ ticket }</span>
                    <img className="w-[21px] h-[21px]" src="/imgs/fish.png" alt="" />
                    <span className="font-bold text-[20px]">{ claimed.current }</span>
                </div>
                { showStartButton && <div className="z-10 w-[169px] h-[169px] rounded-full bg-gradient-to-b from-[#BEC1AEA6] to-[#F0DD99A6] flex items-center justify-center">
                    <img onClick={handleStart} className="cursor-pointer w-[118px] h-[118px]" src="/imgs/tg-fish.svg" alt="" />
                </div> }
                { objects.map((object, _) => {
                    if (object.type === "fish") return <Fish key={object.id} left={object.left} status={object.status} callback={object.callback} />
                    if (object.type === "bomb") return <Bomb key={object.id} left={object.left} status={object.status} callback={object.callback} />
                    if (object.type === "snow") return <Snow key={object.id} left={object.left} status={object.status} callback={object.callback} />
                }) }
            </div>
        </Fragment>
    )
}

export default Play;