import React, { Component } from 'react'

import yamlParse from './yamlParse'

import FlowChart from './FlowChart'
import Editor from './Editor'
import FlowSelector from './FlowSelector'
import TestCaseList from './TestCaseList'


var LOGIN = `
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
`;

var REGISTER = `
"Root:Register View":
  "Do Something":
    result: "Something Happened"
    human: >
      You did something
    machine: >
      click #something
`;

const flows = { LOGIN, REGISTER }


export default class App extends Component {
  constructor () {
    super();
    

    this.state = {
      flows: flows,
      selected: 'LOGIN',
      yaml: flows.LOGIN,
      graph: yamlParse(flows.LOGIN)
    }

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
