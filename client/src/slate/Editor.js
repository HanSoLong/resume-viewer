import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import { isKeyHotkey } from 'is-hotkey'
//import { Button, Icon, Toolbar } from '../components'

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/*const initValue = {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text.',
              },
            ],
          },
        ],
      },
    ],
  },
};

const initTitle = {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'Title',
              },
            ],
          },
        ],
      },
    ],
  },
};*/

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')


class RichTextExample extends React.Component {
constructor(props){
  super(props);
  this.state = {
    value: Value.fromJSON({
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: this.props.initValue.text,
                  },
                ],
              },
            ],
          },
        ],
      },
    }),

    title: Value.fromJSON({
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: this.props.initValue.title,
                  },
                ],
              },
            ],
          },
        ],
      },
    }),
  }
}
  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  changeTitle = ({value}) => {
    let actualTitle = value.toJSON().document.nodes[0].nodes[0].leaves[0].text;
    if(this.state.title.toJSON().document.nodes[0].nodes[0].leaves[0].text !== actualTitle){
      this.props.onChange('title',actualTitle,this.props.index);
    }
    this.setState({title: value})
  }

  onTextChange = ({ value }) => {
    let actualText = value.toJSON().document.nodes[0].nodes[0].leaves[0].text;
    if(this.state.value.toJSON().document.nodes[0].nodes[0].leaves[0].text !== actualText){
      this.props.onChange('text',actualText,this.props.index);
    }
    this.setState({ value })
  }

  removeEditor = () => {
    this.props.removeEditor(this.props.index);
  };

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }

  ref = editor => {
    this.editor = editor
  }

  render() {
    return (
      <div>
        <hr/>
        <Editor value={this.state.title} onChange={this.changeTitle}/>
        <hr/>
          {this.renderMarkButton('bold', 'bold')}
          {this.renderMarkButton('italic', 'italic')}
          {this.renderMarkButton('underlined', 'underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'quote')}
          {this.renderBlockButton('numbered-list', 'list_numbered')}
          {this.renderBlockButton('bulleted-list', 'list_bulleted')}
        <hr/>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onTextChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
        <hr/>
        <button onClick={this.removeEditor}>Delete</button>
      </div>
    )
  }

  renderMarkButton = (type, icon) => {
    return (
      <button
        onMouseDown={event => this.onClickMark(event, type)}
      >
        {icon}
      </button>
    )
  }

  renderBlockButton = (type, icon) => {

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
      }
    }

    return (
      <button
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        {icon}
      </button>
    )
  }

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
}

/**
 * Export.
 */

export default RichTextExample