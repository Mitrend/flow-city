import React from 'react';

export default function TestCaseList ({ graph }) {

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

	function generateAutomatedTest(path){
		var automatedPath = [];
		path.forEach(step=>{
			if(step.type === 'view'){
				automatedPath.push({
					snapshot: step.name,
					wait: step.machine ? step.machine.wait : undefined
				});
			}else if(step.type === 'action'){
				if(step.machine){
					automatedPath.push({
						perform: step.machine.actions,
						wait: step.machine.wait
					});
				}else{
					throw new Error('Need to define machine step for '+step.name);
				}	
			}
		});
		document.addEventListener('copy', function (e) {
			e.preventDefault();
			if (e.clipboardData) {
				e.clipboardData.setData('Text', JSON.stringify(automatedPath, null, '\t'));
			} else if (window.clipboardData) {
				window.clipboardData.setData('Text', JSON.stringify(automatedPath, null, '\t'));
			}
			alert('On clipboard');
		});
		document.execCommand('copy');
		
	}

	var paths = walk(graph);
	return (
		<div style={{ paddingLeft: '20px'}}>
			<h3>Paths</h3>
			{ 
				paths.map((path,i) => {
					return (
						<div key={i}>
							<hr />
							<ul>
								{ path
									.filter(val => val.type === 'action')
									.map((val,i) => <li key={i}>{val.human || val.name } </li>) }
							</ul>
							<button onClick={() => generateAutomatedTest(path)}>Generate Automated Test</button>
						</div>
					);
				})
			}
		</div>
	)
}