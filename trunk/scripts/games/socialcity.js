FGS.socialcityRequests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(FGS.checkForNotFound(redirectUrl) === true)
					{
						FGS.endWithError('not found', currentType, id);
					}
					else if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
					var src = FGS.findIframeAfterId('#app_content_163965423072', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
					src = src.replace('http://city-fb-apache-active-vip.playdom.com/', 'http://city-fb-apache-active-vip.playdom.com/lib/playdom/facebook/facebook_iframe.php');
					
					FGS.socialcityRequests.Click2(currentType, id, src);
				} 
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var src = currentURL;
					
					var i1 = src.indexOf('?');
					src = src.slice(i1+1);
					
					var postParams = {}
					var extra = {}
					
					for(var idd in FGS.jQuery.unparam(src))
					{
						if(idd.indexOf('fb_') != -1)
						{
							postParams[idd] = FGS.jQuery.unparam(src)[idd];
						}
						else
						{
							extra[idd] = FGS.jQuery.unparam(src)[idd];
						}
					}
					
					var tmpdata = $('#pd_authToken', dataHTML).val();

					var i1 = tmpdata.indexOf('|');
					var auth_key = tmpdata.slice(0, i1);
					var auth_time = tmpdata.slice(i1+1);
					
					var landing = FGS.jQuery.unparam(src).landing;
					
					var i1 = landing.indexOf('_');
					var page = landing.slice(0, i1);
					var aaa =  landing.slice(i1+1);

					var newUrl = 'http://city-fb-apache-active-vip.playdom.com/lib/playdom/facebook/facebook_iframe.php?'+FGS.jQuery.param(postParams)+'&extra='+JSON.stringify(extra)+'&rtype=ajax&p='+page+'&a='+aaa+'&auth_key='+auth_key+'&auth_time='+auth_time+'&ts='+new Date().getTime();
					
					FGS.socialcityRequests.Click3(currentType, id, newUrl);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click3:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					eval('var dataTMP = '+dataStr.slice(dataStr.indexOf('{'),dataStr.lastIndexOf('}')+1));
					
					var dataHTML = FGS.HTMLParser(dataTMP.html);
										
					//var sendInfo = '';
					//info.thanks = sendInfo;	
					
					if($('#neighbor_title', dataHTML).length > 0)
					{
						info.image = $('#neighbor_image', dataHTML).children('img').attr('src');
						
						var tmpTitle = $('#neighbor_title > h1', dataHTML).text();
						var i1 = tmpTitle.indexOf('with');
						info.title = 'New neighbour';
						info.text = tmpTitle.slice(i1+5);
					}
					else
					{

						info.image = $('#acceptInfo', dataHTML).children('img').attr('src');
						info.title = $("#infoText > .highlight" ,dataHTML).text();
						var txt =  $("#infoText", dataHTML).text();
						var i1 = txt.indexOf('from');
						
						info.text  = txt.slice(i1+5);
					}
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};