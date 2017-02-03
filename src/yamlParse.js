import jsyaml from 'js-yaml';
// import md5 from './blu'

export default function yamlParse(yamlString) {

	var json = jsyaml.load(yamlString);

	var baseKey = Object.keys(json).find(k => k.indexOf('Root') === 0);
	var base = json[baseKey]

	var visited = [];

	function transform (key, node, viewDepth = 1) {
		if (visited.indexOf(key) >= 0) {
			return { name: `ref(${key})`, type: 'view', viewDepth }
		}

		visited.push(key);

		console.log(node);

		return {
			name: key,
			type: 'view',
			viewDepth,
			children: node && Object.keys(node)
								.map(action => {
									return { 
										name: action, 
										type: 'action', 
										viewDepth,
										human: node[action].human,
										machine: node[action].machine,
										children: [ transform(node[action].result, json[node[action].result], viewDepth + 1) ] 
									};
								})
		}
	}


	var root = transform(baseKey, base);
	
	return root;
}