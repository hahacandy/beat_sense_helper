//2022/09/03/22:04 by 카캇테코이요
function run_code(_code){
	var script = document.createElement('script');  
	script.innerHTML = _code;  
	document.head.appendChild(script);
}
function  change_order(){
	var _code = "\
		function  change_order(){\
			if(document.querySelector('#playerAndPlaylistArea > my-room-chat')){\
				var ele = document.querySelector('#playerAndPlaylistArea > my-room-chat');\
				var ele_s = document.querySelector('#chatMessagesContainer');\
				var ele2 = document.querySelector('#playlistArea');\
				var ele2_s = document.querySelector('#playlist-holder > div');\
				var parent = document.querySelector('#playerAndPlaylistArea');\
				parent.insertBefore(ele, null);\
				parent.insertBefore(ele2, parent.firstChild);\
				document.querySelector('#playerAndPlaylistArea').style.justifyContent = 'space-around';\
				document.querySelector('#playerAndPlaylistContainer').style.paddingTop = '10vh';\
			}else{\
				setTimeout(change_order, 100);\
			}\
		}\
	change_order()";
	run_code(_code);
}
function resize_chatting_box(_width, _height){
	var _code = "\
	function resize_chatting_box(_width, _height){\
		if(document.querySelector('#room-chat-holder')){\
			document.querySelector('#room-chat-holder').style.width = _width + 'px';\
			document.querySelector('#room-chat-holder > div.content > div.input-holder > my-chat-input > div > input').style.width = (_width-32) + 'px';\
			document.querySelector('#room-chat-holder > div.content > div.messages-holder').style.height = _height + 'px';\
			document.querySelector('#chatMessagesContainer').style.maxHeight =  _height + 'px';\
		}else{\
			setTimeout(resize_chatting_box, 100,  _width,  _height);\
		}\
	}\
	resize_chatting_box("+_width+", "+_height+")";
	run_code(_code);
}
function vote_auto(_feed_msg, _feed_msg_time, _include_id){
	var _code = "\
		var is_feed = true;\
		function vote_auto(_feed_msg, _feed_msg_time, _include_id){\
			var btn_vote = document.querySelector('#currSongThumbUp_forTutorial');\
			if(btn_vote){\
				autoVoted = document.querySelector('#vote-feedback-input-holder').getAttribute('class').includes('voted-up');\
				var play_by_current_user = false;\
				try{\
					var user_songs = document.getElementsByClassName('playlistSong');\
					var play_by_user = '';\
					Array.prototype.forEach.call(user_songs, function(user_song) {\
						if(user_song.getAttribute('index') == 0){\
							play_by_user = user_song.getElementsByClassName('playlistRow_byUser')[0].textContent;\
						}\
					});\
					play_by_current_user = (play_by_user == user_id);\
				}catch{}\
				if(!autoVoted && !play_by_current_user){\
					angular.element('#currSongThumbUp_forTutorial').scope().vote(1);\
					is_feed = false;\
				}\
				try{\
					var current_feed_time = Math.floor(+ new Date() / 1000);\
					if(!is_feed){\
						setTimeout(function(_include_id) {\
							var feed_input = angular.element('#vote-feedback-input-holder > input').scope();\
							if(_include_id){\
								feed_input.voteFeedbackContent = user_id + ' : ' + _feed_msg;\
							}else{\
								feed_input.voteFeedbackContent = _feed_msg;\
							}\
							feed_input.onVoteFeedbackKeyPress({keyCode:13});\
						}, "+(_feed_msg_time*1000)+", _include_id);\
						is_feed = true;\
					}\
				}catch{}\
			}\
			setTimeout(vote_auto, 100, _feed_msg, _feed_msg_time, _include_id);\
		}\
		vote_auto(\"" + _feed_msg + "\",  "+_feed_msg_time+", "+_include_id+"); ";
	run_code(_code);
}
var is_notice = false;
function check_user_id(){
	if(window.location.href != 'https://www.beatsense.com/' && !window.location.href.includes('#')){
		if(user_id == null && ((new Date()-start_time)/1000) > 10){
			if(is_notice == false){
				is_notice = true;
				alert('카캇테코이요 : 초기 정보 받아오기 실패, 새로고침 해야함');
				window.location.reload();
			}
		}
	}
}
setInterval(check_user_id, 1000);

