import { ObjectProps } from "@/utils/types";
import { useState } from "react";

const Fish = ({ left, callback, status }: ObjectProps) => {
    const [clicked, setClicked] = useState(false);
    const handleClick = () => {
        if (clicked) return;
        setClicked(true);
        callback && callback();
    }
    return <div onClick={handleClick} className={`absolute top-0 cursor-pointer transition-opacity duration-300 animate-fall ${clicked ? 'opacity-0' : 'opacity-100'}`} style={{
        width: '65px',
        height: '65px',
        // animation: 'fall 3s linear forwards',
        left: `${left}%`,
        animationPlayState: status === "stopped" ? "paused" : "running"
    }}>
        <img draggable={false} className="animate-spin" style={{ animationPlayState: status === "stopped" ? "paused" : "running" }} src="/imgs/fish.png" alt="" />
    </div>
}

export default Fish;