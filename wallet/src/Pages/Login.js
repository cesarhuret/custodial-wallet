import React, {Component} from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import './style.css'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
        tab: 'Log In',
        username: '',
        password: '',
        alert: false,
        alertvariant: 'success',
        alertContent: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
        
      // POST Request via browser's default fetch()
    const result = await fetch('https://walletapi.kesarx.repl.co/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
        })
    }).then((res) => res.json());

    if(result.status === 'ok') {
      sessionStorage.setItem('token', result.data)
      this.setState({alert: true, alertvariant: "success", alertContent: 'Successfully logged in'})
      const timeOut = setTimeout(() => {
          this.setState({alert: false, alertvariant: "", alertContent: ''})
          window.open(`/`, "_self");
      }, 2000)
    } else {
        this.setState({alert: true, alertvariant: "danger", alertContent: result.error})
        const timeOut = setTimeout(() => {
            this.setState({alert: false, alertvariant: "", alertContent: ''})
        }, 3000)
    }
  }

  render() {
        return ( 
        <div className="App">
            <Container>
                <Row className='justify-content-center'>
                    <Col md={9} lg={8} xl={8}>
                        <Card className='round my-5 colored'>
                            <Card.Body>
                                <div className='p-4'>
                                    <div className='text-center'>
                                        <h4 className="mb-4" style={{fontWeight: 300, color: 'rgb(150, 150, 150)'}}>Log In</h4>
                                    </div>
                                    <form className='user' size='lg'>
                                        <div className="mb-3"><input className="form-control form-control-user inputfocus" type="email" placeholder="Email" name="email" onChange={ (e) => {this.setState({username: e.target.value})}} required/></div>
                                        <div className="mb-3"><input className="form-control form-control-user inputfocus" type="password" placeholder="Password" name="password" onChange={ (e) => {this.setState({password: e.target.value})}} required/></div>
                                        <Button className="border-0 btn btn-primary d-block btn-user w-100 coloredreverse" type="submit" onClick={this.handleSubmit}>Log In</Button>
                                    </form>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div className='fixed-bottom'>
                    <Container  className='rounded'>
                        <Alert show={this.state.alert} variant={this.state.alertvariant} className="align-items-center justify-content-center">
                            <p>{this.state.alertContent}</p>
                        </Alert>
                    </Container>
                </div>
            </Container>
        </div>
        )
    }
}

export default Login;