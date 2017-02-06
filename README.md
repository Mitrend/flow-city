## Running Tests

### Prerequisites
npm install
npm install -g phantomjs

### Basic Usage
node_modules/casperjs/bin/casperjs test runCasperTest.js --disk-cache=yes --flowpath=<flow path dir> --url=<url app is running on>

### Generate Snapshots
node_modules/casperjs/bin/casperjs test runCasperTest.js --disk-cache=yes --flowpath=<flow path dir> --url=<url app is running on> --generateMissingSnapshots

### Generate Screenshots
node_modules/casperjs/bin/casperjs test runCasperTest.js --disk-cache=yes --flowpath=<flow path dir> --url=<url app is running on> --generateScreenshots

### Accept Snapshots
node_modules/casperjs/bin/casperjs test runCasperTest.js --disk-cache=yes --flowpath=<flow path dir> --url=<url app is running on> --acceptSnapshot=<snapshotName>

### Accept All Snapshots
node_modules/casperjs/bin/casperjs test runCasperTest.js --disk-cache=yes --flowpath=<flow path dir> --url=<url app is running on> --acceptAllSnapshots

### Output to junit xml
node_modules/casperjs/bin/casperjs test runCasperTest.js --disk-cache=yes --flowpath=<flow path dir> --url=<url app is running on> --xunit=xunit.xml

### Notes
disk-cache=yes is required to suppress a warning(seems to be related to loading font files)