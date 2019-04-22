import React from "react";
import CustomEditor from './Editor';
import { Value } from 'slate'

const initialValue = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [{ text: "A line of text in a paragraph." }]
          }
        ]
      }
    ]
  }
};

const initialTitle = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [{ text: "Title" }]
          }
        ]
      }
    ]
  }
};

class EditorWrapper extends React.Component{
    state = {
        value: [],
        title: [],
      };
    
      componentWillMount() {
        if(!this.props.loginStatus) this.props.history.push('/login');
        this.getResume();
      }
    
      onChange = (flag, value, index) => {
        let tempArray = [];
          //console.log("index: ",index)
        if(flag === 'title'){
            tempArray = this.state.title.slice();
            tempArray[index] = value;
            this.setState({ title: tempArray }, function() {
              //console.log(this.state.value);
            });
        }else if(flag === 'text'){
            tempArray = this.state.value.slice();
            tempArray[index] = value;
            this.setState({ value: tempArray }, function() {
              //console.log(this.state.value);
            });
        }
      };
    
      addEditor = () => {
        let tempTextArray = this.state.value.slice();
        let tempTitleArray = this.state.title.slice();
        tempTextArray.push(Value.fromJSON(initialValue));
        tempTitleArray.push(Value.fromJSON(initialTitle));
        this.setState({ 
          value: tempTextArray, 
          title: tempTitleArray
        },function(){
          //console.log(this.state.value);
        });
      };
    
      removeEditor = (index) => {
        let tempTextArray = this.state.value.slice();
        let tempTitleArray = this.state.title.slice();
        tempTextArray.splice(index, 1);
        tempTitleArray.splice(index, 1);
        //console.log(index,tempArray);
        this.setState({ 
          value: tempTextArray, 
          title: tempTitleArray
        });
      };

      editorGenerator = () => {
        const valueArray = this.state.value.slice();
        const titleArray = this.state.title.slice();
        const editorArray = valueArray.map((value, index) => (
          <CustomEditor
            removeEditor={this.removeEditor}
            key={index}
            index={index}
            initValue={valueArray[index]}
            onChange={this.onChange}
            value={value}
            title={titleArray[index]}
          />
        ));
        return <div>{editorArray}</div>;
      };

      submitResume = async() => {
        const message = {
          username: this.props.userName,
          resumetitle: this.state.title,
          resume: this.state.value,
          datetime: this.getDateTime()
        }

        const fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        };
        
        await fetch('/submitresume', fetchOptions);
        console.log("resume sent");
        this.props.history.push('/chart');
      };

      getResume = async() => {
        const message = {
          username: this.props.userName,
        }

        const fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        };

        const response = await fetch('/getresume', fetchOptions);
        const data = await response.json();
        console.log(data);
        let tempValue = [];
        let tempTitle = [];
        if(data.result.resume && data.result.resumetitle.length){
          data.result.resume.map((value,index) => {
            tempValue[index] = Value.fromJSON(value);
          });
  
          data.result.resumetitle.map((value,index) => {
            tempTitle[index] = Value.fromJSON(value);
          });
        }
        this.setState({
          value: tempValue,
          title: tempTitle
        });
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

      render() {
        let editors = this.editorGenerator();
        return (
          <div>
            {editors}
            <button onClick={this.addEditor}>Add</button>
            <button onClick={this.submitResume}>Submit</button>
          </div>
        );
      }
}

export default EditorWrapper;