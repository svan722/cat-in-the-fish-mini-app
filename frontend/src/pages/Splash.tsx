import "./splash.css";

const Splash = ({ onClick }: { onClick: () => void }) => {
    return <div onClick={onClick} className="absolute cursor-pointer w-screen h-screen bg-[url('/imgs/splash.png')] bg-cover bg-center">
        <h1 className="text-center text-[#F1F3B1] font-extrabold text-[25px] mt-[60vh]">Please tap to continue</h1>
    </div>
}

export default Splash;