FGS.mafiawars.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/inthemafia/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var src = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var paramsTmp = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!src)
					{
						var src = FGS.findIframeByName('mafiawars', dataStr);
						if (src == '') throw {message:"no iframe"}
					}
					
					params.click2url = src;	
					params.click2param = paramsTmp;
					
					FGS.mafiawars.Freegifts.Click2(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.click2url+addAntiBot,
			data: params.click2param,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var tst = new RegExp(/<form.*[^>]action="(.*)" .*>/).exec(dataStr);
					if(tst == null) throw {message: 'no form'}
					
					var tmpUrl = tst[1];
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					var nextParams = '';
					
					$(count).each(function(k,v)
					{
						
						var pos1 = v.indexOf('name="')+6;
						if(pos1 == 5) return;
						pos2 = v.indexOf('"',pos1);
						
						if (nextParams=='')
							var tmpName = v.slice(pos1,pos2)+'=';
						else
							var tmpName = '&'+v.slice(pos1,pos2)+'=';
						
						
						var pos1 = v.indexOf('value="')+7;
						if(pos1 == 6) return;
						
						pos2 = v.indexOf('"',pos1);
						nextParams += tmpName+escape(v.slice(pos1,pos2));
					});
					
					var useridtmp = $('input[name="sf_xw_user_id"]', dataHTML).val();
					var pos1 = useridtmp.indexOf('|')+1;
					var useridfin = useridtmp.slice(pos1);
					
					
					var pos1 = tmpUrl.indexOf('&tmp=');
					var pos2 = tmpUrl.indexOf('&', pos1+1);
					var tmpTmp = tmpUrl.slice(pos1, pos2);
					
					
					var pos1 = tmpUrl.indexOf('&cb=');				
					var pos2 = tmpUrl.indexOf('&', pos1+1);
					var tmpCb = tmpUrl.slice(pos1, pos2);
					
					params.cb = tmpCb;
					params.tmp = tmpTmp;
					
					
					params.sf_xw_user_id = $('input[name="sf_xw_user_id"]', dataHTML).val();
					params.sf_xw_sig = $('input[name="sf_xw_sig"]', dataHTML).val();
					
					params.click3param = nextParams;
					params.click3url = 'http://facebook.mafiawars.zynga.com/mwfb/remote/html_server.php?xw_controller=requests&xw_action=friend_selector&xw_city=1&req_controller=freegifts&free_gift_id='+params.gift+'&free_gift_cat=1&xw_client_id=8&ajax=1&liteload=1&fbml_iframe=1&xw_person='+useridfin+tmpTmp+tmpCb;
				
					FGS.mafiawars.Freegifts.Click3(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	}
,
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.click3url+addAntiBot,
			data: params.click3param,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.click3url.match(re)[1].toString();
					
					var pos1 = dataStr.indexOf('MW.Request.setTabFriendLists({');
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=29;
					
					var pos2 = dataStr.indexOf('});', pos1)+1;
					
					var friends = JSON.parse(dataStr.slice(pos1,pos2));
					
					var zids;
					
					if(typeof friends["2"] != 'undefined')
						zids = friends['2'];
					else
						zids = friends["3"];
					
					params.zyFriends = zids;
					
					
					
					var pos1 = dataStr.indexOf('MW.Request.setFriendNames({');
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=26;
					
					var pos2 = dataStr.indexOf('});', pos1)+1;
					
					var frName = JSON.parse(dataStr.slice(pos1,pos2));
					
					var finalArr = [];
					
					$(zids).each(function(k,v) {
						var x = {};
						
						if(typeof frName[v] == 'undefined')
							return;
							
						
						x[v] = {'name': frName[v]};
						finalArr.push(x);
					});
					
					
					params.items = finalArr;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', finalArr, params.gameID);
						return;
					}
					
					var title = 'Freegifts';
					
					var s1 = dataStr.indexOf("MW.Request.setMsg(");
					var s1a = dataStr.indexOf("'", s1)+1;
					var s1b = dataStr.indexOf("'", s1a);
					
					var body = dataStr.slice(s1a, s1b);
					
					
					var s1 = dataStr.indexOf("MW.Request.setData(");
					var s1a = dataStr.indexOf("'", s1)+1;
					var s1b = dataStr.indexOf("}')", s1a)+1;
					
					
					
					params.requestPostData = dataStr.slice(s1a, s1b);		
					
					var reqData = {};
					
					reqData.filters = JSON.stringify( [{name: 'MW Friends', user_ids: zids}] );
					reqData.title = title;
					reqData.message = body;
					
					params.reqData = reqData;
					params.channel = 'http://facebook.mafiawars.zynga.com/';
					
					
					//params.afterSend = 
					
					FGS.getAppAccessTokenForSending(params, FGS.mafiawars.Freegifts.ClickRequest);				
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	ClickRequest: function(params, d)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		var pos0 = d.indexOf('&result=')+8;
		var pos1 = d.indexOf('"', pos0);
		
		var str = d.slice(pos0, pos1);
		var data = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc));
		
		//https://facebook.mafiawars.zynga.com/mwfb/remote/html_server.php?xw_controller=requests&xw_action=postSend&xw_city=&tmp=ac5f9618d25f08fba5709c96176cbeed&cb=9a29fff00ff111e18952cfbc859b26c9&xw_person=&rid=312859905392005&to=1699074906&xw_client_id=8
		console.log(data);
		
		var str = data.to.join(',');
		$.post('https://facebook.mafiawars.zynga.com/mwfb/remote/html_server.php?xw_controller=requests&xw_action=postSend&xw_city='+params.tmp+''+params.cb+'&xw_person=&rid='+data.request+'&to='+str+'&data='+params.requestPostData, 'ajax=1&liteload=1&sf_xw_user_id='+params.sf_xw_user_id+'&sf_xw_sig='+params.sf_xw_sig);
	}
};


