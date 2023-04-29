import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import Rules from './Rules';



const HelpTab = () => {
    return (
        <ul className='navbar-nav'>
            <li className='nav-item dropdown '>
                <Link className="nav-link dropdown-toggle" role='button' data-bs-toggle="dropdown">Help</Link>
                <ul className='dropdown-menu text-bg-secondary'>
                    <li><Link className='dropdown-item text-bg-secondary' data-bs-toggle='modal' data-bs-target='#rules'>Rules</Link></li>
                    <li><Link className='dropdown-item text-bg-secondary'>FAQs</Link></li>
                    <li><Link className='dropdown-item text-bg-secondary'>Report Issue/Submit Feedback</Link></li>
                </ul>
            </li>
        </ul>
    )
}

const Navbar = () => {
    const { logout } = useLogout();
    const { userID } = useUserContext();

    const handleClick = () => {
        logout();
    }

    return (
        <header>

            <div className="container navBarContainer text-bg-dark" >

                <nav className='navbar navbar-expand-md navbar-dark' >
                    {!userID && (
                        <div className='container'>
                            <Link className='navbar-brand' to='/'>EdgeBets</Link>
                            <HelpTab />
                        </div>
                    )}

                    {userID && (

                        <div className='container' >
                            <Link className='navbar-brand' to='/'>EdgeBets</Link>
                            <button className='navbar-toggler' data-bs-toggle='collapse' data-bs-target='#nav'>
                                <div className='navbar-toggler-icon'></div>
                            </button>
                            <div className='collapse navbar-collapse' id='nav'>
                                <ul className='navbar-nav'>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-nowrap' to="/home">Home</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-nowrap' to='/standings'>Standings</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-nowrap' to="/games">Schedule</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-nowrap' to='/user/my-picks'>My Picks</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link text-nowrap' to="/submit-picks">Submit Pick</Link>
                                    </li>
                                    <HelpTab />
                                    <li className='nav-item'>
                                        <Link className='nav-link text-nowrap' onClick={handleClick}>Log Out</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </nav>
                <Rules />
            </div>
        </header>
    )
}

export default Navbar;