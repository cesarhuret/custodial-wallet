import React, {Component} from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import ReactDOM from 'react-dom';
import './style.css'

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
        alert: false,
        alertvariant: '',
        alertContent: '',
        ethBalance: '',
        importedToken: ''
    };

    this.importNewToken = this.importNewToken.bind(this)
  }
  

  async componentDidMount () {
    if(sessionStorage.getItem('token') != null) {
        this.setState({ethBalance: (await this.getEthBalance()).balance})

        let list = await this.getTokenBalances()
        let itemsList = [];
        for (let i = 0; i < list.tokens.length; i++) {
                itemsList.push(
                    <div key={i}>
                        <Col style={{paddingBottom: 30}}>
                            <Card text='white' bg="dark" className='cardhover colored' style={{border: 'none'}}>
                                <Card.Body>
                                    <Row className='align-items-center'>
                                        <Col xs={{span: 'auto'}}>
                                            <Card.Title style={{color: "white"}}>{list.tokens[i].balance} {list.tokens[i].symbol}</Card.Title>
                                        </Col>
                                        <Col className='mr-auto' xs={{span: 'auto'}}>
                                            <input style={{color: "white"}} className="inputfocus" placeholder="Receiver" id={`receiver${i}`} />
                                        </Col>
                                        <Col className='mr-auto' xs={{span: 'auto'}}>
                                            <input style={{color: "white"}} className="inputfocus" placeholder="Amount" id={`amount${i}`}/>
                                        </Col>
                                        <Col className='mr-auto' xs={{span: 'auto'}}>
                                            <Button onClick={()=> {this.sendTokenstoAddress(document.getElementById(`receiver${i}`).value, document.getElementById(`amount${i}`).value)}}>Send</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                )
        }
      ReactDOM.render(itemsList, document.getElementById('shop'))
        }  
    }

    async getTokenBalances() {
        const balances = await fetch('https://walletapi.kesarx.repl.co/api/allBalances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: sessionStorage.getItem('token')
            })
        }).then((res) => res.json());
        if(balances.status === 'ok') {
            return balances;
        }
    }

    async getEthBalance() {
        const balance = await fetch('https://walletapi.kesarx.repl.co/api/ethBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: sessionStorage.getItem('token')
            })
        }).then((res) => res.json());
        if(balance.status === 'ok') {
            return balance.data;
        }
    }

    async buyItem (itemname) {
        const spend = await fetch('https://obscoin.herokuapp.com/api/spend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: sessionStorage.getItem('token'),
                itemname: itemname
            })
        }).then((res) => res.json());
        if(spend.status === 'error') {
            this.setState({alert: true, alertvariant: "danger", alertContent: spend.error})
        } else {
            this.setState({alert: true, alertvariant: 'success', alertContent: spend.data})
        }

        const timeOut = setTimeout(() => {
            this.setState({alert: false, alertvariant: "", alertContent: ''})
        }, 3000)

    }

    async importNewToken() {
        if(this.state.importedToken !== '') {
            const result = await fetch('https://walletapi.kesarx.repl.co/api/importToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: sessionStorage.getItem('token'),
                    address: this.state.importedToken
                })
            }).then((res) => res.json());
            if(result.status === 'ok') {
                window.location.reload()
            }
        }
    }

    async sendTokenstoAddress(address, amount) {
        if(address != '' && amount != '') {
            console.log(address)
            console.log(amount)
        }
    }

    render() {
        if(sessionStorage.getItem('token') != null) {
            return ( 
                <div className="App">
                    <div>
                        <Container style={{textAlign: "left", paddingTop: '10%', color: 'rgb(150, 150, 150)'}} className='justify-content-center'>
                            <Col key={'title'}>
                                <Row className='align-items-center'>
                                    <div className="mb-3"><input className="form-control form-control-user inputfocus" type="text" placeholder="Contract Address" name="username" onChange={ (e) => {this.setState({importedToken: e.target.value})}} required/></div>
                                    <Button className="border-0 btn btn-primary d-block btn-user coloredreverse" type="submit" onClick={this.importNewToken}>Import Token</Button>
                                </Row>
                            </Col>
                            <Col key={'tokens'} style={{paddingTop: '2rem'}}>
                                <h1>{this.state.ethBalance} ETH</h1> <hr style={{borderImage: "linear-gradient(to right, rgba(200, 30, 200, 0.7), rgba(30, 150, 250, 0.7))", borderImageSlice: '5'}} />
                            </Col>
                            <div id='shop'>
                            </div>
                        </Container>
                    </div>
                    <div className='fixed-bottom'>
                        <Container  className='rounded'>
                            <Alert show={this.state.alert} variant={this.state.alertvariant} className="align-items-center justify-content-center">
                                <p>{this.state.alertContent}</p>
                            </Alert>
                        </Container>
                    </div>
                </div>
            )
        } else {
            return (
                <Container  className='rounded horizontalcenter'>
                    <Alert show={true} variant='danger' className="align-items-center justify-content-center">
                        <p>Please log in to view this page</p>
                    </Alert>
                </Container>

            )
        }
    }
}

export default Profile;