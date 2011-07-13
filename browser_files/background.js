FGS.HTMLParser = function (aHTMLString)
{
	if(aHTMLString.indexOf('<body') != -1)
	{
		var pos0 = aHTMLString.indexOf('<body');
		var pos1 = aHTMLString.lastIndexOf('</body');
		
		if(pos1 == -1)
		{
			var html = aHTMLString.slice(pos0);
		}
		else
		{
			var html = aHTMLString.slice(pos0, pos1+7);
		}
	}
	else
	{
		var html = '<div>'+aHTMLString+'</div>';
	}
	
	html = html.replace(/ src=\"/gi, ' longdesc="');
	html = html.replace(/ src=\'/gi, " longdesc='");
	
	return html;
};

FGS.GetCookieToken = function(params, callback)
{
	chrome.cookies.get(params.cookieToGet, function(c)
	{
		params.cookieValue = c.value;
		callback(params);
	});
};

FGS.copyLink = function(msg)
{
	FGS.jQuery('body').append('<textarea id="ta"></textarea>');
	var ta = document.getElementById('ta');
	ta.value = msg;
	ta.select();
	document.execCommand("copy", false, null);
	$('#ta').remove();
};

FGS.openURI = function (url, background)
{
	chrome.tabs.getAllInWindow(null, function tabSearch(tabs)
	{
		for(var i in tabs) 
		{
			var tab = tabs[i];
			if(tab.url == url)
			{
				return false;
			}		
		}
		chrome.tabs.create({url: url, selected: !background});
	});
};

FGS.hideFromFeed = function(bonusID, limit)
{
	FGS.database.db.readTransaction(function(tx)
	{
		tx.executeSql("SELECT * FROM bonuses where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			
			if(limit)
			{
				if(!FGS.options.games[v.gameID].hideFromFeedLimitError)
				{	
					return;
				}
			}
			else
			{
				if(!FGS.options.games[v.gameID].hideFromFeed)
				{	
					return;
				}
			}
			
			var tmpObj = JSON.parse(v.feedback);
			
			if(typeof tmpObj.target_profile_id == 'undefined')
				tmpObj.target_profile_id = tmpObj.actor;
			
			
			var postData = { 
				'action': 'uninteresting',
				'post_form_id': FGS.post_form_id,
				'fb_dtsg':	FGS.fb_dtsg,
				'object_ids[0]': tmpObj.target_profile_id,
				'object_ids[1]': tmpObj.source_app_id,
				'story_fbids[0]': tmpObj.target_profile_id+':'+tmpObj.target_fbid,
				'source': 'home',
				'nctr[_mod]': 'pagelet_home_stream',
				'lsd':	'',
				'post_form_id_source':'AsyncRequest',
				'lazy': 1,
				'stale_ok': 1
			};
			
			var postData = FGS.jQuery.param(postData).replace(/%5B/g,'[').replace(/%5D/g,']');
			
			FGS.jQuery.ajax({
				type: "POST",
				url: 'http://www.facebook.com/ajax/feed/filter_action.php?__a=1',
				data: postData,
				dataType: 'text',
				success: function(data)
				{
				}
			});
		});
	});
};

FGS.commentBonus = function(bonusID, comment)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM bonuses where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			var postData = { 
				'charset_test': FGS.charset_test,
				'post_form_id': FGS.post_form_id,
				'fb_dtsg':	FGS.fb_dtsg,
				'xhp_ufi': 1,
				'comment': 'Add comment',
				'feedback_params': v.feedback,
				'add_comment_text': comment,
				'link_data': v.link_data,
				'nctr[_mod]': 'pagelet_home_stream',
				'lsd':	'',
				'post_form_id_source':'AsyncRequest',
				'lazy': 1,
				'stale_ok': 1
			};

			var postData = FGS.jQuery.param(postData).replace(/%5B/g,'[').replace(/%5D/g,']');
			
			FGS.jQuery.ajax({
				type: "POST",
				url: 'http://www.facebook.com/ajax/ufi/modify.php?__a=1',
				data: postData,
				dataType: 'text',
				success: function(data)
				{
					var str = data.substring(9);
					var error = JSON.parse(str).error;
					
					if(typeof(error) == 'undefined')
					{
						error = 0;
						FGS.database.commentBonus(bonusID);
					}
					else
						error = 1;

					FGS.sendView('updateComment', bonusID, error);
				}
			});
		});
	});
};

