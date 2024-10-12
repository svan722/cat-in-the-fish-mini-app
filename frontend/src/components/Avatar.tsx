import { Link } from "./Link";

export interface AvatarProps {
    userid?: number
    width?: number
    height?: number
    className?: string
    username?: string
}

const Avatar = ({ userid, width, className, height, username }: AvatarProps) => {
    return (
        <div className="relative" style={{ width: width + 'px', height: height + 'px' }}>
            { username ?
            <Link to={`https://t.me/${username}`}><img className={`rounded-full ${ className }`} src={`/api/v1/users/avatar/${userid}`}  alt="avatar" loading="lazy" /></Link> :
            <img className={`rounded-full ${ className }`} src={`/api/v1/users/avatar/${userid}`} loading="lazy" alt="avatar" /> }
        </div>
    );
}

export default Avatar;