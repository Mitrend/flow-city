var fs = require("fs");
var utils = require('src/Utils.js');

casper.options.waitTimeout = 10000;

if(!casper.cli.has("flowpath")){
    casper.echo("option flowpath is required, specify as --flowpath=<path>")    
    casepr.exit();
}
if(!casper.cli.has("url")){
    casper.echo("option url is required, specify as --url=<url>"); 
    casepr.exit();
}

var generateMissing = casper.cli.has("generateMissingSnapshots");
var generateScreenshots = casper.cli.has("generateScreenshots");
var acceptSnapshot;
if(casper.cli.has("acceptSnapshot")){
    acceptSnapshot = casper.cli.get("acceptSnapshot");
    casper.echo("Accepting snaphsot"+acceptSnapshot);
}

var acceptAllSnapshots  = casper.cli.has("acceptAllSnapshots");
    
var dir = casper.cli.get("flowpath");
var url = casper.cli.get("url");
var pageElement = casper.cli.has("pageElement") ? casper.cli.get("pageElement") : "#pageView";

var list = fs.list(dir);
list.forEach(function(file){
    if(file.indexOf('.yaml') >= 0){
        var name = file.replace('.yaml','');
        var yamlText = fs.read(dir+file);
        var graph = utils.yamlParse(yamlText);
        var paths = utils.walk(graph);
        var i = 1;
        paths.forEach(function(path){
            var testCaseName = name+'-path-'+i;
            i++;
            try{
                runTest({
                    name: testCaseName,
                    actions: utils.generateTestCase(path)
                },dir+name+'/');
            }catch(err){
                casper.test.begin(testCaseName, 1, function (test) {
                    test.fail(err);
                });
            }
        });
    }
});
    



function runTest(testCase,dir) {
    var snapshots = 0;

    testCase.actions.forEach(function (step) {
        if (step.snapshot) {
            snapshots++;
        }
        if (step.perform) {
            step.perform.forEach(function (actionStep) {
                if (actionStep.snapshot) {
                    snapshots++;
                }
            });
        }
    });
    casper.test.begin(testCase.name, snapshots, function (test) {

        casper.start(url, function () {
            casper.waitForSelector(pageElement, function () {
                casper.wait(500, function () {
                    // casper.echo('Page Intialized');
                    nextStep();
                });
            });
        });



        function nextStep() {
            var step = testCase.actions[0];
            testCase.actions.splice(0, 1);
            if (step) {
                if (step.perform) {
                    step.perform.forEach(function (actionStep) {
                        if (actionStep.snapshot) {
                            snapshot(actionStep.snapshot);
                        }
                        switch (actionStep.action) {
                            case 'click':
                                casper.click(actionStep.element);
                                //casper.echo('Clicked' + actionStep.element);
                                break;
                            case 'sendKeys':
                                casper.sendKeys(actionStep.element, actionStep.value);
                            //casper.echo('sentKeys' + actionStep.element + actionStep.value);
                        }
                    });
                }
                if (step.snapshot) {
                    snapshot(step.snapshot);
                }

                if (step.waitWhileVisible) {
                    casper.waitWhileVisible(step.waitWhileVisible, function () {
                        casper.wait(step.wait || 500, function () {
                            nextStep();
                        });
                    });
                } else if (step.waitUntilVisible) {
                    casper.waitUntilVisible(step.waitUntilVisible, function () {
                        casper.wait(step.wait || 500, function () {
                            nextStep();
                        });
                    });
                } else {
                    casper.wait(step.wait || 500, function () {
                        nextStep();
                    });
                }
            }
        }

        function generateScreenshot(filename){
            casper.echo("Generating screenshot "+filename);
            casper.capture(filename, {
                top: 0,
                left: 0,
                width: 1200,
                height: 800
            });
            
        }
        function snapshot(name) {
            name = name.replace(/[:"\\/\s]/g,"");
            var currentHtml = casper.getHTML(pageElement);
            var htmlSnapshot;
            var snapshotfile = dir+name + '.snapshot';
            var screenshotfile = dir+name + '.png';
            try {
                htmlSnapshot = fs.read(snapshotfile);
                if (htmlSnapshot !== currentHtml && (acceptSnapshot === name || acceptAllSnapshots)) {
                    casper.echo("Accepting snapshot "+name);
                    fs.write(snapshotfile, casper.getHTML(pageElement), 'w');
                    htmlSnapshot = fs.read(snapshotfile);
                    if(generateScreenshots){
                        generateScreenshot(screenshotfile);
                    }
                }
                if(generateScreenshots && !fs.exists(screenshotfile)){
                    generateScreenshot(screenshotfile);
                }
            } catch (err) {
                if(generateMissing){
                    fs.write(dir+name + '.snapshot', casper.getHTML(pageElement), 'w');
                    htmlSnapshot = fs.read(dir+name + '.snapshot');
                    if(generateScreenshots){
                       generateScreenshot(screenshotfile);
                    }
                }else{
                    casper.echo(err);
                }
            }
            test.assertEquals(currentHtml, htmlSnapshot, name);     
        }

        casper.on('error', function (msg, backtrace) {
            this.echo(msg);
        });
        casper.on('page.error', function (msg, backtrace) {
            this.echo('page.error' + msg);
        });

        casper.on('remote.message', function (msg, backtrace) {
            //this.echo('console:'+msg);
        });
        casper.run(function () {
            //this.echo("Done");
            test.done();
        });
    });
}
