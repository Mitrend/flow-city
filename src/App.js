import React, { Component } from 'react'

import yamlParse from './yamlParse'

import FlowChart from './FlowChart'
import Editor from './Editor'
import FlowSelector from './FlowSelector'
import TestCaseList from './TestCaseList'

function url (path) {
  return `http://localhost:7000${path}`;
}

// dummy in case the server fails

let flows = {
  'login': `
"Root:Login View":
  "Click Forgot Password": 
    result: "Forgot Password Popup"
    human: >
      Just click on the forgot password button....
    machine: >
      click #forgotPassword

  "Enter Valid Credentials":
    result: "Dashboard" 
  "Enter Invalid Credentials":
    result:  "Show Errors"

'Forgot Password Popup':
  'Enter Email':
    result:  'Email Sent / Notify'
  'Cancel': 
    result: 'Root:Login View'
  'Casdfsncel': 
    result: 'Root:Login View'

'Email Sent / Notify':
  'Clear Notify':
    result:  'Root:Login View'

  `
}

export default class App extends Component {
  constructor () {
    super();

    this.state = {
      flows: flows,
      selected: 'login',
      yaml: flows.login,
      graph: yamlParse(flows.login)
    }
    
    fetch(url('/flows'))
    .then(res => res.json())
    .then(data => {
      let selected = Object.keys(data)[0];

      this.setState({
        selected,
        flows: data,
        yaml: data[selected],
        graph: yamlParse(data[selected])
      });
    })


    this.handleYamlChange = this.handleYamlChange.bind(this)
    this.handleMouseEnterLeave = this.handleMouseEnterLeave.bind(this);
    this.updateSelectedFlow = this.updateSelectedFlow.bind(this);
  }

  updateGraph () {
     this.setState({
      graph: yamlParse(this.state.flows[this.state.selected])
    })
  }

  updateSelectedFlow (key) {
    this.setState({
      selected: key,
      graph: yamlParse(this.state.flows[key])
    });
  }

  handleYamlChange (yamlString) {
    let newFlows = {...this.state.flows, [this.state.selected]: yamlString };
    this.setState({
      flows: newFlows,
      graph: yamlParse(newFlows[this.state.selected])
    });

    // Update backend
    fetch(url(`/flows/${this.state.selected}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: yamlString })
    });
  }

  handleMouseEnterLeave (type, list) {
    if (type === 'mouseenter') {
      this.setState({
        hoverPath: list
      });
    } else {
      this.setState({
        hoverPath: null
      })
    }
  }

  render () {
    return (
      <div>
        <FlowSelector selected={this.state.selected} flows={this.state.flows} onSelected={this.updateSelectedFlow} />
        <div style={{ display: 'flex'}}>
          <div style={{ flex: 2, overflow: 'auto' }}>
            <div>
              <FlowChart graph={this.state.graph} hoverPath={this.state.hoverPath} />
              <Editor onChange={this.handleYamlChange} yaml={this.state.flows[this.state.selected]} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <TestCaseList graph={this.state.graph} onMouse={this.handleMouseEnterLeave} />
          </div>
        </div>
      </div>
    )
  }

}
