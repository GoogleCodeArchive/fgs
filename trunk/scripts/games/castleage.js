FGS.castleageRequests = 
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
					if(dataStr.indexOf('have already accepted this gift or it has expired') != -1)
					{
						var error_text = 'You have already accepted this gift or it has expired';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					var el = $('#app46755028429_results_main_wrapper', dataHTML);
					
					var tmpTxt = $(el).text();
					var i1 = tmpTxt.indexOf('You have accepted the gift:');
					if(i1 == -1)
					{
						var i1 = tmpTxt.indexOf('You have been awarded the gift:');
						var i2 = tmpTxt.indexOf(' from ');
						var tit = tmpTxt.slice(i1+31, i2);
					}
					else
					{
						var i2 = tmpTxt.indexOf('.', i1);
						var tit = tmpTxt.slice(i1+28, i2);
					}

					info.title = '';
					info.text = tit;
					info.image = $(el).find('img:first').attr('src');				
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
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
	}
};