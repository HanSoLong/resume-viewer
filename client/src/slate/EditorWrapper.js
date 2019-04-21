import React from "react";
import CustomEditor from './Editor';

class EditorWrapper extends React.Component{
    state = {
        value: [],
      };
    
      componentWillMount() {
        this.getResume();
      }
    
      onChange = (flag, value, index) => {
        let tempArray = this.state.value.slice();
        console.log("index: ",index)
        if(flag === 'text'){
            tempArray[index].text = value;
        }else if(flag === 'title'){
            tempArray[index].title = value;
        }
        this.setState({ value: tempArray }, function() {
          console.log(this.state.value);
        });
      };
    
      addEditor = () => {
        let tempArray = this.state.value.slice();
        let tempInit = {
          title: "Title",
          text: "A line of text"
        }
        tempArray.push(tempInit);
        this.setState({ value: tempArray },function(){
          console.log(this.state.value);
        });
      };
    
      removeEditor = (index) => {
        let tempArray = this.state.value.slice();
        tempArray.splice(index, 1);
        console.log(index,tempArray);
        this.setState({ value: tempArray });
      };

      editorGenerator = () => {
        const valueArray = this.state.value.slice();
        const editorArray = valueArray.map((value, index) => (
          <CustomEditor
            removeEditor={this.removeEditor}
            key={index}
            index={index}
            initValue={valueArray[index]}
            onChange={this.onChange}
          />
        ));
        return <div>{editorArray}</div>;
      };

      submitResume = async() => {
        const message = {
          username: this.props.userName,
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
        console.log("resume sent")
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
        data.result.resume.map((value,index) => {
          tempValue[index] = value;
        });
        this.setState({value: tempValue});
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