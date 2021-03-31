const express = require('express');
const morgan = require('morgan');

const app=express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "http://xroad.neuquen.gov.ar";

app.set('port', PORT);

app.use(morgan('dev'));
//app.use(express.urlencoded({extended:false}));




// Info GET endpoint
app.get('/operational', (req, res, next) => {

    const data = `<?xml version="1.0" encoding="utf-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:xroad="http://x-road.eu/xsd/xroad.xsd" 
    xmlns:om="http://x-road.eu/xsd/op-monitoring.xsd" 
    xmlns:id="http://x-road.eu/xsd/identifiers"> 
  <SOAP-ENV:Header> 
    <xroad:client id:objectType="SUBSYSTEM">
      <id:xRoadInstance>roksnet</id:xRoadInstance> 
      <id:memberClass>GOV</id:memberClass> 
      <id:memberCode>71111229</id:memberCode> 
      <id:subsystemCode>GP-OPTIC</id:subsystemCode> 
    </xroad:client> 
    <xroad:service id:objectType="SERVICE">
 <id:xRoadInstance>roksnet</id:xRoadInstance> 
      <id:memberClass>GOV</id:memberClass> 
      <id:memberCode>71111229</id:memberCode> 
      <id:serviceCode>getSecurityServerOperationalData</id:serviceCode> 
    </xroad:service> 

    <xroad:id>203a9070-d07f-455f-93a2-87bb4e079102</xroad:id> 
    <xroad:userId>CATALOGO</xroad:userId> 
    <xroad:protocolVersion>4.0</xroad:protocolVersion> 
  </SOAP-ENV:Header> 
  <SOAP-ENV:Body> 
    <om:getSecurityServerOperationalData> 
      <om:searchCriteria> 
        <om:recordsFrom>1603326249</om:recordsFrom> 
        <om:recordsTo>1700000000</om:recordsTo> 
      </om:searchCriteria> 
    </om:getSecurityServerOperationalData> 
  </SOAP-ENV:Body> 
</SOAP-ENV:Envelope>`;

const http = require('http');

//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: '127.0.0.1',
  path: '/',
  //since we are listening on a custom port, we need to specify it by hand
  port: '80',
  //This is what changes the request to a POST request
  method: 'POST'
     
  
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
    res.send(str);
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