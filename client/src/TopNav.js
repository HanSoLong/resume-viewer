import { withRouter } from 'react-router-dom'
import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Chart from './App'
import LoginPage from './LoginPage'
import TopUserInfo from './TopUserInfo'

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
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
            <TopUserInfo loginStatus={this.state.loginStatus} userName={this.state.userName}/>
            <hr />
    
            <Route exact path="/" render={(props)=><Chart loginStatus={this.state.loginStatus} userName={this.state.userName} {...props} />} />
            <Route exact path="/resume" render={(props)=>(<Resume {...props}/>)} />
            <Route exact path="/chart" render={(props)=><Chart loginStatus={this.state.loginStatus} userName={this.state.userName}  {...props} />}/>
            <Route exact path="/login" render={(props)=><LoginPage loginSuccess={this.loginSuccess} {...props}/>}/>
            </div>
        </Router>
        );
    }
  }
  
  
  function About() {
    return (
      <div>
        <h2>About</h2>
      </div>
    );
  }

class Resume extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<h3>Resume</h3>)
    }
    
}

export default TopNav;