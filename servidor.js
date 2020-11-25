const express = require('express');
const morgan = require('morgan');
const { Client } = require('pg');

const app=express();

app.set('port', 3000);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());





const client = new Client({
    user: 'messagelog',
    host: 'localhost',
    database: 'messagelog',
    password: 'JZZQHJwrL1fT4yFCgeGYf4zX8tWKbECk',
    port: 5432,
});

client.connect();

app.get('/', function( req, result) {

    const query = `
    SELECT timezone('art'::text, to_timestamp((logrecord."time" / 1000)::double precision)) AS fecha,
    xpath('/SOAP-ENV:Envelope/SOAP-ENV:Body//request/*'::text, logrecord.message::xml, '{{s,http://schemas.xmlsoap.org/soap/envelope/},{h,http://x-road.eu/xsd/xroad.xsd},{tns,http://thinknet.x-road.eu/producer/},{SOAP-ENV,http://schemas.xmlsoap.org/soap/envelope/}}'::text[])::text AS request,
    (xpath('/SOAP-ENV:Envelope/s:Header/h:service/a:memberClass/text()'::text, logrecord.message::xml, '{{s,http://schemas.xmlsoap.org/soap/envelope/},{h,http://x-road.eu/xsd/xroad.xsd},{a,http://x-road.eu/xsd/identifiers},{SOAP-ENV,http://schemas.xmlsoap.org/soap/envelope/}}'::text[]))[1] AS service_memberclass,
    (xpath('/SOAP-ENV:Envelope/s:Header/h:service/a:memberCode/text()'::text, logrecord.message::xml, '{{s,http://schemas.xmlsoap.org/soap/envelope/},{h,http://x-road.eu/xsd/xroad.xsd},{a,http://x-road.eu/xsd/identifiers},{SOAP-ENV,http://schemas.xmlsoap.org/soap/envelope/}}'::text[]))[1] AS service_membercode,
    (xpath('/SOAP-ENV:Envelope/s:Header/h:service/a:subsystemCode/text()'::text, logrecord.message::xml, '{{s,http://schemas.xmlsoap.org/soap/envelope/},{h,http://x-road.eu/xsd/xroad.xsd},{a,http://x-road.eu/xsd/identifiers},{SOAP-ENV,http://schemas.xmlsoap.org/soap/envelope/}}'::text[]))[1] AS service_subsystemcode,
    logrecord.memberclass AS client_memberclass,
    logrecord.membercode AS client_membercode,
    logrecord.subsystemcode AS client_subsystemcode,
    (xpath('/SOAP-ENV:Envelope/s:Header/h:userId/text()'::text, logrecord.message::xml, '{{s,http://schemas.xmlsoap.org/soap/envelope/},{h,http://x-road.eu/xsd/xroad.xsd},{a,http://x-road.eu/xsd/identifiers},{SOAP-ENV,http://schemas.xmlsoap.org/soap/envelope/}}'::text[]))[1] AS userid,
    logrecord.response
   FROM logrecord
  WHERE logrecord.discriminator::text = 'm'::text 
  order by id desc limit 10
        `;

    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            result.send( {"error":err.toString()} );
            return;
        }
        else
        if (res.rows)
        {
            result.send( res.rows);
        }

        /*for (let row of res.rows) {
            console.log(row);
        }*/



        client.end();
    });

    //res.send( {"hola":"algo"} );
});

app.listen(app.get('port'), function (){
    console.log(`servidor iniciado en puerto ${app.get('port')}`);
});