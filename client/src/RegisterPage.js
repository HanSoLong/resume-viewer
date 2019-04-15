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
        this.props.liftingInfo(event.target.name,event.target.value);
        switch(event.target.name){
            case 'email':
                this.setState({email: event.target.value});
                break;
            case 'username':
                this.setState({username: event.target.value}); break;
            case 'password':
                this.setState({password: event.target.value}); break;
            case 'confirmPassword':
                this.setState({confirmPassword: event.target.value}); break;
        }
    }

    localInfoVerify = () => {
        const emailRegular = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        let status = ''
        if(!emailRegular.test(this.state.email)){
            status='Wrong E-mail format'
            return status;
        }
        if(this.state.password !== this.state.confirmPassword){
            status='Confirm password different from password'
            return status;
        }

        status = 'clear';
        return status;

    }

    submitRegistration = async() => {
        const localVerify = this.localInfoVerify();
        if(localVerify==='clear'){
            const message = {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
            };
    
            const fetchOptions = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };
    
            const result = await fetch('/submitregistration',fetchOptions);
            const json = await result.json();
    
            switch(json.status){
                case 'success':
                    this.setState({errTipFlag: false});
                    this.props.history.push(this.props.match.path+'/verifyemail');
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
        }else{
            this.setState({
                errTipFlag: true,
                errTip: localVerify
            })
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

class RegisterWrapper extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            email: '',
            username: '',
            password: '',
            verifycode: ''
        };
    }

    collectRegInfo = (item,value) => {
        switch(item){
            case 'email':
                this.setState({email: value});
                break;
            case 'username':
                this.setState({username: value}); break;
            case 'password':
                this.setState({password: value}); break;
        }
    }

    render(){
        let match = this.props.match;
        let regInfo = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
            }
        return(
            <Router>
                <Route exact path={match.path} render={(props)=><RegisterPage liftingInfo={this.collectRegInfo} {...props}/>}/>
                <Route exact path={`${match.path}/verifyemail`} render={(props)=><VerifyEmail regInfo={regInfo} {...props}/>}/>
            </Router>
        );
    }
}

class VerifyEmail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            verifycode: '',
            errTip: '',
            errTipFlag: false
        }
    }

    onChangeHandler = (event) => {
        this.setState({
            verifycode: event.target.value
        })
    }

    submitVerifyCode = async() => {
        const message = {
            email: this.props.regInfo.email,
            username: this.props.regInfo.username,
            password: this.props.regInfo.password,
            verifycode: this.state.verifycode
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };
        const result = await fetch('/verifyaccount',fetchOptions);
        const json = await result.json();

        switch(json.status){
            case 'success':
                this.setState({
                    errTip: '',
                    errTipFlag: false
                });
                this.props.history.push('/');
                break;
            case 'wrongcode':
                this.setState({
                    errTip: 'Wrong E-mail verification code',
                    errTipFlag: false
                });
                break;
        }

    }

    render(){
        return(
            <div>
                Verify code: <input value={this.state.verifycode} onChange={this.onChangeHandler}/><br/>
                <button onClick={this.submitVerifyCode}>Submit</button><br/>
                <b>{this.state.errTipFlag && this.state.errTip}</b>
            </div>
        );
    }
}

export default withRouter(RegisterWrapper);