FGS.zombielane.Requests = 
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
					if(typeof(retry) == 'undefined')
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);
					}
					
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_169557846404284', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.zombielane.Requests.Click2(currentType, id, url, params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	
	Click2: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);

					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'This has expired or have been already claimed!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					if(dataStr.indexOf('You Just Accepted a New Neighbor') != -1)
					{
						
						var pos1 = dataStr.indexOf('Text_Description:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						
						var from = 'New neighbor';
						
						var pos1 = dataStr.indexOf('Item_1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					else
					{
						var pos1 = dataStr.indexOf('Text_Description:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('Text_Description_2:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var from = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('Item_1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					
					info.title = title;						
					info.image = image;
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = from;
						
						
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};

FGS.zombielane.Bonuses = 
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);
					}
				
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_169557846404284', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.zombielane.Bonuses.Click2(currentType, id, url, params);
				} 
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if(dataStr.indexOf('Stream reward already collected') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'Stream post has been expired!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					var pos1 = dataStr.indexOf('Text_Title:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var title = dataStr.slice(pos1+1, pos1b);
					
					var pos1 = dataStr.indexOf('Text_Description:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var text = dataStr.slice(pos1+1, pos1b);
					
					info.title = title;						
					info.image = 'gfx/90px-check.png';
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = text;
						
						
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};