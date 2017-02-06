var jsyaml = require('js-yaml');


function yamlParse(yamlString) {

	var json = jsyaml.load(yamlString);
    var keys = Object.keys(json);
    var baseKey;
    
    keys.forEach(function(k){ 
        if(k.indexOf('Root') === 0){
            baseKey = k;
        }
    });
	var base = json[baseKey];

	var visited = [];

	function transform (key, node, viewDepth) {
        viewDepth = viewDepth || 1;
		if (visited.indexOf(key) >= 0) {
			return { name: 'ref('+key+')', type: 'view', viewDepth: viewDepth };
		}

		visited.push(key);
        
		return {
			name: key,
			type: 'view',
			viewDepth:viewDepth,
			children: node && Object.keys(node)
                                .map(function(action)  {
									return { 
										name: action, 
										type: 'action', 
										viewDepth:viewDepth,
										human: node[action].human,
										machine: node[action].machine,
										children: [ transform(node[action].result, json[node[action].result], viewDepth + 1) ] 
									};
								})
		};
	}


	var root = transform(baseKey, base);
	
	return root;
}

function walk (node, path, basket) {
    path = path || [];
    basket = basket || [];
    var fork = path.slice(0);

    fork.push(node);
    
    if (!node.children) {
        basket.push(fork);
        return basket;
    }

    node.children.forEach(function(child){ walk(child, fork, basket);});
    return basket;
}

function generateTestCase(path){
    var automatedPath = [];
    path.forEach(function(step){
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
    return automatedPath;
}

module.exports = {
    yamlParse : yamlParse,
    generateTestCase: generateTestCase,
    walk: walk
};