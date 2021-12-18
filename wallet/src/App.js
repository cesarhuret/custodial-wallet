import './App.css';
import { Routes } from './Routes';
import UserContext from './UserContext';
import { Component } from 'react';
import getUserProfile from './getUserProfile';
import { BrowserRouter } from 'react-router-dom';
import NavComp from './NavComp';

class App extends Component {

  constructor() {
    super();

    this.state = {
      username: '',
      address: '',
    };
  }

  
  async componentDidMount() {
    const result = await getUserProfile();
    if(result.status === 'ok') {
      this.setState({ username: result.data.profile.username, 
                      address: result.data.profile.address,
                    })
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <UserContext.Provider value={{ username: this.state.username, address: this.state.address}}>
            <NavComp></NavComp>
            <Routes />
          </UserContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
