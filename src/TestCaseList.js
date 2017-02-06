import React from 'react';
import Utils from './Utils';


export default function TestCaseList ({ graph={}, onMouse }) {

	var paths = Utils.walk(graph);
	
	return (
		<div style={{ paddingLeft: '20px'}}>
			<h3>Paths</h3>
			{ 
				paths.map((path,i) => {
					return (
						<div key={i} onMouseEnter={evt => onMouse(evt.type, path)} onMouseLeave={evt => onMouse(evt.type, path)}>
							<hr />
							<ul>
								{ path
									.filter(val => val.type === 'action')
									.map((val,i) => <li key={i}>{val.human || val.name } </li>) }
							</ul>
						</div>
					);
				})
			}
		</div>
	)
}