FGS.likeBonus = function (bonusID, autolike)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM bonuses where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			
			if(typeof(autolike) != 'undefined')
			{
				if(!FGS.options.games[v.gameID].likeBonus)
				{	
					return;
				}
			}
			
			var postData = {
				'charset_test': FGS.charset_test,
				'post_form_id': FGS.post_form_id,
				'fb_dtsg':	FGS.fb_dtsg,
				'xhp_ufi': 1,
				'like': '',
				'feedback_params': v.feedback,
				'add_comment_text': '',
				'link_data': v.link_data,
				'nctr[_mod]': 'pagelet_home_stream',
				'lsd':	'',
				'post_form_id_source':'AsyncRequest',
				'lazy': 1,
				'stale_ok': 1
			};
			
			var postData = FGS.jQuery.param(postData).replace(/%5B/g,'[').replace(/%5D/g,']');
			
			FGS.jQuery.ajax({
				type: "POST",
				url: 'http://www.facebook.com/ajax/ufi/modify.php?__a=1',
				data: postData,
				dataType: 'text',
				success: function(data)
				{
					var str = data.substring(9);
					var error = JSON.parse(str).error;
					
					if(typeof(error) == 'undefined')
					{
						error = 0;
						FGS.database.likeBonus(bonusID);
					}
					else
						error = 1;

					FGS.sendView('updateLike', bonusID, error);
				}
			});
		});
	});
};

FGS.sendbackGift = function (bonusID, sendbackData)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM requests where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			if(!FGS.options.games[v.gameID].sendbackGift)
			{	
				return;
			}
			var gameID = v.gameID;	
			
			FGS.sendView('changeSendbackState', bonusID);
			
			var tempData = sendbackData;
			
			if(typeof tempData.destInt == 'undefined' || tempData.destInt == '')
			{
				var postData = v.post;
				tempData.destInt = FGS.Gup('params\\\[from_id\\\]', postData);
			}
			
			var params = {
				gift: tempData.gift,
				gameID:	gameID,
				sendTo: [tempData.destInt],
				sendToName: tempData.destName,
				thankYou: true,
				bonusID: bonusID,	
				isRequest: true
			};
			
			var game = FGS.gamesData[gameID].systemName;
			
			FGS[game].Freegifts.Click(params);			
		});
	});
};

FGS.sendView = function (msg, data, data2, data3)
{
	if(msg == 'requestError' || msg == 'requestSuccess' || msg == 'bonusError' || msg == 'bonusSuccess')
	{
		if(data == FGS.xhrFarmWorking)
		{
			FGS.xhrFarmWorking = 0;
		}
		else
		{
			FGS.xhrWorking--;
		}
	}

	var viewTabUrl = chrome.extension.getURL('giftlist.html');
						
	var views = chrome.extension.getViews();
	
	for (var i = 0; i < views.length; i++)
	{
		var view = views[i];
		//If this view has the right URL and hasn't been used yet...
		if (view.location.href == viewTabUrl)
		{
			if(msg == 'close')
			{
				view.close();
			}
			else if(msg == 'closeAndOpen')
			{
				view.close();
				FGS.saveOptions(FGS.startup);
			}
			
			else if(msg == 'friendsLoaded')
			{
				view.friendsLoaded(data, data2);
			}
			
			else if(msg == 'changeSendbackState')
			{
				view.changeSendbackState(data);
			}

			// bonusy //
			else if(msg == 'bonusError')
			{
				if(data2.error == 'limit')
				{
					FGS.hideFromFeed(data, true);
				}
				view.bonusError(data, data2);
			}
			else if(msg == 'bonusSuccess')
			{
				FGS.likeBonus(data, true);
				FGS.hideFromFeed(data, false);
				view.bonusSuccess(data, data2);
			}
			else if(msg == 'updateLike')
			{
				view.updateLike(data, data2);
			}
			else if(msg == 'updateComment')
			{
				view.updateComment(data, data2);
			}
			// bonusy off //
	
	
			// request //
			else if(msg == 'requestError')
			{
				view.requestError(data, data2);
			}
			else if(msg == 'requestSuccess')
			{
				if(typeof(data2.thanks) != 'undefined' && data2.thanks != '')
				{
					FGS.sendbackGift(data, data2.thanks);
				}
				view.requestSuccess(data, data2);
			}
			
			else if(msg == 'updateNeighbors')
			{
				view.neighborsLoaded(data, data2);
			}
			
			else if(msg == 'errorWithSend')
			{
				if(data2 != '')
				{
					view.updateSendback(data2, false, (typeof(data3) == 'undefined' ? false : true));
				}
				else
				{
					view.freegiftError(data);
				}
			}		
			else if(msg == 'freegiftSuccess')
			{
				if(typeof(data.friendID) != 'undefined')
				{
					FGS.database.addStats('giftSent', data.friendID+'_'+data.gameID, {time: Math.round(new Date().getTime() / 1000), count: 1});
				}
				if(data2 != '')
				{
					view.updateSendback(data2, true);
				}
				view.freegiftSuccess(data, data2);
			}	
			
			else if(msg == 'addNewBonus')
			{
				view.addNewBonus(data3);
			}
			else if(msg == 'addNewRequest')
			{
				view.addNewRequest(data3);
			}
			
			else if(msg == 'hiddenFeed')
			{
				view.hiddenFeed(data);
			}
			
			else if(msg == 'refresh')
			{
				view.location.reload();
			}
			break;
		}
	}
};

