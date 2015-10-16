'use strict'
const rfs = require('fs-readdir-promise');
const pfs = require('fs-readfile-promise');
const url = require('url');
const path = require('path');
const md = require('node-markdown').Markdown;
const http = require('http');
let files_destination = path.join('./posts');

http.createServer(function(request,response){
	
	let urls = url.parse(request.url).pathname;

	if(urls == "/"){
		sendFileSystem(request,response);
	}else{
		sendMDFile(request,response,urls);
	}

}).listen(80);

function sendFileSystem(req,res){

	//iterator directory
	rfs(files_destination).then(function(files){
		//show all files and add link

		res.writeHead(200,{'Content-Type':'text/html'});
		res.write("<h1>Recent posts</h1>");
		for(let file of files){
			res.write("<a href=\"./"+file+"\">"+file+"</a>");
		}
		res.end();

	}).catch(function(err){
		res.writeHead(500,{'Content-Type':'text/html'});
		res.end("<h1 style='color:red'>500 ERROR"+err+"<h1>");
	});
}

function sendMDFile(req,res,urls){
	let realpath = urls.substr(1,urls.length);

	pfs(path.join(__dirname,files_destination,realpath)).then(function(buffer){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(md(buffer.toString()));
	}).catch(function(err){
		res.writeHead(404,{'Content-Type':'text/html'});
		res.end("<h1 style='color:red'>404 NOT Found!<h1>");
	});
}