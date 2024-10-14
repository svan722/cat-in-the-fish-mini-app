import { ObjectProps } from "@/libs/types";
import { useState } from "react";
import { Howl } from "howler";

const RainbowFish = ({ left, callback, status, fallTime }: ObjectProps) => {
    const [clicked, setClicked] = useState(false);
    const tap = new Howl({ src: ['/mp3/rainbow_fish.mp3'] });
    const handleClick = () => {
        if (clicked) return;
        tap.play();
        setClicked(true);
        if (callback) callback();
    }
    return <div onClick={handleClick} className={`absolute top-0 cursor-pointer transition-opacity duration-300 ${clicked ? 'opacity-0' : 'opacity-100'}`} style={{
        width: '70px',
        height: '70px',
        animation: `fall ${fallTime / 1000}s linear forwards`,
        left: `${left}%`,
        animationPlayState: status === "stopped" ? "paused" : "running"
    }}>
        <img draggable={false} className="animate-spin" style={{ animationPlayState: status === "stopped" ? "paused" : "running" }} src="/imgs/rainbow.png" alt="" />
    </div>
}

export default RainbowFish;