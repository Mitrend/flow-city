var casper = require('casper').create({
    verbose:true
});

casper.start('http://localhost:3333/');


var actions = [
	{
		"snapshot": "Root:Login View"
	},
	{
		"perform": [
			{
				"action": "click",
				"element": "#js-forgot-password"
			}
		]
	},
	{
		"snapshot": "Forgot Password Popup"
	},
	{
		"perform": [
			{
				"action": "sendKeys",
				"element": "input[name='passwordEmail']",
				"value": "mike@mitrend.com"
			},
			{
				"action": "click",
				"element": "#popup #rightAction",
				"snapshot": "Filled in Form"
			}
		],
		"wait": 2000
	},
	{
		"snapshot": "Email Sent / Notify"
	},
	{
		"perform": [
			{
				"action": "click",
				"element": "#popup .icon-x"
			}
		]
	},
	{
		"snapshot": "ref(Root:Login View)"
	}
];

casper.waitForSelector("#pageView", function () {
    this.echo('Selector Intialized');
    casper.wait(500, function () {
        this.echo('Page Intialized');
        nextStep(this);
    });
});

function nextStep(aCasper){
    var step = actions[0];
    actions.splice(0,1);
    if(step){
        if (step.perform) {
            step.perform.forEach(function(actionStep) {
                if(actionStep.snapshot){
                    aCasper.evaluate(function(selector) {
                        document.querySelector(selector).style = "border: solid 1px black";
                    },actionStep.element);
                    snapshot(aCasper, actionStep.snapshot);
                }
                switch (actionStep.action) {
                    case 'click':
                        aCasper.click(actionStep.element);
                        aCasper.echo('Clicked'+actionStep.element);
                        break;
                    case 'sendKeys':
                        aCasper.sendKeys(actionStep.element, actionStep.value);
                        aCasper.echo('sentKeys'+actionStep.element+actionStep.value);
                }    
            });
        }
        if (step.snapshot) {
            snapshot(aCasper, step.snapshot);
        }

        if(step.waitWhileVisible){
            aCasper.waitWhileVisible(step.waitWhileVisible,function(){
                aCasper.wait(step.wait || 500,function(){
                    nextStep(this);
                });
            });
        }else if(step.waitUntilVisible){
            aCasper.waitUntilVisible(step.waitUntilVisible,function(){
                aCasper.wait(step.wait || 500,function(){
                    nextStep(this);
                });
            });
        }else{
            aCasper.wait(step.wait || 500,function(){
                nextStep(aCasper);
            });
        }
    }
}




var sCount=0;
function snapshot(aCasper, name) {
    name=name.replace(':', '').replace('"','').replace("\\",'').replace("/",'');
    aCasper.echo('Taking screenshot'+name);
    sCount++;
    casper.capture(sCount+name + '.png', {
        top: 0,
        left: 0,
        width: 1200,
        height: 800
    });
}


casper.on('run.complete', function() {
    this.echo('Test completed');
    this.exit();
});
casper.on('error', function(msg,backtrace) {
  this.echo(msg);
  this.exit();
});

casper.run();
