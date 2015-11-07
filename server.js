var http=require('http');
var url=require('url');
var util=require('util');
var rssresult='empty rss';

var FeedParser=require('feedparser')
	,request=require('request');
var rssPath='http://habrahabr.ru/rss/feed/posts/3579533107158215c7375135d25f59b2/';
var options ={feedurl:'http://habrahabr.ru/rss/feed/posts/3579533107158215c7375135d25f59b2/'};
var req=request(rssPath)
	,feedparser=new FeedParser([options]);
	
	req.on('error',function(error){
		
	}); 
	
req.on('response', function (res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});
feedparser.on('error', function(error) {
  // always handle errors
  console.error(error.message+' '+error.stacktrace);
});
feedparser.on('readable', function() {
  // This is where the action is!
  var stream = this
    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    , item;

  while (item = stream.read()) {
    rssresult=rssresult+item;
	console.log(item);
  }
});

var server=new http.Server(function(req,res){
	console.log(req.method,req.url)
	
	var urlParsed=url.parse(req.url,true);
	console.log(urlParsed);
	if(urlParsed.pathname=='/echo' &&urlParsed.query.message)
	{
		res.end(urlParsed.query.message);
	}
	else if(urlParsed.pathname=='/rss' &&urlParsed.query.message)
	{
		options.feedurl=urlParsed.query.message;
		req=request(options.feedurl);		
		req.emit('response',options.feedurl);
		res.end(util.format("%s",rssresult.title));
		
	}
	else {
		res.statusCode=404;
		res.end("Page not found!")
	}
	
});
server.listen(1337,'127.0.0.1');