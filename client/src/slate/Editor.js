import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "slate-react";
import { Value } from "slate";

const initString = "A line of text !";

// Define our app...
export default class SlateEditor extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: [],
    counter: 0
  };

  componentWillMount() {
    let tempArray = this.state.value.slice();
    tempArray.push(initString);
    this.setState({ value: tempArray }, function() {
      console.log(this.state.value);
    });
  }

  // On change, update the app's React state with the new editor value.
  onChange = (value, index) => {
    let tempArray = this.state.value.slice();
    tempArray[index] = value;
    this.setState({ value: tempArray }, function() {
      console.log(this.state.value);
    });
  };

  addEditor = () => {
    let tempArray = this.state.value.slice();
    tempArray.push(initString);
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
      <EditorWrapper
        removeEditor={this.removeEditor}
        key={index}
        index={index}
        initValue={initString}
      />
    ));
    return <div>{editorArray}</div>;
  };

  // Render the editors.
  render() {
    return (
      <div>
        {this.editorGenerator()}
        <button onClick={this.addEditor}>Add</button>
      </div>
    );
  }
}

class EditorWrapper extends React.Component {
  constructor(props) {
    super(props);
    const init = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: this.props.initValue
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: init };
  }

  onChange = ({ value }) => {
    this.setState({ value: value });
    console.log(
      this.state.value.toJSON().document.nodes[0].nodes[0].leaves[0].text
    );
    this.props.onChange(value, this.props.index);
  };

  removeEditor = () => {
    this.props.removeEditor(this.props.index);
  };

  render() {
    //console.log(this.props.index);
    return (
      <div>
        <Editor value={this.state.value} onChange={this.onChange} />
        <button onClick={this.removeEditor}>Del</button>
      </div>
    );
  }
}