FGS.loadOptions = function (userID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT option FROM options where id = ?", [1], function(tx, res)
		{
			var results = [];
			for(var i = 0; i < res.rows.length; i++)
			{
				results.push(res.rows.item(i)['option']);
			}
			
			var localOpt = false;
			var localOptObj = false;
			
			if(FGS.userID != null)
			{
				try
				{
					localOpt = localStorage.getItem('options_'+FGS.userID);
					localOptObj = JSON.parse(localOpt);					
				}
				catch(e)
				{
					localOpt = false;
					localOptObj = false;
				}
			}
						
			if(results.length == 0)
			{
				if(localOptObj !== false && localOpt != '{}')
				{
					FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions, localOptObj);
					FGS.dump('Loading opt from localstorage');
				}
				else
				{
					FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions);
					FGS.dump('Loading default opt');
				}
			}
			else
			{
				if(localOptObj == false || localOpt == '{}')
				{
					FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions,	JSON.parse(results[0]));
					FGS.dump('Loading opt from database');
				}
				else
				{
					var time1 = 0;
					var time2 = 0;
					
					try	{	var time1 = parseInt(JSON.parse(results[0]).lastOptionsSave);	}	catch(e)	{	console.log(e);		}
					try	{	var time2 = parseInt(localOptObj.lastOptionsSave);				}	catch(e)	{	console.log(e);		}
					
					if(time2 > time1)
					{
						FGS.dump('Loading opt from localstorage');
						FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions,	localOptObj);
					}
					else
					{
						FGS.dump('Loading opt from database');
						FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions,	JSON.parse(results[0]));
					}
				}
			}
			
			FGS.optionsLoaded = true;
			FGS.finishStartup();
			FGS.saveOptions();
			
		}, FGS.database.onSuccess, FGS.database.onError);
	});
};

FGS.saveOptions = function(callback)
{
	if(FGS.userID != null)
	{
		FGS.options.lastOptionsSave = new Date().getTime();
		
		var opt = JSON.stringify(FGS.jQuery.extend(true,{},FGS.options));
		
		if(opt == '{}')
		{
			if(callback)
			{
				FGS.stopAll(true);
				callback();
			}
			return;
		}
		
		try
		{
			FGS.options.lastOptionsSave = new Date().getTime();
			var opt = JSON.stringify(FGS.jQuery.extend(true,{},FGS.options));
			
			localStorage.removeItem('options_'+FGS.userID);
			localStorage.setItem('options_'+FGS.userID, opt);
		}
		catch(e)
		{
			console.log(e);
		}
		
		FGS.database.db.transaction(function(tx)
		{
			tx.executeSql("UPDATE options SET option = ? where id = ?", [opt, 1], function()
			{
				if(callback)
				{
					FGS.stopAll(true);
					callback();
				}
			}, FGS.database.onSuccess, FGS.database.onError);
		});
	}
};

FGS.updateIcon = function()
{
	var iconName = (FGS.FBloginError === true ? '48px-icon-bw.png' : '48px-icon.png');
	var fullPath = "gfx/" +iconName;

	try 
	{
		chrome.browserAction.setIcon({path:fullPath});
	} 
	catch(e) 
	{
		console.error("FGS: Could not set browser action icon '" + fullPath + "'.");
	}
	
	if(FGS.FBloginError === false)
	{
		var badge = FGS.newElements == 0 ? '' : FGS.newElements;
		
		chrome.browserAction.setTitle({title: FGS.getMsg('ClickToOpenMenu')});
		chrome.browserAction.setBadgeText({text: badge.toString()});
	}
	else if(FGS.FBloginError == null)
	{
		chrome.browserAction.setBadgeText({text: FGS.getMsg("Wait")});
		chrome.browserAction.setTitle({title: FGS.getMsg('NotLoadedYetPleaseWait')});
	}
	else
	{
		chrome.browserAction.setTitle({title: FGS.getMsg('ClickToLoginToFacebook')});
		chrome.browserAction.setBadgeText({text:"x"});
	}
};

