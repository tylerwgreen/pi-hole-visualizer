var request = require('request');

var PiHoleAPI = {
	params:	{
		ApiUrl: 'http://192.168.1.2/admin/api.php?summaryRaw',
		pollInterval: null,
		pollCallback: null,
		adsBlocked: {
			prevTotal: null,
			total: null
		}
	},
	init: function(params){
		// console.log('PiHoleAPI.init', params);
		this.params = Object.assign(this.params, params);
	},
	poll: {
		init: function(pollCallback){
			// console.log('PiHoleAPI.poll.init', pollCallback);
			PiHoleAPI.params.pollCallback = pollCallback;
			setInterval(this.poll, PiHoleAPI.params.pollInterval);
		},
		poll: function(){
			// console.log('PiHoleAPI.poll.poll');
			request({
				url: PiHoleAPI.params.ApiUrl,
				json: true
			}, function(err, res, json){
				if(err){
					throw err;
				}else if(false === PiHoleAPI.poll.validate.response(res)){
					throw 'Invalid response';
				}else if(false === PiHoleAPI.poll.validate.json(json)){
					throw 'Invalid poll';
				}else{
					// console.log(json);
					PiHoleAPI.poll.getAdsBlockedSinceLastPoll(json.ads_blocked_today);
					PiHoleAPI.params.pollCallback(PiHoleAPI.params.adsBlocked.blocked);
				}
			});
		},
		validate: {
			response: function(res){
				// console.log('PiHoleAPI.poll.validate.response');
				// console.log(res);
				if(200 !== res.statusCode)
					return false;
				return true;
			},
			json: function(json){
				// console.log('PiHoleAPI.poll.validate.poll');
				if('enabled' !== json.status)
					return false;
				return true;
			},
		},
		getAdsBlockedSinceLastPoll: function(adsBlockedToday){
			/* console.log('PiHoleAPI.poll.getAdsBlockedSinceLastPoll', {
				adsBlockedToday: adsBlockedToday,
				prevTotal: PiHoleAPI.params.adsBlocked.prevTotal
			}); */
			PiHoleAPI.params.adsBlocked.blocked = adsBlockedToday - PiHoleAPI.params.adsBlocked.prevTotal;
			PiHoleAPI.params.adsBlocked.prevTotal = adsBlockedToday;
		}
	}
};
module.exports = PiHoleAPI;