if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}
function showNotification(title_msg, Content_msg) {
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
} else {
  const options = {
    body: Content_msg,
    dir: 'ltr',
    icon: 'https://beatsense.com/static/images/logo_meta.png'
  };
  const notification = new Notification(title_msg, options);
}
}
function check_AFK(_afk_msg, _afk_wait_time){
	var _code = "\
		var focused = true;\
		var user_id = null;\
		var latest_wait_time = 0;\
		var start_time = new Date();\
		window.onfocus = function() {focused = true;};\
		window.onblur = function() {focused = false; latest_wait_time=new Date();};\
		function init_AFK(){\
			try{\
			var beats_infos = document.evaluate('/html/head/script[4]/text()', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;\
			var beats_infos = beats_infos.substring(beats_infos.lastIndexOf('(\\'') + 2 , beats_infos.lastIndexOf('\\')'));\
			var beats_infos = beats_infos.replace('\\\\\\'', '');\
			var beats_infos = JSON.parse(beats_infos);\
			user_id = beats_infos.user.userName;\
			}catch{}\
			return true;\
		}\
		function check_AFK(_afk_msg, _afk_wait_time){\
			try{\
				if(user_id == null){\
					if(!init_AFK()){\
						return;\
					}\
				}\
				else{\
					var all_chatting = document.getElementsByClassName('senderAndText');\
					var last_chatting = all_chatting[all_chatting.length-1];\
					if(last_chatting.getAttribute('afk_checked') == null){\
						last_chatting.setAttribute('afk_checked', 'true');\
						if(((new Date()-latest_wait_time)/1000) >= _afk_wait_time){\
							var chatting_id = last_chatting.getElementsByClassName('senderNameHolder')[0].innerText;\
							var chatting_id = chatting_id.substring(0, chatting_id.length-2);\
							var chatting_msg = last_chatting.getElementsByClassName('msgTxt')[0];\
							var chatting_call_msgs = chatting_msg.getElementsByClassName('user-link-inline');\
							var text_chat_input = document.querySelector('#room-chat-holder > div.content > div.input-holder > my-chat-input > div > input');\
							if (!focused){\
								Array.prototype.forEach.call(chatting_call_msgs, function(called_user) {\
									var called_user = called_user.text;\
									var regex = new RegExp('^\\\\[AFK\\\\] @'+user_id) ;\
									if( called_user == '@'+user_id && chatting_id != called_user && chatting_id != 'BeatSense' && !regex.test(chatting_msg.textContent)){\
										angular.element(text_chat_input).scope().value = '[AFK] @' + chatting_id + ', ' + _afk_msg;\
										var e =  {isTrusted: true, keyCode:65, currentTarget:text_chat_input};\
										var e2 =  {keyCode:13, currentTarget:text_chat_input};\
										angular.element(text_chat_input).scope().onKeyUp(e);\
										angular.element(text_chat_input).scope().onKeyPress(e2);\
										showNotification(chatting_id, chatting_msg.textContent);\
									}\
								});\
							}\
						}\
					}\
				}\
			}\
			catch{}\
			setTimeout(check_AFK, 100, _afk_msg, _afk_wait_time);\
		}\
		check_AFK(\""+_afk_msg + "\", "+_afk_wait_time+")";
	run_code(_code);
}
function get_auto_beats(){
	var _code = "\
		function get_auto_beats(){\
			try{\
				if(document.querySelector('#hourlyBeatsTimerHolder > div > div > button > span')){\
					var e =  {originalEvent:{isTrusted:true, isUserBehavior:true}};\
					const { originalEvent } = e;\
					angular.element('#hourlyBeatsTimerHolder > div > div > button').scope().onMouseEnterBtn( );\
					angular.element('#hourlyBeatsTimerHolder > div > div > button').scope().claimReward(e );\
				}\
			}\
			catch{}\
			setTimeout(get_auto_beats, 100);\
		}\
		get_auto_beats();\
		";
	run_code(_code);
}

