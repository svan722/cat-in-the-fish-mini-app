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
import { GAME } from "@/libs/constants";

import { Howl } from "howler";

const Renderer = (props: CountdownRenderProps) => {
    return (
        <span className="font-bold text-[20px]">{ props.minutes.toString().padStart(2, '0') } : { props.seconds.toString().padStart(2, '0') }</span>
    )
}

const Play = () => {
    const superSound = new Howl({ src: ['/mp3/super.mp3'] });
    const goldSound = new Howl({ src: ['/mp3/gold.mp3'] });
    const snowSound = new Howl({ src: ['/mp3/freeze.mp3'] });
    const location = useLocation();
    const navigate = useNavigate();
    const initData = useInitData();

    const level: Level = location.state.level;
    const claimed = useRef(0);
    const countdown = useRef<Countdown>(null!);

    const [endTime, setEndTime] = useState(Date.now() + GAME[level].DURATION);
    const [objects, setObjects] = useState<ObjectInfo[]>([]);
    const [showBombEffect, setShowBombEffect] = useState(false);
    const [showGoldEffect, setShowGoldEffect] = useState(false);
    const [showSuperEffect, setShowSuperEffect] = useState(false);

    const [goldenFish, setGoldenFish] = useState(false);
    const [superFish, setSuperFish] = useState(false);
    const [usedGolden, setUsedGolden] = useState(0);
    const [usedSuper, setUsedSuper] = useState(false);

    const [counter, setCounter] = useState('3');

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
        claimed.current += GAME[level].FISH;
    }

    const clickBomb = () => {
        setShowBombEffect(true);
        if (claimed.current > 10) claimed.current -= 10;
        else claimed.current = 0;
        setTimeout(setShowBombEffect, 3000, false);
    }

    const clickSnow = () => {
        snowSound.play(); 
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

    const handleGoldenFish = () => {
        goldSound.play();
        countdown.current.pause();
        timer.pause();
        setObjects([]);
        claimed.current += 10;
        setShowGoldEffect(true);
        setUsedGolden(prev => prev + 1);
        setTimeout(() => {
            setShowGoldEffect(false);
            timer.resume();
            countdown.current.start();
        }, 3000);

        API.post('/play/useitem', { userid: initData?.user?.id, type: "super" }).catch(console.error);
    }

    const handleSuperFish = () => {
        superSound.play();
        countdown.current.pause();
        timer.pause();
        setObjects([]);
        claimed.current += 50;
        setShowSuperEffect(true);
        setUsedSuper(true);
        setTimeout(() => {
            setShowSuperEffect(false);
            timer.resume();
            countdown.current.start();
        }, 3000);

        API.post('/play/useitem', { userid: initData?.user?.id, type: "super" }).catch(console.error);
    }

    useEffect(() => {
        API.get(`/users/get/${initData?.user?.id}`).then(res => {
            setGoldenFish(!!res.data.golden);
            setSuperFish(!!res.data.super);
        }).catch(console.error);
        
        setTimeout(() => {
            setCounter('2');
            setTimeout(() => {
                setCounter('1');
                setTimeout(() => {
                    setCounter('GO!');
                    setTimeout(() => {
                        setCounter('');
                        startGame();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
        // setTimeout(startGame, 3000);
    }, []);

    return (
        <Fragment>
            <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
                { counter && <div className="absolute inset-0 flex items-center justify-center font-bold text-[150px]">{ counter }</div> }
                { showBombEffect && <div className="absolute inset-0 bg-red-500 animate-bomb" /> }
                { showGoldEffect && <div className="absolute inset-0 z-50 bg-yellow-500 animate-bomb" /> }
                { showSuperEffect && <div className="absolute inset-0 z-50 [background:conic-gradient(red,yellow,green,cyan,blue,magenta,red)] animate-bomb" /> }
                <div className="absolute z-10 left-[29px] top-[29px] w-[107px] h-[46px] rounded-[10px] bg-primary flex items-center justify-center gap-[4px] border-b-2 border-dotted border-white">
                    <img className={`w-[19px] h-[19px] ${countdown.current?.isStarted() ? 'animate-spin' : 'animate-none'}`} src="/imgs/clock.svg" alt="" />
                    <Countdown ref={countdown} date={endTime} onComplete={handleGameOver} renderer={Renderer} autoStart={false} />
                </div>
                <div className="absolute z-10 right-[29px] top-[29px] flex flex-col items-center gap-2">
                    <div className="w-[60px] h-[46px] rounded-[10px] bg-primary flex items-center justify-center gap-[4px] border-b-2 border-dotted border-white">
                        <img className="w-[21px] h-[21px]" src="/imgs/fish.png" alt="" />
                        <span className="font-bold text-[20px]">{ claimed.current }</span>
                    </div>
                    { goldenFish && (usedGolden < 2) && <button onClick={handleGoldenFish} className="relative w-[66px] h-[68px]">
                        <img className="" src="/imgs/goldfish.png" alt="" />
                        <span className="absolute bottom-0 right-0">x{2 - usedGolden}</span>
                    </button> }
                    { superFish && !usedSuper && <button onClick={handleSuperFish} className="w-[66px] h-[68px]">
                        <img className="" src="/imgs/rainbow.png" alt="" />
                    </button> }
                </div>
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