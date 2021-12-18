import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import SignUp from './Pages/Signup';
export function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Profile/>
                    {/* <FootComp/> */}
                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/signup">
                    <SignUp/>
                </Route>
            </Switch>
        </BrowserRouter>

    );
}
