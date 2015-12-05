/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var EventEmitter = require('eventemitter3');
var emitter = new EventEmitter();

var rx = function(req, res) {
  if(req.query.api_key === process.env.API_KEY){
    var data = req.body;
    emitter.emit('pullRequest', data);
  }
  res.end();
};

var tx = function(req, res) {
  res.writeHead(200, {
    'Content-Type':   'text/event-stream',
    'Cache-Control':  'no-cache',
    'Connection':     'keep-alive'
  });

  // Heartbeat
  var nln = () => res.write('\n');
  var hbt = setInterval(nln, 15000);

  var onPullRequest = (data) => {
    res.write("retry: 500\n");
    res.write(`event: pullRequest\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on('pullRequest', onPullRequest);

  // Clear heartbeat and listener
  req.on('close', () => {
    clearInterval(hbt);
    emitter.removeListener('pullRequest', onPullRequest);
  });
};

module.exports = {
  rx: rx,
  tx: tx
};
