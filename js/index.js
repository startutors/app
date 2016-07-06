ons.ready(function() {
	console.log("onsenloaded");
	ons.platform.select('android');
	tuser = window.localStorage.getItem("authuser");
	authuser = {};
	//window.localStorage.setItem("rememberme", "0");
	if(tuser && tuser != "")
		authuser = JSON.parse(tuser);
	
	if(authuser.token && authuser.token != "" && window.localStorage.getItem("rememberme") == "1")
	{
		app.login(1);
	}
	else //autologin
	{
		$("#appnav")[0].pushPage("splash.html");
		$('#splashlogin').find('.page__background').parallax({
                speed : 0.25
            });
		console.log("showlogin");
	}
	
});


var splash = {
	login: function(){
		console.log('logion');
	},
	register: function()
	{
	console.log('reg');
	},
	show: function(pageid){
		$("#splashnav")[0].pushPage(pageid+".html");
	},
	goback: function(){
		$("#splashnav")[0].popPage();
	}
}

var home = {
	page: null,
	refresh: function(){
		//usertype = home.page.data.type;
		
		if(authuser.usertype == "student")
		{
			home.show("student");
			$(".uemail").html(authuser.email);
		}
		if(authuser.usertype == "tutor")
		{
			console.log(3);
			home.show("tutor");
		}
	},
	show: function(pageid){
		//$("#homenav")[0].pushPage(pageid+".html");
		if(pageid == 'menu')
		{
				$("#menu")[0].open();
		}
		else
		{
			console.log(pageid+".html");
			content = $('ons-splitter-content')[0];
			content.load(pageid+".html");
		}
	}
	
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    },
	
	logout: function(){
	
		$("#appnav")[0].resetToPage("splash.html",{animation:'fade'}).then(function(page) {
				window.localStorage.setItem("authuser","");
				window.localStorage.setItem("rememberme", "");
				authuser = {};
			});
		 
		},
	
	login: function(ruser){
		if(ruser)
		{
			$("#appnav")[0].pushPage("home.html", {data: {type: authuser.usertype}}).then(function(page) {
				console.log("Parameter passed: ", page.data);
				home.page = page;
				home.refresh();
			});
			return;
		}
	
		turl = "http://tuxlap:8888/login";
		$.get( turl, { email: $('.emailfield').val(), password: $('.passfield').val() }, function(user) {
			if(user && !user.error)
			{
				console.log(user);
				authuser = user;
				localStorage.setItem("authuser", JSON.stringify(user));
				$("#appnav")[0].pushPage("home.html", {data: {type: user.usertype}}).then(function(page) {
					console.log("Parameter passed: ", page.data);
					home.page = page;
					home.refresh();
				});
			}
			else
			{
				localStorage.setItem("authuser", "");
				ons.notification.alert("Invalid Credentials");
			}			
			}).fail(function() {
				ons.notification.alert( "Invalid Credentials" );
			});
	}
};

var User = {
	userlist:null,
	current:null,
	add  : function() //only one place so throw it all in there
	{
	
		//validations
		if(!isEmail($('#regemail').val()))
			return ons.notification.alert("Invalid Email Address");
		if($('#regpass').val() != $('#regpass2').val())
			return ons.notification.alert("Passwords don't match");
		
		
		suser = {
			email: $('#regemail').val(),
			password: $('#regpass').val(),
			usertype: 'student',
			token: 1911
		};

		

		userformdata = JSON.stringify(suser);
		console.log(userformdata);
		
		$.ajax(apiurl+"/user", {
			data : userformdata,
			contentType : 'application/json',
			type : 'POST',
		})
		.done(function(data) {
			if(data.error == 1)
				ons.notification.alert(data.msg.message);
			else
			{
				authuser = data.user;
				localStorage.setItem("authuser", JSON.stringify(authuser));
				User.current = data.user;
				ons.notification.alert("Welcome to StarTutors!", {title:"Done!"});
				app.login(true);
				
			}
			console.log(data);
		});
	},
	
}

var apiurl = "http://tuxlap:8888";
var authuser = {};
app.initialize();



(function($) {

                $.fn.parallax = function(options) {
					//sint = setInterval(function(){
						//currpos = this.css("background-position-x");
						//this.css("background-position-y", currpos+1);
					//}, 100);
                    //console.log(this);
                    
                }
            }(jQuery));
			
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}