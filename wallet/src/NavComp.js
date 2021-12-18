import React, {Component} from "react";
import {Navbar, Nav, Container } from 'react-bootstrap'
import UserContext from "./UserContext";
import './Pages/style.css'

class NavComp extends Component {
    
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            username: "",
        };
    }

    render() {
        if(sessionStorage.getItem('token') != null) {
            return ( 
                <div className="App">
                        <Navbar variant="dark" expand="lg" style={{borderBottom: '1px solid', borderImage: 'linear-gradient(to right, rgba(30, 150, 250, 0.5), rgba(200, 30, 200, 0.5))', borderImageSlice: '5'}}>
                        <Container>
                            <Navbar.Brand>
                                <Nav.Link className='navlink' disabled style={{color: "white"}}>
                                    <span style={{color: 'rgba(0, 150, 255, 1)'}}>{this.context.username}</span>
                                </Nav.Link>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ml-auto">
                                    <Nav.Link className='navlink' disabled style={{color: "white"}}>
                                        <span style={{color: 'rgba(0, 150, 255, 1)'}}> {this.context.address}</span>
                                    </Nav.Link>
                                    <Nav.Link className='navlink' onClick={ () => { sessionStorage.removeItem('token'); window.open(`/login`, "_self"); }}> <span style={{color: 'rgba(250, 0, 250, 1)'}}>Logout</span></Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                        </Navbar>
                    </div>
                )
        } else {
            return ( 
                <div className="App">
                    <div>
                    <Navbar variant="dark" expand="lg" style={{ background: 'linear-gradient(rgba(30, 30, 30, 0), rgba(30, 30, 30, 0))', borderBottom: '1px solid', borderImage: 'linear-gradient(to right, rgba(30, 150, 250, 0.3), rgba(200, 30, 200, 0.3))', borderImageSlice: '5'}}>
                        <Container>
                            <Navbar.Brand href="/">
                                <img src='logo192.png' style={{width: 50, height: 'auto'}} alt=''/>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ml-auto">
                                    <Nav.Link className='navlink' href="/login">Login</Nav.Link>
                                    <Nav.Link className='navlink' href="/signup">Sign Up</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                        </Navbar>
                    </div>
                </div>
                )
        }
    }
}

export default NavComp;