import React from 'react';

export default function Editor ({ yaml, onChange }) {
	return (
		<textarea value={yaml} style={{ height: '300px'}} onChange={evt => onChange(evt.target.value)}>
		</textarea>
	)
}