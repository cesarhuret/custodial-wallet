import React, {Component} from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import './style.css'

class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        alert: false,
        alertvariant: 'success',
        alertContent: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
      console.log('hello')

    const result = await fetch('https://walletapi.kesarx.repl.co/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
        })
    }).then((res) => res.json());

    console.log(result)
    if(result.status === 'ok') {
        this.setState({alert: true, alertvariant: "success", alertContent: 'A verification link was sent to your email'})
        const timeOut = setTimeout(() => {
            this.setState({alert: false, alertvariant: "", alertContent: ''})
            window.open(`/login`, "_self");
        }, 3000)
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
                        <Card className='border-0 my-5 colored'>
                            <Card.Body>
                                <div className='p-4'>
                                    <div className='text-center'>
                                        <h4 className="mb-4" style={{fontWeight: 300, color: 'rgb(150, 150, 150)'}}>Sign Up</h4>
                                    </div>
                                    <form size='lg'>
                                        <div className="mb-3"><input className="form-control form-control-user inputfocus" type="text" placeholder="Username" name="username" onChange={ (e) => {this.setState({username: e.target.value})}} required/></div>
                                        <div className="mb-3"><input className="form-control form-control-user inputfocus" type="password" placeholder="Password" name="password" onChange={ (e) => {this.setState({password: e.target.value})}} required/></div>
                                        
                                        <Button className="border-0 btn btn-primary d-block btn-user w-100 coloredreverse" type="submit" onClick={this.handleSubmit}>Sign Up</Button>
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

export default SignUp;