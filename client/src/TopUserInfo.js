import React from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

class TopUserInfo extends React.Component{

    logoutHandler = () => {
        this.props.logout();
    }

    render(){
        return(
            <div>
            {this.props.loginStatus ? (
            <div>Welcome {this.props.userName}<br/>
            <button onClick={this.props.logoutHandler}>Logout</button>
            </div>
            ): "Please login"}
            </div>
        );
    }
}

export default withRouter(TopUserInfo);