import React, { Component } from 'react';
import './App.css';
import { Chart } from "react-google-charts";
import { BrowserRouter as Router, Route, Link, Redirect, withRouter} from "react-router-dom";
import {XYPlot, MarkSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Hint} from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
//import TopNav from './TopNav';

class App extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      length_3: Array(3).fill(0),
      ready: true,
      toolTipFlag: false,
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.getDateTime = this.getDateTime.bind(this);
    this.sendUserActivity = this.sendUserActivity.bind(this);
    this.sizeRef = React.createRef();
    this.barLength = 300;
    this.totalScore = 100; //total score
  }

  componentDidMount() {
    //console.log(this.sizeRef.current.clientWidth);
    //this.barLength = 300;
    //this.barLength = this.sizeRef.current.clientWidth - 2; //substracting the width of both borderlines
    //in this case 2
    this.getScore();
    //console.log("width",this.sizeRef.current.clientWidth);
    
 }

 async sendUserActivity(activity, item){
   const userName = this.props.userName;
   let datetime = this.getDateTime();
   const message = {
     activity: activity,
     item: item,
     datetime: datetime
   }

   const fetchOptions = {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(message)
   };
   console.log("sending activity")
   await fetch('/setuseractivity/' + userName, fetchOptions);
   console.log(activity+ "on item " + item + " sent");

 }

  sendScore = async () =>{
    const userName = this.props.userName;
    let datetime = this.getDateTime();
    console.log(datetime);
    const message = {
      score1: this.lengthToScore(this.state.length_3[0]),
      score2: this.lengthToScore(this.state.length_3[1]),
      score3: this.lengthToScore(this.state.length_3[2]),
      datetime: datetime
    };



    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    };

    await fetch('/setscore/' + userName, fetchOptions);
    console.log("scores send");
  }

  getScore = async () => {
    const userName = this.props.userName;
    console.log("chart init username",this.props.userName);
    const result = await fetch('/getscore/' + userName);
    const json = await result.json();
    const tempScore = Array(3).fill(0);
    if(json.result.length){
      tempScore[0] = this.scoreToLength(json.result[0].score1);
      tempScore[1] = this.scoreToLength(json.result[0].score2);
      tempScore[2] = this.scoreToLength(json.result[0].score3);
    }
    this.setState({
      length_3: tempScore
    })
  }

  async sendClick(){

  }

  getDateTime(){
   var date = new Date().getDate(); //Current Date
   var month = new Date().getMonth(); //Current Month
   var year = new Date().getFullYear(); //Current Year
   var hours = new Date().getHours(); //Current Hours
   var min = new Date().getMinutes(); //Current Minutes
   var sec = new Date().getSeconds(); //Current Seconds
   var ms = new Date().getMilliseconds();

   return {Day: date, Month: month, Year: year, Hour: hours, Minute: min, Second: sec, Millisecond: ms}
}

  clickHandler(index,e) {
    const lengthes = this.state.length_3.slice();
    const lastFlag = this.state.lengthFlag;
    lengthes[index] = e.nativeEvent.offsetX
    //console.log(this.props.loginStatus);
    if(!this.props.loginStatus){ 
      this.props.history.push("/login");
    }
    if (e.nativeEvent.offsetX < this.barLength * 0.99) {
      lengthes[index] = e.nativeEvent.offsetX
    } else {
      lengthes[index] = this.barLength;
    }
    this.setState({
      length_3: lengthes,
      listenerFlag: false
      //lengthFlag: lastFlag+1
    },function(){
        this.sendScore();
        //console.log(this.state.length_3);
      });

  }

  inputHandler(index, score) {
    const lengthes = this.state.length_3.slice();
    const lastFlag = this.state.lengthFlag;
    if(!this.props.loginStatus){ 
      this.props.history.push("/login");
    }
    if (score <= this.totalScore) {
      lengthes[index] = this.scoreToLength(score);
    } else {
      lengthes[index] = this.barLength;
    }
    this.setState({
      //x: (score / this.totalScore) * this.barLength
      length_3: lengthes,
      listenerFlag: false
      //lengthFlag: lastFlag+1
    },function(){
        this.sendScore();
        //console.log(this.state.x);
      });
  }

  lengthToScore(length){
    return Math.round( (length / this.barLength) * this.totalScore );
  }

  scoreToLength(score){
    return (score / this.totalScore) * this.barLength;
  }

  lengthToRatio(length){
    return (length / this.barLength) * 100;
  }

  toolTipData = (data) => {
    return{
      x: data.x,
      y: data.y,
      size: data.size,
      color: data.color
    }
  }

  render() {
    //console.log("chart page username",this.props.userName);
    //console.log("chart page login",this.props.loginStatus);
    let barRatio = Array(3).fill(0);
    let actualScore = Array(3).fill(0);
    if (this.barLength) {
      for(let i=0; i<3; i++){
        barRatio[i] = this.lengthToRatio(this.state.length_3[i]);
        actualScore[i] = this.lengthToScore(this.state.length_3[i]);
      }
    }
    const data = [
      {x: 0, y: 8, size: 4, color: 60},
      {x: 1, y: 5, size: 3, color: 50},
      {x: 2, y: 4, size: 3, color: 75},
      {x: this.lengthToScore(this.state.length_3[0]), y: this.lengthToScore(this.state.length_3[1]), 
        size: this.lengthToScore(this.state.length_3[2]), color: 25}
    ];
    return (
      <div>
        <div>
        <XYPlot height={500} width={500}
         colorRange={["white", "red"]}
         colorType="linear" colorDomain={[0, 100]}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <MarkSeries
            sizeRange={[1, 20]}
            data={[{x: 0, y: 8, size: 4, color: 60}]} 
            onSeriesClick={(event)=>{
              this.sendUserActivity("select", 0);
              console.log("click 0")
            }}
            onSeriesMouseOver={(event)=>{
              this.sendUserActivity("mouseover", 0);
              console.warn("mouseover 0");
            }}
            onValueMouseOver={(data,event) => {
              this.setState({toolTipFlag: data})
            }}
            onValueMouseOut={(data,event) => {
              this.setState({toolTipFlag: false})
            }}/>
          <MarkSeries 
            sizeRange={[1, 20]}
            data={[{x: 1, y: 5, size: 3, color: 50}]} 
            onSeriesClick={(datapoint, event)=>{
              this.sendUserActivity("select", 1);
              console.log("click 1")
            }}
            onSeriesMouseOver={(event)=>{
              this.sendUserActivity("mouseover", 1);
              console.warn("mouseover 1");
            }}
            onValueMouseOver={(data,event) => {
              this.setState({toolTipFlag: data})
            }}
            onValueMouseOut={(data,event) => {
              this.setState({toolTipFlag: false})
            }}/>
          <MarkSeries 
            sizeRange={[1, 20]}
            data={[{x: 2, y: 4, size: 3, color: 75}]} 
            onSeriesClick={(datapoint, event)=>{
              this.sendUserActivity("select", 2);
              console.log("click 2")
            }}
            onSeriesMouseOver={(event)=>{
              this.sendUserActivity("mouseover", 2);
              console.warn("mouseover 2");
            }}
            onValueMouseOver={(data,event) => {
              this.setState({toolTipFlag: data})
            }}
            onValueMouseOut={(data,event) => {
              this.setState({toolTipFlag: false})
            }}/>
          <MarkSeries 
            sizeRange={[1, 20]}
            data={[{x: this.lengthToScore(this.state.length_3[0]), y: this.lengthToScore(this.state.length_3[1]), 
              size: this.lengthToScore(this.state.length_3[2]), color: 25}]} 
            onSeriesClick={(datapoint, event)=>{
              this.sendUserActivity("select", 3);
              console.log("click 3")
            }}
            onSeriesMouseOver={(event)=>{
              this.sendUserActivity("mouseover", 3);
              console.warn("mouseover 3");
            }}
            onValueMouseOver={(data,event) => {
              this.setState({toolTipFlag: data})
            }}
            onValueMouseOut={(data,event) => {
              this.setState({toolTipFlag: false})
            }}/>
          {this.state.toolTipFlag ? <Hint value={this.toolTipData(this.state.toolTipFlag)} align={{vertical: 'bottom', horizontal: 'right'}}>
              <div style={{color: '#000', background: '#fff', alignItems: 'center', padding: '1px', border: '1px solid black', borderRadius: '5px'}}>
                <p style={{fontSize: '12px'}}>
                  score1: {this.state.toolTipFlag.x}<br/>
                  score2: {this.state.toolTipFlag.y}<br/>
                  score3: {this.state.toolTipFlag.size}<br/>
                  chance: {this.state.toolTipFlag.color}<br/>
                </p>
              </div>
          </Hint>:null}

        </XYPlot><br/>

        </div>
          <div style={{ float: "left" }} ref={this.sizeRef}>
              {this.state.ready && <ProgressBar percentage={barRatio[0]} onClick={this.clickHandler.bind(this, 0)} />}
          </div>
          <div
              style={{ float: "left", paddingLeft: "15px", paddingBottom: "1px" }}
          >
              {this.state.ready && <InputBox value={actualScore[0]} onChange={this.inputHandler} index={0} />}
          </div>
          <div>
              {this.state.ready && <p>/{this.totalScore}</p>}
          </div>

          <div style={{ float: "left" }} ref={this.sizeRef}>
              {this.state.ready && <ProgressBar percentage={barRatio[1]} onClick={this.clickHandler.bind(this, 1)} />}
          </div>
          <div style={{ float: "left", paddingLeft: "15px", paddingBottom: "1px" }}>
              {this.state.ready && <InputBox value={actualScore[1]} onChange={this.inputHandler} index={1} />}
          </div>
          <div>
              {this.state.ready && <p>/{this.totalScore}</p>}
          </div>

          <div style={{ float: "left" }} ref={this.sizeRef}>
              {this.state.ready && <ProgressBar percentage={barRatio[2]} onClick={this.clickHandler.bind(this, 2)} />}
          </div>
          <div
              style={{ float: "left", paddingLeft: "15px", paddingBottom: "1px" }}
          >
              {this.state.ready && <InputBox value={actualScore[2]} onChange={this.inputHandler} index={2} />}
          </div>
          <div>
              {this.state.ready && <p>/{this.totalScore}</p>}
          </div>


      </div>
    );
  }
}

class ProgressBar extends React.Component {
  render() {
    return (
      <div className="progress-bar" onClick={this.props.onClick}>
        <Filler percentage={this.props.percentage} />
      </div>
    );
  }
}

class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(this.props.index, e.target.value);
  }

  render() {
    return (
      <input
        value={this.props.value}
        onChange={this.handleChange}
        style={{ width: "25px" }}
      />
    );
  }
}

const Filler = props => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} />;
};

//const rootElement = document.getElementById("root");
//ReactDOM.render(<App />, rootElement);


export default withRouter(App);
