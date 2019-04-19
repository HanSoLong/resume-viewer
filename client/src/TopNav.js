import { withRouter } from 'react-router-dom'
import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Chart from './App'
import LoginPage from './LoginPage'
import TopUserInfo from './TopUserInfo'
import RegisterWrapper from './RegisterPage'
import TextEditor from './slate/Editor'

class TopNav extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loginStatus: false,
            userName: "",
        }
    }

    loginSuccess = (username) => {
        this.setState({
            loginStatus: true,
            userName: username
        });
    }

    logoutHandler = () => {
        this.setState({
            loginStatus: false,
            userName: ''
        });
    }

    render(){
        console.log("TopNav page username",this.state.userName);
        return (
        <Router>
            <div>
            <ul>
                <li>
                    <Link to="/resume">Resume</Link>
                </li>
                <li>
                    <Link to="/chart">Chart</Link>
                </li>
                {!this.state.loginStatus && 
                <li>
                    <Link to="/login">Login</Link>
                </li>}
                {!this.state.loginStatus && 
                <li>
                    <Link to="/register">Register</Link>
                </li>}
            </ul>
            <TopUserInfo loginStatus={this.state.loginStatus} logoutHandler={this.logoutHandler} userName={this.state.userName}/>
            <hr />
    
            <Route exact path="/" render={(props)=><Chart loginStatus={this.state.loginStatus} userName={this.state.userName} {...props} />} />
            <Route exact path="/resume" render={(props)=>(<TextEditor {...props}/>)} />
            <Route exact path="/chart" render={(props)=><Chart loginStatus={this.state.loginStatus} userName={this.state.userName}  {...props} />}/>
            <Route exact path="/login" render={(props)=><LoginPage loginSuccess={this.loginSuccess} {...props}/>}/>
            <Route path="/register" render={(props)=><RegisterWrapper/>}/>
            </div>
        </Router>
        );
    }
  }

class Resume extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div>
            resume
        </div>)
    }
    
}

class VerifyEmail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            verifyCode: ''
        }
    }

    onChangeHandler = (event) => {
        this.setState({
            verifyCode: event.target.value
        })
    }

    submitVerifyCode = () => {
        
    }

    render(){
        return(
            <div>
                Verify code: <input value={this.state.verifyCode} onChange={this.onChangeHandler}/><br/>
                <button onClick={this.submitVerifyCode}>Submit</button>
            </div>
        );
    }
}

export default TopNav;