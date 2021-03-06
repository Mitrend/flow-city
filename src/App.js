import React, { Component } from 'react'

import Utils from './Utils'

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
    machine:
        actions:
            -   action: 'click'
                element: "#js-forgot-password"

  "Enter Valid Credentials":
    result: "Dashboard" 
  "Enter Invalid Credentials":
    result:  "Show Errors"

'Forgot Password Popup':
  'Enter Email':
    result:  'Email Sent / Notify'
    machine: 
        wait: 2000
        actions:
            -   action: "sendKeys"
                element: "input[name='passwordEmail']"
                value: "mike@mitrend.com"
            -   action: "click"
                element: "#popup #rightAction"
                snapshot: "Filled in Form"
  'Cancel': 
    result: 'Root:Login View'
    machine: 
        actions:
            -   action: 'click'
                element: ".popup.icon-x"
  'Casdfsncel': 
    result: 'Root:Login View'

'Email Sent / Notify':
  'Clear Notify':
    result:  'Root:Login View'
    machine: 
        actions:
            -   action: 'click'
                element: "#popup .icon-x"

  `
}

export default class App extends Component {
  constructor () {
    super();

    this.state = {
      flows: flows,
      selected: 'login',
      yaml: flows.login,
      graph: Utils.yamlParse(flows.login)
    }
    
    fetch(url('/flows'))
    .then(res => res.json())
    .then(data => {
      let selected = Object.keys(data)[0];

      this.setState({
        selected,
        flows: data,
        yaml: data[selected],
        graph: Utils.yamlParse(data[selected])
      });
    })


    this.handleYamlChange = this.handleYamlChange.bind(this)
    this.handleMouseEnterLeave = this.handleMouseEnterLeave.bind(this);
    this.updateSelectedFlow = this.updateSelectedFlow.bind(this);
  }

  updateGraph () {
     this.setState({
      graph: Utils.yamlParse(this.state.flows[this.state.selected])
    })
  }

  updateSelectedFlow (key) {
    this.setState({
      selected: key,
      graph: Utils.yamlParse(this.state.flows[key])
    });
  }

  handleYamlChange (yamlString) {

    try {
      let newFlows = {...this.state.flows, [this.state.selected]: yamlString };
      this.setState({ flows: newFlows });

      let parsed = Utils.yamlParse(yamlString);
      this.setState({ graph: parsed });
        
      // Update backend
      fetch(url(`/flows/${this.state.selected}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: yamlString })
      });
    } catch (err) {
      console.warn(`Error parsing on line: ${err.mark.line}: ${err.message}`);
    }
   
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