function create_img(one_msg, one_a_tag, a_tag_href, _is_first_change_img, _clear_link, _maxWidth, _maxHeight){
	try{
		var regex = new RegExp('(^https://|^http://)');
		if(regex.test(a_tag_href)){
			var regex2 = new RegExp('(\.jpg$|\.jpeg$|\.png$|\.gif$)');
			var regex3 = new RegExp('(\.mp4$)');
			var regex4 = new RegExp('https:\/\/youtu.be\/[a-zA-Z0-9]+');
			var div = document.createElement('div');
			div.style.textAlign='center';
			var change_ele = null;
			if(regex2.test(a_tag_href)){
				change_ele = document.createElement('img'); 
				change_ele.addEventListener('click', function(){
					window.open (a_tag_href);
				}, false);
				change_ele.onload = function(){
					var chatt_box_height = document.querySelector('#room-chat-holder').offsetHeight;
					var ele_s = document.querySelector('#chatMessagesContainer');
					if((ele_s.scrollHeight-ele_s.scrollTop) < (chatt_box_height * 2)){
						ele_s.scrollTop = ele_s.scrollHeight;
					}else if (this.getAttribute('first') != null){
						ele_s.scrollTop = ele_s.scrollHeight;
					}
				}
			}else if(regex3.test(a_tag_href)){
				change_ele = document.createElement('video'); 
				change_ele.controls = true;
				change_ele.controlsList = 'nodownload';
				change_ele.autoplay = 'true';
				change_ele.muted = 'true';
				change_ele.loop = 'true';
				change_ele.addEventListener('loadeddata', function() {
					var chatt_box_height = document.querySelector('#room-chat-holder').offsetHeight;
					var ele_s = document.querySelector('#chatMessagesContainer');
					if((ele_s.scrollHeight-ele_s.scrollTop) < (chatt_box_height * 2)){
						ele_s.scrollTop = ele_s.scrollHeight;
					}else if (this.getAttribute('first') != null){
						ele_s.scrollTop = ele_s.scrollHeight;
					}
				}, false);
			}else if(regex4.test(a_tag_href)){
				change_ele = document.createElement('iframe'); 
				change_ele.frameborder = "0";
				change_ele.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
				change_ele.allowfullscreen = true;
				a_tag_href =  'https://www.youtube.com/embed/' + a_tag_href.replace('https://youtu.be/', '');
				change_ele.addEventListener( "load", function(e) {
					var chatt_box_height = document.querySelector('#room-chat-holder').offsetHeight;
					var ele_s = document.querySelector('#chatMessagesContainer');
					if((ele_s.scrollHeight-ele_s.scrollTop) < (chatt_box_height * 2)){
						ele_s.scrollTop = ele_s.scrollHeight;
					}else if (this.getAttribute('first') != null){
						ele_s.scrollTop = ele_s.scrollHeight;
					}
				} );
				change_ele.style.width = _maxWidth + 'px';
				change_ele.style.height = _maxHeight + 'px';
			}
			else{
				return 0;
			}
			change_ele.src = a_tag_href;
			change_ele.style.maxWidth = _maxWidth + 'px';
			change_ele.style.maxHeight = _maxHeight + 'px';
			change_ele.style.margin = '10px';
			change_ele.style.cursor='pointer';
			if(_is_first_change_img){
				change_ele.setAttribute('first', 'true');
			}
			div.appendChild(change_ele);
			if(_clear_link){
				one_msg.insertBefore(div, one_a_tag);
				one_a_tag.remove();
			}else{
				one_msg.insertBefore(div, null);
				one_msg.getElementsByClassName('msgTxt')[0].remove();
			}
			return 1;
		}
	}catch{}
	return 0;
}

function change_url_to_img(_is_first_change_img, _maxWidth, _maxHeight){
	var all_msg = document.getElementsByClassName('msgTxt');
	var cnt_removed = 0;
	Array.prototype.forEach.call(all_msg, function(one_msg) {
		var all_a_tag = one_msg.getElementsByTagName('a');
		Array.prototype.forEach.call(all_a_tag, function(one_a_tag) {
			var a_tag_href = one_a_tag.getAttribute('href');
			cnt_removed += create_img(one_msg, one_a_tag, a_tag_href, _is_first_change_img, true, _maxWidth, _maxHeight);
		});
	});
	var all_msg = document.getElementsByClassName('senderAndText');
	Array.prototype.forEach.call(all_msg, function(one_msg) {
		try{
			var _another_child = one_msg.getElementsByClassName('senderNameHolder')[0];
			var _href = one_msg.getElementsByClassName('msgTxt')[0].textContent;
			cnt_removed += create_img(one_msg, _another_child, _href, _is_first_change_img, false, _maxWidth, _maxHeight);
		}catch{}
	});
	if(cnt_removed > 0  && _is_first_change_img){
		_is_first_change_img = false;
	}	
	setTimeout(change_url_to_img, 1000,  _is_first_change_img, _maxWidth, _maxHeight);
}

