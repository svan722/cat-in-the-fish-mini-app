import { Link } from "@/components/Link";

const Info = () => {
    return (
        <div className="w-screen h-screen pt-[58px] pb-[20px] px-[15px] flex items-center justify-center">
            <div className="bg-[#8AA6B7B2] backdrop-blur-md rounded-[5px] px-[17px] py-[19px] w-full h-full flex flex-col justify-between">
                <div className="leading-tight">
                    <h1 className="font-semibold text-[24px] text-center mb-[24px]">Welcome to Cat in the Fish</h1>
                    <p>You can touch the falling fishes to collect fishes within 3 minutes.</p><br />
                    <p>If you touch the bomb, you can lose the whole fishes.</p><br />
                    <p>Every you invite a friend, you can collect 1000 fishes.</p><br />
                    <p>If you complete the daily task and tasks in task list, you can collect the fishes. Please implement the tasks !</p><br />
                    <p>The more you collect the fishes, the more you can earn PUSS !</p><br />
                </div>
                <Link to="/" className="rounded-[10px] flex justify-center items-center bg-primary border-b-2 box-content border-[#C6F0FF] text-[20px] hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-100 outline-none w-full h-[48px]">BACK</Link>
            </div>
        </div>
    )
}

export default Info;