FGS.openGiftList = function()
{
	var url = "giftlist.html";
	var url2 = "giftlist.html?";
	
	var fullUrl = chrome.extension.getURL(url);
	var fullUrl2 = chrome.extension.getURL(url2);
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) { // check if Options page is open already
			var tab = tabs[i];
			if (tab.url == fullUrl || tab.url == fullUrl2)
			{
				chrome.tabs.update(tab.id, { selected: true });
				return;
			}
		}
		chrome.tabs.getSelected(null, function(tab) { // open a new tab next to currently selected tab
			chrome.tabs.create({
				url: url,
				index: tab.index + 1
			});
		});
	});
};

FGS.openFacebook = function()
{
	var FBUrl = "http://www.facebook.com/login.php";

	chrome.tabs.getAllInWindow(null, function tabSearch(tabs)
	{
		for(var i in tabs) 
		{
			var tab = tabs[i];
			if(tab.url == FBUrl)
			{
				chrome.tabs.update(tab.id, {selected:true});
				return;
			}		
		}
		chrome.tabs.create({url: FBUrl});
	});
};

FGS.checkVersion = function()
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
	xhr.send(null);
	var manifest = JSON.parse(xhr.responseText);
	FGS.currentVersion = manifest.version;
};

FGS.loadTranslations = function()
{
	for(var loc in FGS.transObj)
	{
		FGS.jQuery.ajax({
			url: chrome.extension.getURL('locales/'+loc+'/messages.json'),
			beforeSend: function(xhr)
			{
				if (xhr.overrideMimeType)
				{
					xhr.overrideMimeType("application/json");
				}
			},
			dataType: 'json',
			method: 'GET',
			async: false,
			success: function(lang)
			{
				try
				{
					var lang = JSON.parse(lang);
				}
				catch(e)
				{
					//console.log(e);
				}
				
				if(typeof FGS.translations[loc] == 'undefined')
				{
					FGS.translations[loc] = lang;
				}
			}
		});
	}
};

FGS.preStartup = function() 
{
	FGS.loadLibraries();
	
	FGS.jQuery.ajaxSetup({
		timeout: 120000,
	});
	
	FGS.loadTranslations();
	
	FGS.checkVersion();
	FGS.initializeDefaults();

	chrome.browserAction.setBadgeText({text:FGS.getMsg('Wait')});
	chrome.browserAction.setTitle({title: FGS.getMsg('NotLoadedYetPleaseWait')});
	FGS.startup();
};

FGS.loadSubmenu = function(context)
{
	FGS.jQuery.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("scripts/submenu.js"),
		type: "GET",
		success: function(d){},
		dataType: 'script'
	});	
};

FGS.loadLibraries = function(context)
{
	$.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("scripts/buttonsAndFilters.js"),
		type: "GET",
		success: function(){},
		dataType: 'script'
	});
	
	$.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("browser_files/database.js"),
		type: "GET",
		success: function(){},
		dataType: 'script'
	});
	
	$.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("scripts/gifts.js"),
		type: "GET",
		success: function(d){},
		dataType: 'script'
	});	
	
	var arr = [];
	for(var ids in FGS.gamesData)
	{
		FGS[FGS.gamesData[ids].systemName] = {};
		
		$.ajax({
			async: false,
			cache: false,
			url: chrome.extension.getURL("scripts/games/"+FGS.gamesData[ids].systemName+".js"),
			type: "GET",
			success: function(){},
			dataType: 'script'
		});

		if(typeof(FGS[FGS.gamesData[ids].systemName+'Bonuses']) != 'undefined')
		{
			arr.push(FGS.gamesData[ids].systemName+' bonus');
		}
		if(typeof(FGS[FGS.gamesData[ids].systemName+'Requests']) != 'undefined')
		{
			arr.push(FGS.gamesData[ids].systemName+' request');
		}
	}

	var jQuery = window.jQuery.noConflict(true);
	if( typeof(jQuery.fn._init) == 'undefined') { jQuery.fn._init = jQuery.fn.init; }
	FGS.jQuery = jQuery;
};

FGS.openRecovery = function()
{
	FGS.sendView('close');
	
	var url = "recovery.html";
	var url2 = "recovery.html?";
	
	var fullUrl = chrome.extension.getURL(url);
	var fullUrl2 = chrome.extension.getURL(url2);
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) { // check if Options page is open already
			var tab = tabs[i];
			if (tab.url == fullUrl || tab.url == fullUrl2)
			{
				chrome.tabs.update(tab.id, { selected: true });
				//sendView('refresh');
				return;
			}
		}
		chrome.tabs.getSelected(null, function(tab) { // open a new tab next to currently selected tab
			chrome.tabs.create({
				url: url,
				index: tab.index + 1
			});
		});
	});
};

FGS.dump = function(msg)
{
	if(FGSdebugMode)
		console.log(msg);
};