function show_remaining_time(){
	var my_song_wait_time_plus = 0;
	var my_song_wait_time_minus = 0;
	var is_my_song = false;
	try{
			
		function cal_text_to_time(menu, time_s, arg1){
			try{
				var temp3 = time_s.split(':');
	
				if(menu == 'plus'){
					my_song_wait_time_plus += ((temp3[0] * 1)*60)+(temp3[1] * 1) + arg1;
				}else if (menu == 'minus'){
					my_song_wait_time_minus += ((temp3[0] * 1)*60)+(temp3[1] * 1) + arg1;
				}
			}catch{}
		}
		function change_type_of_time(seconds) {
			var hour = parseInt(seconds/3600);
			if (hour < 10)
				hour = '0' + hour;
			var min = parseInt((seconds%3600)/60);
			if (min < 10)
				min = '0' + min;
			var sec = seconds%60;
			if (sec < 10)
				sec = '0' + sec;
			return hour+":"+min+":" + sec;
		}
		var temp = document.querySelector('#left-top-playerControls > div.item.timer.ng-isolate-scope > div > div').textContent;
		var temp2 = temp.split('/');
		cal_text_to_time('minus', temp2[0], 0);
		cal_text_to_time('plus', temp2[1], 0);
		temp = document.querySelector('#playlist-holder > div > div.scrollable-holder').children;
		var index = 0;
		for (var el of temp){
			var song_list_user_id = el.getElementsByClassName('playlistRow_byUser')[0].textContent;
			if (song_list_user_id == user_id && index > 0){
				is_my_song = true;
				break;
			}
			if (el.getAttribute('curr-song') == 'currSong'){
				temp2 = el.getElementsByClassName('queue-song-duration')[0];
				if (temp2 != null){
					cal_text_to_time('plus', temp2.textContent, -10);
				}
				index += 1;
			}
		}
	}catch{}
	try{
		var add_music_el = document.querySelector('#btnAndLockWrapper > button');
		if (is_my_song){
			var remaining_time = my_song_wait_time_plus-my_song_wait_time_minus;
			add_music_el.innerText = 'ㅤ+ Add Music! ' + ' (' + change_type_of_time(remaining_time) + ')';
		}else{
			add_music_el.innerText = 'ㅤ+ Add Music!';
		}
	}catch{}
	setTimeout(show_remaining_time, 100);
}

get_auto_beats(); // Claim da Beats! 버튼을 누를 수 있게 되면 눌러서 공짜 비트를 받는다.
change_order(); // 채팅창 동영상 노래리스트 순서를 노래리스트 동영상 채팅창 으로 순서를 바꿈
change_url_to_img(true, 300, 300); //채팅에 이미지 링크가 있으면 이미지로 바꿀것인가, 채팅창 이미지 가로길이 px , 채팅창 이미지 세로길이 px
resize_chatting_box(350, 600); // 채팅창 폭넓이 px,  채팅창 세로넓이 px
vote_auto("좋아요!", 0, true); // 좋아요 눌렀는지 확인하고 안눌렀으면 누름, "" 안의 텍스트가 추천누르고 피드백 남길 메시지장, 5= 추천누르고 5초뒤에 피드백 메시지 보냄, true=추천 피드백 메시지 남길때 자신의 아이디를 앞에 붙힘, false = 자신의 아이디 안붙힘 
check_AFK("今は席を外しています。", 0); // "" 의 안의 텍스트가 akf 메시지로 설정됨, 해당 브라우저를 떠난뒤 몇초후에 작동할것인가
show_remaining_time(); // 내가 등록한 노래가 언제 재생되는지 표시