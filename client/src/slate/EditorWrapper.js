import React from "react";
import CustomEditor from './Editor'

const initText = {
    title: 'Title',
    text: 'A line of text'
}

class EditorWrapper extends React.Component{
    state = {
        value: [],
        serverValue: []
      };
    
      /*componentWillMount() {
        let tempArray = this.state.value.slice();
        tempArray.push(initString);
        this.setState({ value: tempArray }, function() {
          console.log(this.state.value);
        });
      }*/
    
      // On change, update the app's React state with the new editor value.
      onChange = (flag, value, index) => {
        let tempArray = this.state.value.slice();
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
        tempArray.push(initText);
        console.log(this.state.value.length);
        this.setState({ value: tempArray });
      };
    
      removeEditor = () => {
        let tempArray = this.state.value.slice();
        tempArray.splice(0, 1);
        console.log(this.state.value.length);
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

      render() {
        return (
          <div>
            {this.editorGenerator()}
            <button onClick={this.addEditor}>Add</button>
          </div>
        );
      }
}

export default EditorWrapper;