FGS.mafiawars.Requests = 
{
	Click:	function(currentType, id, currentURL, retry)
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var redirectUrl2 = FGS.checkForGoURI(dataStr);
					if(redirectUrl2 != false)
					{
						retryThis(currentType, id, redirectUrl2, true);
						return;
					}
					
					
					var src = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var paramsTmp = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!src)
					{
						var src = FGS.findIframeByName('mafiawars', dataStr);
						if (src == '') throw {message:"no iframe"}
					}
					
					FGS.mafiawars.Requests.Click3(currentType, id, src, paramsTmp);
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
	
	Click3:	function(currentType, id, currentURL, params, retry)
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
				if(dataStr.indexOf('top.location.href = "') != -1)
				{
					var pos0 = dataStr.indexOf('top.location.href = "')+21;
					var pos1 = dataStr.indexOf('"', pos0);
					
					var redirectUrl = dataStr.slice(pos0, pos1);
					
					FGS.mafiawars.Requests.Click(currentType, id, redirectUrl);
					return;
				}
				
				var dataHTML = FGS.HTMLParser(dataStr);

				try 
				{
					var tst = new RegExp(/<form.*[^>]action="(.*)" .*>/).exec(dataStr);
					if(tst == null) throw {message: 'no form'}
					
					var tmpUrl = tst[1];
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					var nextParams = '';
					
					$(count).each(function(k,v)
					{
						var pos1 = v.indexOf('name="')+6;
						if(pos1 == 5) return;
						pos2 = v.indexOf('"',pos1);
						
						if (nextParams=='')
							var tmpName = v.slice(pos1,pos2)+'=';
						else
							var tmpName = '&'+v.slice(pos1,pos2)+'=';

						var pos1 = v.indexOf('value="')+7;
						if(pos1 == 6) return;
						
						pos2 = v.indexOf('"',pos1);
						nextParams += tmpName+escape(v.slice(pos1,pos2));
					});
					
					var isBoost = false;
					
					if(tmpUrl.indexOf('mastery_boost') != -1)
					{
						isBoost = true;
					}
					
					FGS.mafiawars.Requests.Click4(currentType, id, tmpUrl, nextParams, isBoost);
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
	},
	
	Click4:function(currentType, id, currentURL, currentParams, isBoost, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: currentParams,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);

				try
				{
					var data = dataStr;
					
					if(data.indexOf('Something has gone wrong') != -1)  throw {message:"Something is wrong"}
					if(data.indexOf('This gift is expired') != -1)		throw {message:"Gift expired"}
					
					
					if(dataStr.indexOf('this request has expired') != -1 || dataStr.indexOf('This gift is expired') != -1 || dataStr.indexOf('Request not found') != -1)
					{
						FGS.endWithError('limit', currentType, id, 'This request has expired');
						return;
					}
					
					info.text = '';
					
					if(isBoost)
					{
						info.image = 'icons/reqs/noimage.png';
						info.title = 'Mastery Boost';
					}
					else
					{
						if(data.indexOf('Mystery Bag contained') != -1 || data.indexOf('Secret Drop contained') != -1 || data.indexOf('Your Mystery Animal is') != -1 || data.indexOf('You just accepted') != -1)
						{

							var testStr = $('img:first', dataHTML).attr('longdesc');
							
							if(testStr.indexOf('CRM_LP-icon-bonus.png') != -1)
							{
								info.text = $('img:first', dataHTML).parent().text();
							}

							$('img', dataHTML).each(function()
							{
								if($(this).css('height') == '75px')
								{
									info.image = $(this).attr('longdesc');
									info.title = '';
									
									$(this).parent().children('div').each(function()
									{
										if($.trim($(this).text()) != '')
										{
											info.title = $(this).text();
											return false;
										}
									});
								}
							});
						}
						else if(data.indexOf('a Mystery Bag item instead') != -1)
						{
							info.image = $('img:first', dataHTML).attr('longdesc');
							var tmpText = $('.good:first', dataHTML).text();
							
							var pos1 = tmpText.indexOf(':');
							if(pos1 != -1)
							{
								tmpText = tmpText.slice(pos1+1);
							}
							
							var pos2 = tmpText.indexOf('+');							
							if(pos2 != -1)
							{
								info.text = tmpText.slice(pos2);
								tmpText = tmpText.replace(info.text, '');
							}					
							
							info.title = tmpText;
						}
						else if(data.indexOf('You got an Energy Pack.') != -1)
						{
							var pos1 = data.indexOf('You got an Energy Pack.');
							var pos2 = data.indexOf('.', pos1+23);
							
							info.image = $('img:first', dataHTML).attr('longdesc');
							info.title = $('img:first', dataHTML).parent().text();
							info.text = data.slice(pos1,pos2);
						}
						else if(data.indexOf('Your Super Pignata contained') != -1)
						{
							info.image = $('img:first', dataHTML).attr('longdesc');
							info.title = $('img:first', dataHTML).attr('title');
						}
						else if(data.indexOf('Requests from other Mafias') != -1)
						{
							var pos1 = data.indexOf('http://facebook.mafiawars.zynga.com/mwfb/remote/html_server.php?xw_controller=recruit&xw_action=accept');
							var pos2 = data.indexOf('"', pos1);
							
							var newURL = data.slice(pos1,pos2);
							
							$.ajax({
								type: "POST",
								url: newURL,
								data: currentParams,
								dataType: 'text',
								success: function(data) {}
							});
							
							//$.post(newURL, {sf_xw_user_id: '', sf_xw_sig: ''}, function(d){});
							info.image = 'icons/reqs/noimage.png';
							info.title = 'New recruits';
						}
						else
						{
							info.image = $('img:first', dataHTML).attr('longdesc');
							info.title = $('img:first', dataHTML).parent().text();
						}
					}
					
					if(info.title.indexOf('Try Refreshing') != -1)
					{
						throw {message:"Unknown page"}
					}

					var sendInfo = '';
					
					if(data.indexOf('pic uid="') != -1 && data.indexOf('free_gift_id=') != -1)
					{
						
						var pos1 = data.indexOf('free_gift_id=');
						var pos2 = data.indexOf("'", pos1);
						var giftName = data.slice(pos1+13, pos2);
						
						var pos1 = data.indexOf('pic uid="');
						var pos2 = data.indexOf('"', pos1+9);
						var receiveUid = data.slice(pos1+9, pos2);
						
						
						var pos1 = data.indexOf('false; " >', pos2);
						var pos2 = data.indexOf('</a', pos1);
						var receiveName = data.slice(pos1+10, pos2);

						sendInfo = {
							gift: giftName,
							destInt: receiveUid,
							destName: receiveName,
						}
					}
					info.thanks = sendInfo;
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, currentParams, isBoost, true);
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
					retryThis(currentType, id, currentURL, currentParams, isBoost, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};


