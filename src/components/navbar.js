import React from 'react'
import logo from '../styles/logo.png'

function navbar() {
    return (
        <nav className="navbar " style={{ backgroundColor: "rgb(231, 229, 229)", boxShadow: "0px 2px 10px 2px rgba(0, 0, 0, 0.2)" }}>
            <div className="container-fluid">
                <img src={logo} alt="logo" style={{
                    height: "30px", width: "150px"
                }} />
            </div>

        </nav>
    )
}

export default navbar
