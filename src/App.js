import React, { Component } from 'react'

import yamlParse from './yamlParse'

import FlowChart from './FlowChart'
import Editor from './Editor'
import TestCaseList from './TestCaseList'


var starting = `
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

export default class App extends Component {
  constructor () {
    super();

    this.state = {
      yaml: starting,
      graph: yamlParse(starting)
    }

    this.handleYamlChange = this.handleYamlChange.bind(this)
  }

  handleYamlChange (yamlString) {
    this.setState({
      yaml: yamlString,
      graph: yamlParse(yamlString)
    })
  }

  render () {
    return (
      <div>
        <div style={{ display: 'flex'}}>
          <div style={{ flex: 2, overflow: 'auto' }}>
            <div>
              <FlowChart graph={this.state.graph} />
              <Editor onChange={this.handleYamlChange} yaml={this.state.yaml} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <TestCaseList graph={this.state.graph} />
          </div>
        </div>
      </div>
    )
  }

}
