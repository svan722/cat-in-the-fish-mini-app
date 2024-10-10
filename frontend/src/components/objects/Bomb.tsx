import { ObjectProps } from "@/libs/types";
import { useState } from "react";

const Bomb = ({ left, callback, status, fallTime }: ObjectProps) => {
    const [clicked, setClicked] = useState(false);
    const handleClick = () => {
        if (clicked) return;
        setClicked(true);
        callback && callback();
    }
    return <div onClick={handleClick} className={`absolute top-0 cursor-pointer transition-opacity duration-300 ${clicked ? 'opacity-0' : 'opacity-100'}`} style={{
        width: '50px',
        height: '50px',
        animation: `fall ${fallTime / 1000}s linear forwards`,
        left: `${left}%`,
        animationPlayState: status === "stopped" ? "paused" : "running"
    }}>
        <img draggable={false} className="" src="/imgs/bomb.png" alt="" />
    </div>
}

export default Bomb;