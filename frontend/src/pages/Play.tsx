import { Fragment, useState, useRef, useEffect } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useTimer } from "react-use-precision-timer";
import { toast } from "react-toastify";
import { useInitData } from "@telegram-apps/sdk-react";
import { useNavigate, useLocation } from "react-router-dom";

import { Level, ObjectInfo, ObjectType } from "@/libs/types";
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
    const location = useLocation();
    const navigate = useNavigate();
    const initData = useInitData();

    const level: Level = location.state.level;
    const claimed = useRef(0);
    const countdown = useRef<Countdown>(null!);

    const [endTime, setEndTime] = useState(Date.now() + GAME[level].DURATION);
    const [objects, setObjects] = useState<ObjectInfo[]>([]);
    const [showBombEffect, setShowBombEffect] = useState(false);
    

    const addObject = () => {
        const random = Math.random();
        let type: ObjectType;
        let callback;
        if (random < 0.87) {
            type = "fish";
            callback = clickFish;
        } else if (random < 0.97) {
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
            fallTime: GAME[level].FALL_TIME,
            callback: callback
        }
        setObjects(prev => [...prev, newObject]);
        setTimeout(removeObject, GAME[level].FALL_TIME + 2 * GAME[level].FROZEN_TIME, newObject.id);
    }

    const removeObject = (id: number) => {
        setObjects(prev => prev.filter(fish => fish.id !== id));
    }

    const timer = useTimer({ delay: GAME[level].FALL_INTERVAL, startImmediately: false }, addObject);

    const handleGameOver = () => {
        timer.stop();
        setTimeout(endGame, GAME[level].FALL_TIME + GAME[level].FROZEN_TIME);
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
        }, GAME[level].FROZEN_TIME);
    }

    const startGame = () => {
        setEndTime(Date.now() + GAME[level].DURATION);
        countdown.current.start();
        timer.start();
    }

    const endGame = () => {
        console.log('gameover:', claimed.current);
        API.post('/play/fish', { userid: initData?.user?.id, fish: claimed.current })
            .then(res => {
                if (res.data.success) {
                    toast.success(`You got ${ claimed.current } fishes!`);
                    navigate('/home');
                    setEndTime(Date.now() + GAME[level].DURATION);
                    claimed.current = 0;
                } else {
                    toast.error(res.data.msg);
                }
            }).catch(err => {
                console.error(err);
                toast.error(err.message);
            });
    }

    useEffect(() => {
        setTimeout(startGame, 3000);
    }, []);

    return (
        <Fragment>
            <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
                { showBombEffect && <div className="absolute inset-0 bg-red-500 animate-bomb" /> }
                <div className="absolute z-10 left-[29px] top-[29px] w-[107px] h-[46px] rounded-[10px] bg-primary flex items-center justify-center gap-[4px] border-b-2 border-dotted border-white">
                    <img className={`w-[19px] h-[19px] ${countdown.current?.isStarted() ? 'animate-spin' : 'animate-none'}`} src="/imgs/clock.svg" alt="" />
                    <Countdown ref={countdown} date={endTime} onComplete={handleGameOver} renderer={Renderer} autoStart={false} />
                </div>
                <div className="absolute z-10 right-[29px] top-[29px] w-[60px] h-[46px] rounded-[10px] bg-primary flex items-center justify-center gap-[4px] border-b-2 border-dotted border-white">
                    <img className="w-[21px] h-[21px]" src="/imgs/fish.png" alt="" />
                    <span className="font-bold text-[20px]">{ claimed.current }</span>
                </div>
                <button className="z-10 absolute w-[66px] h-[68px] top-[82px] right-[24px]">
                    <img className="" src="/imgs/goldfish.png" alt="" />
                </button>
                { objects.map((object, _) => {
                    if (object.type === "fish") return <Fish key={object.id} left={object.left} status={object.status} fallTime={object.fallTime} callback={object.callback} />
                    if (object.type === "bomb") return <Bomb key={object.id} left={object.left} status={object.status} fallTime={object.fallTime} callback={object.callback} />
                    if (object.type === "snow") return <Snow key={object.id} left={object.left} status={object.status} fallTime={object.fallTime} callback={object.callback} />
                }) }
            </div>
        </Fragment>
    )
}

export default Play;