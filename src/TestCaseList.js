import React from 'react';

export default function TestCaseList ({ graph={}, onMouse }) {

	function walk (node, path = [], basket = []) {
		var fork = path.slice(0);

		fork.push(node);
		
		if (!node.children) {
			basket.push(fork);
			return basket;
		}

		node.children.forEach(child => walk(child, fork, basket));
		return basket;
	}

	var paths = walk(graph);
	
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