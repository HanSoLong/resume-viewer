import React from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

class LoginPage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            wrongInfo: false
        };
      }    
    
    handleUsernameChange = (event) => {this.setState({username: event.target.value});}
    handlePasswordChange = (event) => {this.setState({password: event.target.value});}

    submitLogin = async() => {

        const message = {
            username: this.state.username,
            password: this.state.password
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        const result = await fetch('/loginattempt',fetchOptions);
        const json = await result.json();

        console.log("Login Page Result:",json.username);

        if(json.loginsuccess){
            this.setState({wrongInfo: false});
            this.props.loginSuccess(json.username);
            this.props.history.push("/");
        }else{
            this.setState({wrongInfo: true});
        }
        
    }

    render(){
        return(
            <div>
            <form>
                <label>
                    username:
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} /><br/>
                    password:
                    <input type="password" value={this.state.password} onChange={this.handlePasswordChange}  /><br/>
                </label>
            </form>
            <br/>
            <button onClick={this.submitLogin}>Login</button>
            {this.state.wrongInfo && <h3>Wrong login info</h3>}
            </div>
        );
    }
}

export default withRouter(LoginPage)