FGS.mafiawars.Bonuses = 
{
	Click:	function(currentType, id, currentURL, retry)
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var redirectUrl2 = FGS.checkForGoURI(dataStr);
					if(redirectUrl2 != false)
					{
						retryThis(currentType, id, redirectUrl2, true);
						return;
					}
					
					var src = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var paramsTmp = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!src)
					{
						var src = FGS.findIframeByName('mafiawars', dataStr);
						if (src == '') throw {message:"no iframe"}
					}

					FGS.mafiawars.Bonuses.Click2(currentType, id, src, paramsTmp);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			//dataType: 'text',
			success: function(dataStr)
			{
				if(dataStr.indexOf('top.location.href = "') != -1)
				{
					var pos0 = dataStr.indexOf('top.location.href = "')+21;
					var pos1 = dataStr.indexOf('"', pos0);
					
					var redirectUrl = dataStr.slice(pos0, pos1);
					
					FGS.mafiawars.Bonuses.Click(currentType, id, redirectUrl);
					return;
				}
				
				var dataStr = dataStr.substr(dataStr.indexOf('<body'),dataStr.lastIndexOf('</body'));
				
				try
				{					
					var tst = new RegExp(/<form.*[^>]action="(.*)" .*>/).exec(dataStr);
					if(tst == null) throw {message: 'no form'}
					
					var tmpUrl = tst[1];
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					var nextParams = '';
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					$(count).each(function(k,v)
					{
						
						var pos1 = v.indexOf('name="')+6;
						if(pos1 == 5) return;
						pos2 = v.indexOf('"',pos1);

						if (nextParams=='')
							var tmpName = v.slice(pos1,pos2)+'=';
						else
							var tmpName = '&'+v.slice(pos1,pos2)+'=';
						
						
						var pos1 = v.indexOf('value="')+7;
						if(pos1 == 6) return;
						
						pos2 = v.indexOf('"',pos1);
						nextParams += tmpName+escape(v.slice(pos1,pos2));
					});
					
					FGS.mafiawars.Bonuses.Click3(currentType, id, tmpUrl, nextParams);
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
	},
	
	Click3:	function(currentType, id, currentURL, currentParams, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: currentParams,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);

				try
				{
					var limitArr = [
						{ search: 'You are too late to claim a reward', error: 'You are too late to claim a reward.' },
						{ search: 'Sorry, you already collected on this stash!', error: 'Sorry, you already collected on this stash!' },
						{ search: 'You cannot claim this reward', error: 'You cannot claim this reward.' },
						{ search: 'You have already received your free boost', error: 'You have already received your free boost' },
						{ search: 'You have already helped', error: 'You have already helped.' },
						{ search: 'This user has already received the maximum amount of help', error: 'This user has already received the maximum amount of help.' },
						{ search: 'has received all the help allowed for today', error: 'This user has received all the help allowed for today.' },
						{ search: 'All of the available boosts have already been claimed', error: 'All of the available boosts have already been claimed.' },
						{ search: 'You already helped this user', error: 'You already helped this user.' },
						{ search: 'cannot receive any more parts', error: 'You cannot receive any more parts.' },
						{ search: 'has no more free boosts to hand out', error: 'This user has no more free boosts to hand out.' },
						{ search: 'You have already claimed the maximum number of', error: 'You have already claimed the maximum number of this item.' },
						{ search: 'This stash has already been found', error: 'This stash has already been found.' },
						{ search: 'has already paid out the bounty on this target', error: 'This user has already paid out the bounty on this target.' },
						{ search: 'You cannot gift this item to people not in your mafia', error: 'You cannot gift this item to people not in your mafia.' },
						{ search: ', come back tomorrow to help out more', error: 'You cannot help. Come back tomorrow to help out more.' },
						{ search: 'has already got their Energy Pack for today', error: 'This user has already got their Energy Pack for today.' },
						{ search: 'You are too late to help', error: 'You are too late to help.' },
						{ search: 'Sorry, you may only collect from a feed once', error: 'Sorry, you may only collect from a feed once.' },
						{ search: 'has already had too many friends help today', error: 'This user has already had too many friends help today.' },
						
						{ search: 'the max number of people have already collected from this post', error: 'Sorry, the max number of people have already collected from this post.' },
						
						{ search: 'You have already claimed your reward', error: 'You have already claimed your reward.' },
						
						{ search: 'You have already collected from this feed', error: 'You have already collected from this feed.' },
						{ search: 'Sorry, you may only accept 10 rewards a day', error: 'Sorry, you may only accept 10 rewards a day.' },
						{ search: 'You collected the max number of Broken Hearts from this type of feed', error: 'You collected the max number of Broken Hearts from this type of feed. Try again tomorrow.' },
						{ search: 'collected on 10 secret stashes today, and have to wait', error: 'You have collected on 10 secret stashes today, and have to wait.' },
						{ search: 'You are too late to help', error: 'You are too late to help.' },
						{ search: 'your friend has already completed the mission', error: 'Thanks, but your friend has already completed the mission.' },
						{ search: 'have been claimed. Look out for more', error: 'You are too late. All of these items have been claimed. Look out for more.' },
						{ search: 've already helped your friend', error: 'Sorry, you\'ve already helped your friend with this request' },
						{ search: 'Sorry, the Crew queue is full!', error: 'Sorry, the Crew queue is full!' },
						{ search: 'users already assisted', error: 'Sorry maximum users already assisted this person.' },
						{ search: 'You have already received your free bonus reward', error: 'You have already received your free bonus reward' },
						{ search: 'Sorry, the time limit to assist', error: 'Sorry, the time limit to assist this person has ended' },
						{ search: 'You have already collected the maximum of', error: 'You have already collected the maximum of bonus rewards today.'},
						{ search: 'All of the available bonus rewards have already been claimed', error: 'All of the available bonus rewards have already been claimed' },
						{ search: 'You are already in the Crew queue!', error: 'You are already in the Crew queue!' },
						{ search: ' cannot receive any more ', error: 'This person can\'t receive any more of this reward from you' },
						{ search: 'This boost is no longer available', error: 'This boost is no longer available' },
						{ search: "You've already helped out on this job request", error: "You've already helped out on this job request" }
					];
					
					
					var isLimit = false;
					
					$(limitArr).each(function(k,v)
					{
						if(dataStr.indexOf(v.search) != -1)
						{
							FGS.endWithError('limit', currentType, id, v.error);
							isLimit = true;
							return false;
						}
					});
					
					if(isLimit) return;
					
					if(dataStr.indexOf('has passed out all available') != -1 || dataStr.indexOf('You can only receive') != -1)
					{
						FGS.endWithError('limit', currentType, id);
						return;
					}			

					if(dataStr.indexOf('You just received 5 Loyalty Points for helping out your friend!') != -1)
					{
						info.image = 'gfx/90px-check.png';
						info.text  = 'You just received 5 Loyalty Points for helping out your friend!';
						info.title = 'Loyalty Points';
					}
					else if(dataStr.indexOf('You got a Broken Heart. Collect as many as you can to earn prizes') != -1)
					{
						info.image = 'gfx/90px-check.png';
						info.text  = 'You got a Broken Heart. Collect as many as you can to earn prizes';
						info.title = 'Broken Heart';
					}
					else if(dataStr.indexOf('>Congratulations</div>') != -1) // Get Reward
					{
						var pos1 = dataStr.indexOf('>Congratulations</div>');
						var pos2 = dataStr.indexOf('You Have Received', pos1);
						if(pos2 == -1)
						{
							var pos2 = dataStr.indexOf('You have received', pos1);
						}
						var pos3 = dataStr.indexOf('</div>', pos2);
											
						info.image = 'gfx/90px-check.png';
						info.text  = dataStr.slice(pos2,pos3);
						info.title = dataStr.slice(pos2+17,pos3);					
					}
					else if(dataStr.indexOf('Congrats! You received a') != -1) // Grab your share
					{
						var pos1 = dataStr.indexOf('Congrats! You received a');
						var pos2 = dataStr.indexOf('from', pos1);
						var pos3 = dataStr.indexOf('</div>', pos1);

						info.text  = dataStr.slice(pos1,pos3);
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('longdesc');
						info.title = dataStr.slice(pos1+25,pos2);
					}
					else if(dataStr.indexOf('You received a Liquid Courage') != -1 || dataStr.indexOf(' to celebrate his recent promotion') != -1 || dataStr.indexOf('to celebrate her recent promotion') != -1)
					{
						var pos1 = dataStr.indexOf('You received a');
						var pos2 = dataStr.indexOf('from', pos1);
						
						info.text  = $('td.message_body', dataHTML).text();
						info.image = $('td.message_body > img:nth-child(2)', dataHTML).attr('longdesc');
						info.title = dataStr.slice(pos1+15,pos2);
					}
					else if(dataStr.indexOf('fight the enemy and claim a cash bounty') != -1)
					{
						info.title = 'Cash';
						info.text = 'Fight the enemy and claim a cash';
						info.image = 'http://mwfb.static.zynga.com/mwfb/graphics/buy_cash_75x75_01.gif';
					
						var strNotice = $('td.message_body', dataHTML).html();
						var tmpUrl = '';
						
						$('td.message_body', dataHTML).find('a').each(function()
						{
							if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
							{
								tmpUrl = $(this).attr('href');
								return false;
							}
						});
						
						$.post(tmpUrl, currentParams+'&ajax=1&liteload=1', function(){});
					}
					else if(dataStr.indexOf('You sent a') != -1 || dataStr.indexOf('You collected a') != -1)
					{
						info.title = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('title');
						info.text =  $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').parent().next('div').text();
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('longdesc');
					}
					else if(dataStr.indexOf('loot_confirmed=yes') != -1)
					{
						var dataStr2 = $('td.message_body', dataHTML).text();
					
						var pos1 = dataStr2.indexOf('You received a');
						var pos2 = dataStr2.indexOf('from', pos1);
						
						info.title = $('td.message_body > div:nth-child(2)', dataHTML).find('img:first').parent().next('div').text();
						info.text =  dataStr2.slice(pos1,pos2);
						info.image = $('td.message_body > div:nth-child(2)', dataHTML).find('img:first').attr('longdesc');
						
						var body = $('td.message_body', dataHTML).html();
						
						if(body.indexOf('No Thanks') != -1)
						{
							var tmpUrl = '';
							
							$('td.message_body', dataHTML).find('a').each(function()
							{
								if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
								{
									tmpUrl = $(this).attr('href');
									return false;
								}
							});
							
							$.post(tmpUrl, currentParams+'&ajax=1&liteload=1', function(){});				
						}
					}
					else if(dataStr.indexOf('message_body">You got ') != -1)
					{
						var pos1 = dataStr.indexOf('message_body">You got ');
						var pos2 = dataStr.indexOf('<', pos1);
						var newT = dataStr.slice(pos1+14, pos2);
						
						var pos1 = 8;
						var pos2 = newT.indexOf('.');
						
						info.image = 'gfx/90px-check.png';
						info.text  = newT;
						info.title = newT.slice(pos1, pos2);
					}
					else if(dataStr.indexOf('You just claimed:') != -1)
					{
						var pos1 = dataStr.indexOf('You just claimed:');
						var pos2 = dataStr.indexOf('<', pos1);

						info.text  = dataStr.slice(pos1,pos2);
						info.image = $('td.message_body', dataHTML).find('img:first').attr('longdesc');
						info.title = dataStr.slice(pos1+18,pos2);
					}
					else if(dataStr.indexOf('You collected a') != -1)
					{
						var pos1 = dataStr.indexOf('You collected a');
						var pos2 = dataStr.indexOf('from', pos1);
						var pos3 = dataStr.indexOf('</div>', pos1);

						info.text  = dataStr.slice(pos1,pos3);
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('longdesc');
						info.title = dataStr.slice(pos1+16,pos2);
					}
					else if($('td.message_body', dataHTML).length > 0)
					{
						var el = $('td.message_body', dataHTML);
						
						var str = el.text();
						
						console.log(str);

						var regArr = [
							'You received an?\\s(.*)\\sfor helping',
							'You received .* your friend:(.*)',
							'To celebrate .* you received .*:(.*)',
							'You have sent\\s(.*)',
							'You have been added to the (Crew Queue)',
							'You are too late to help on this job, but .* thanks you for your offer with (.*)',
							'You were awarded (.*)'
						];
						
						var found = false;
					
						$(regArr).each(function(k,v)
						{
							var patt = new RegExp(v, 'gmi');
							
							var tst = patt.exec(str);
							
							if(tst != null)
							{
								info.image = 'gfx/90px-check.png';
								info.text  = str;
								info.title = tst[1];
								found = true;
								return false;
							}
						});
						
						if(found == false)
						{
							throw {message: 'no match'}
						}
					}
					else
					{
						throw {message: 'no match all'}
					}
					
					info.time  = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, currentParams, true);
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
					retryThis(currentType, id, currentURL, currentParams, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};