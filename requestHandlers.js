var querystring = require("querystring");
	fs = require("fs");
	formidable = require("formidable");

function start(response){
	console.log("Request handler 'start' was called.");
	
	var body = '<!doctype html>\n'+
	'<html>\n'+
    '<head>\n'+
    '<meta http-equiv="Content-Type" \n'+
    'content="text/html; charset=UTF-8" />\n'+
    '<link rel="stylesheet" href="http://www.getskeleton.com/src/stylesheets/base.css">\n'+
    '</head>\n'+
    '<body>\n'+
 	'<div align="center">\n'+
    '<form action="/upload" enctype="multipart/form-data" \n'+
    'method="post">\n'+
    '<input type="file" name="upload" multiple="multiple">\n'+
    '<input type="submit" value="Upload file" />\n'+
    '</form>\n'+
    '</div>\n'+
    '</body>\n'+
    '</html>\n';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request){
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
    var header = '<html>\n'+
    '<head>\n'+
    '<meta http-equiv="Content-Type" \n'+
    'content="text/html; charset=UTF-8" />\n'+
    '<link rel="stylesheet" href="http://www.getskeleton.com/src/stylesheets/base.css">\n'+
    '</head>\n'+
    '<body>\n'+
    '<div align="center">\n';
    var footer = '</div>\n'+
    '</body>\n'+
    '</html>\n';	


	console.log("About to parse");
	form.parse(request, function(error, fields, files){
		console.log("Parsing Done");

		fs.rename(files.upload.path, "/tmp/test.png", function(err){
			if(err){
				fs.unlink("/tmp/test.png");
				fs.rename(files.upload.path, "/tmp/test.png");
			}
		});
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(header + "Received Image:<br /> "); 
		response.write("<img src='/show' />" + footer);
		response.end();
	});
}

function show(response){
	console.log("Request handler 'show' was called.");
	fs.readFile("/tmp/test.png", "binary", function(error, file){
		if(error){
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		}else{
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;