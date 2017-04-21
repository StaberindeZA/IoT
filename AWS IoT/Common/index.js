console.log('Loading function');

const https = require('https');
const url = require('url');
const slack_url = 'https://hooks.slack.com/services/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';
const slack_req_opts = url.parse(slack_url);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {
    'Content-Type': 'application/json'
};

exports.handler = function(event, context) {
    
    // Load the message passed into the Lambda function into a JSON object 
    var eventText = JSON.stringify(event, null, 2);
    
    // Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
    console.log("Received event:", eventText);
    
    var text_msg;
    
    if(event.clickType === 'SINGLE'){
        text_msg = 'Washing Machine - BUSY';
    } else if(event.clickType === 'DOUBLE'){
        text_msg = 'Washing Machine - EMPTY';
    } else if(event.clickType === 'LONG') {
        text_msg = '<!channel> Washing Machine needs attention.';  
    } else {
        text_msg = '<!channel> No click';
    }


	var req = https.request(slack_req_opts, function(res) {
        if (res.statusCode === 200) {
            context.succeed('posted to slack');
        } else {
            context.fail('status code: ' + res.statusCode);
        }
    });

    var subject = 'Subject';

    var params = {
        attachments: [{
            fallback: text_msg,
            pretext: subject,
            color: "#D00000",
            fields: [{
                "value": text_msg,
                "short": false
            }]
        }]
    };
    
    var json = {
        "text": text_msg
    };
    
    req.write(JSON.stringify(json));

    req.end();
    
};