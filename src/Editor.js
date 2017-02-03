import React from 'react';
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/lib/codemirror.css'

export default function Editor ({ yaml, onChange }) {

	const options = {
		mode: 'yaml',
		lineNumbers: true,
		foldGutter: true
	};

	return (
		<CodeMirror value={yaml} options={options} onChange={onChange} />
		// <textarea value={yaml} style={{ height: '300px'}} onChange={evt => onChange(evt.target.value)}>
		// </textarea>
	)
}