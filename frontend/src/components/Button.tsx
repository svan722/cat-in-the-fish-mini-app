type Props = {
    children: string | JSX.Element | JSX.Element[],
    width?: number,
    height: number,
    onClick?: () => void
}

const Button = ({ children, width, height, onClick }: Props) => {
    return <button onClick={onClick} style={{ width: width ? width : '100%', height }} className="rounded-[10px] flex justify-center items-center bg-primary border-b-2 box-content border-[#C6F0FF] text-[20px] hover:-translate-y-1 hover:active:translate-y-0 transition-all duration-100 outline-none">{ children }</button>
}

export default Button;