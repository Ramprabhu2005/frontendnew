import React from 'react'
import logo from '../assets/logo.svg'
import { NavLink, useNavigate } from "react-router-dom"
import { logout } from '../service/AuthApiService'

const HeaderComponent = ({ isAuthenticated, username, onLogout }) => {

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        if (onLogout) onLogout()
        navigate('/')
    }

    function isUrlHistory() {
        let url = window.location.href
        return url.endsWith("history")
    }

    return (
        <div>
            <nav className="fixed-top navbar navbar-expand-lg navbar-light">
                <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <img src={logo} alt="logo" width={30} height={30} />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                    {/* <a className="navbar-brand fw-bold">
                        <img src={logo} alt="logo" width={30} height={30} />
                    </a> */}
                    <ul className="navbar-nav gap-4">
                        {
                            isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link">Welcome, {username}</span>
                                    </li>
                                    <li className="nav-item">
                                        {
                                            isUrlHistory() ?  
                                                <NavLink className='nav-link' to='/tasks'>Tasks</NavLink> :  
                                                <NavLink className='nav-link' to='/history'>Task History</NavLink>
                                        }
                                    </li>
                                    <li className="nav-item">
                                        <button className='nav-link btn btn-link' onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )
                        }
                        {
                            !isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className='nav-link' to='/create-account'>Create account</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className='nav-link' to='/login'>Login</NavLink>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default HeaderComponent