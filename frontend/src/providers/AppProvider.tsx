import { useState, useLayoutEffect } from "react";
import { createContext, useContext } from "react";
import { useInitData } from "@telegram-apps/sdk-react";
import { Howl, Howler } from "howler";

import API from "@/libs/API";
import Splash from "@/pages/Splash";

type Volume = "on" | "off";

interface AppContextData {
    isAuthenticatied: boolean;
    volume: Volume;
    toggleMusic: () => void;
}

const AppContext = createContext<AppContextData | null>(null);

const AppProvider = ({ children }: { children: JSX.Element }) => {

    const initData = useInitData();
    const [volume, setVolume] = useState<Volume>(localStorage.getItem('volume') === "on" ? "on" : "off");
    const [showSplash, setShowSplash] = useState(true);
    const [isAuthenticatied, setAuthenticated] = useState(false);

    const audio = new Howl({
        src: ['/mp3/background.mp3'],
        autoplay: true,
        loop: true,
        mute: volume === "off"
    });

    const handleClickSplash = () => {
        setShowSplash(false);
    }

    const toggleMusic = () => {
        setVolume(prev => {
            let isOn = prev === "on";
            Howler.mute(isOn);
            let newVolume: Volume = isOn ? "off" : "on";
            localStorage.setItem('volume', newVolume)
            return newVolume;
        });
    }

    useLayoutEffect(() => {
        API.post('/auth/login', {
            userid: initData?.user?.id,
            username: initData?.user?.username,
            firstname: initData?.user?.firstName,
            lastname: initData?.user?.lastName,
            is_premium: initData?.user?.isPremium,
            inviter: initData?.startParam,
        }).then((res) => {
            localStorage.setItem('token', `Bearer ${res.data.token}`);
            setAuthenticated(true);
            console.log('User logined:', initData?.user?.username, initData?.user?.firstName, initData?.user?.lastName);
        })
        .catch(console.error);
    }, []);

    return (
        <AppContext.Provider value={{ isAuthenticatied, toggleMusic, volume }}>
            { showSplash ? <Splash onClick={handleClickSplash} /> : children }
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext);
export default AppProvider;