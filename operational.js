const express = require('express');
const morgan = require('morgan');
var propertiesReader = require('properties-reader');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app=express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "http://xroad.neuquen.gov.ar";

app.set('port', PORT);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));




// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to Billing and Account APIs.');
 });


 // Proxy endpoints
app.use('/operational', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/operational`]: '',
    },
 }));


app.listen(app.get('port'), function (){
    console.log(`servidor iniciado en puerto ${app.get('port')}`);
});