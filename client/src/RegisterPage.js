import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter} from "react-router-dom";

class RegisterPage extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            errTip: '',
            errTipFlag: false
        };
    }

    handleChange= (event) => {
        //item 1 2 3 4 for email, username, password and confirmpassword
        switch(event.target.name){
            case 'email':
                this.setState({email: event.target.value}); break;
            case 'username':
                this.setState({username: event.target.value}); break;
            case 'password':
                this.setState({password: event.target.value}); break;
            case 'confirmPassword':
                this.setState({confirmPassword: event.target.value}); break;
        }
    }

    localInfoVerify = () => {
        return true;
    }

    submitRegistration = async() => {
        console.log('reg!!!');
        const message = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmpassword: this.state.confirmPassword
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        //const result = await fetch('/submitregister',fetchOptions);
        //const json = await result.json();
        const test='success';

        switch(test){
            case 'success':
                this.setState({errTipFlag: false});
                this.props.history.push('/verifyemail');
                break;
            case 'usernameTaken':
                this.setState({
                    errTipFlag: true,
                    errTip: 'Username taken'
                });
                break;
            case 'emailExists':
                this.setState({
                    errTipFlag: true,
                    errTip: 'E-mail exists'
                });
                break;
        }
    }

    render(){
        return(
            <div>
                <b>Register</b>
                <form>
                    <label>
                        E-mail Address:<input type='text' name='email' value={this.state.email} onChange={this.handleChange}/><br/>
                        Username:<input type='text' name='username' value={this.state.username} onChange={this.handleChange}/><br/>
                        Password:<input type='password' name='password' value={this.state.password} onChange={this.handleChange}/><br/>
                        Confirm Password:<input type='password' name='confirmPassword' value={this.state.confirmPassword} onChange={this.handleChange}/><br/>
                    </label>
                </form><br/>
                <button onClick={this.submitRegistration}>Submit</button><br/>
                <b>{this.state.errTipFlag && this.state.errTip}</b>
            </div>
        );
    }
}

export default withRouter(RegisterPage);