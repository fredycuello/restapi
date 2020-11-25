const express = require('express');
const morgan = require('morgan');
const { Client } = require('pg');

const app=express();

app.set('port', 3000);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());






app.get('/', function( req, result) {

    const query = `
    select requests.id, responses.id as respid, requests.message, responses.message as respmessage, requests.* from 
    logrecord requests left join logrecord responses on requests.timestamprecord = responses.timestamprecord
    where requests.response = false and responses.response = true
    
    order by id desc
    limit 10
        `;

    const client = new Client({
            user: 'messagelog',
            host: 'localhost',
            database: 'messagelog',
            password: 'JZZQHJwrL1fT4yFCgeGYf4zX8tWKbECk',
            port: 5432,
        });
        
    client.connect();
        

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