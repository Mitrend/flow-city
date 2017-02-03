import React from 'react';

export default function FlowSelector ({ selected, flows, onSelected }) {

	return (
		<div>
			<select value={selected} onChange={evt => onSelected(evt.target.value)}>
				{ 
					Object.keys(flows)
					.map((flow, i) => <option key={flow}>{flow}</option> ) 
				}
			</select>
		</div>
	)
}