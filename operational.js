const express = require('express');
const morgan = require('morgan');
const url = require('url');
const PropertiesReader = require('properties-reader');

const prop = PropertiesReader('operational.properties');


const app=express();


// Configuration
const PORT = 3000;
const HOST = "localhost";


app.set('port', PORT);

app.use(morgan('dev'));
//app.use(express.urlencoded({extended:false}));




// Info GET endpoint
app.get('/operational', (req, res, next) => {

    var data = `<?xml version="1.0" encoding="utf-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:xroad="http://x-road.eu/xsd/xroad.xsd" 
    xmlns:om="http://x-road.eu/xsd/op-monitoring.xsd" 
    xmlns:id="http://x-road.eu/xsd/identifiers"> 
  <SOAP-ENV:Header> 
    <xroad:client id:objectType="SUBSYSTEM">
      <id:xRoadInstance>XROAD-INSTANCE</id:xRoadInstance> 
      <id:memberClass>MEMBER-CLASS</id:memberClass> 
      <id:memberCode>MEMBER-CODE</id:memberCode> 
      <id:subsystemCode>SUBSYSTEM-CODE</id:subsystemCode> 
    </xroad:client> 
    <xroad:service id:objectType="SERVICE">
 <id:xRoadInstance>XROAD-INSTANCE</id:xRoadInstance> 
      <id:memberClass>MEMBER-CLASS</id:memberClass> 
      <id:memberCode>MEMBER-CODE</id:memberCode> 
      <id:serviceCode>getSecurityServerOperationalData</id:serviceCode> 
    </xroad:service> 

    <xroad:id>203a9070-d07f-455f-93a2-87bb4e079102</xroad:id> 
    <xroad:userId>CATALOGO</xroad:userId> 
    <xroad:protocolVersion>4.0</xroad:protocolVersion> 
  </SOAP-ENV:Header> 
  <SOAP-ENV:Body> 
    <om:getSecurityServerOperationalData> 
      <om:searchCriteria> 
        <om:recordsFrom>1600000000</om:recordsFrom> 
        <om:recordsTo>1700000000</om:recordsTo> 
      </om:searchCriteria> 
    </om:getSecurityServerOperationalData> 
  </SOAP-ENV:Body> 
</SOAP-ENV:Envelope>`;

const http = require('http');

let recordsFrom = req.query.recordsFrom;
let recordsTo = req.query.recordsTo;
let xRoadInstance = req.query.xRoadInstance;
let memberClass = req.query.memberClass;
let memberCode = req.query.memberCode;
let subsystemCode = req.query.subsystemCode;

data = data.replace('1600000000', recordsFrom);
data = data.replace('1700000000', recordsTo);

data = data.replaceall('XROAD-INSTANCE', xRoadInstance);
data = data.replaceall('MEMBER-CLASS', memberClass);
data = data.replaceall('MEMBER-CODE', memberCode);
data = data.replace('SUBSYSTEM-CODE', subsystemCode);



console.log(data);

console.log( req.query);
//console.log( recordsFrom, recordsTo);

//var puertostr = prop.get('opciones.puerto');
var host = prop.get('opciones.host');

console.log( host );

var options = {
  host: host,
  path: '/',
  //since we are listening on a custom port, we need to specify it by hand
  port: '80',
  //This is what changes the request to a POST request
  method: 'POST'
     
  
};

callback = function(response) {
  var data = [ ];

  response.on('data', function (chunk) {
    data.push(chunk);
    //console.log("chunk:" + data.contentType);
  });

  response.on('end', function () {
    var binary = Buffer.concat(data);
    res.send(binary);
    res.contentType = response.contentType;

  });
}

var req1 = http.request(options, callback);
req1.setHeader("Content-Type","text/xml");
//This is the data we are posting, it needs to be a string or a buffer
req1.write(data);
req1.end();

    });

    app.listen(app.get('port'), function (){
        console.log(`servidor iniciado en puerto ${app.get('port')}`);
    })