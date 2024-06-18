document.getElementById('Add').onclick = function () {
    var username = document.getElementById('username').value;
    if (!username) {
        alert('No Username Entered');
    }
    else {
        chrome.storage.sync.set({ 'username': username }, function () {
            chrome.storage.local.get({ userIds: [] }, function (Ids) {
                document.getElementById('username').value = "";
                var userIds = Ids.userIds;
                var flag = 0;
                for (i = 0; i < userIds.length; i++) {
                    if (userIds[i].user == username) {
                        flag = 1;
                        alert('Username Already Exists');
                        break;
                    }
                }
                if (flag == 0) {
                    userIds.push({ 'user': username });
                    alert(username + ' added !');
                }
                chrome.storage.local.set({ userIds: userIds }, function () {

                });
            });
        });
    };
};

document.getElementById('Ratings').onclick = function() {
    chrome.storage.local.get({userIds: []}, function(Ids) {
        var userIds = Ids.userIds;
        var str = "<div class='heading_table'>Friends Ratings :</div><br><table id = 'customers'><tr><th>Username</th><th >Ratings</th></tr>";
        var str_new = str;
        var temp=0;
        var api = "http://codeforces.com/api/user.info?handles=";
        var api_user=api;
        for(i=0;i<userIds.length;i++){
			api=api+";"+userIds[i].user;
		}
        if(userIds.length==0)
			document.getElementById("rating_table").innerHTML = "No Data Entered :(";
		else{
			$.get(api,function(data){
				for(i=0;i<userIds.length;i++){
					str=str+"<tr><td><a href= http://codeforces.com/profile/"+data.result[i].handle+" target= '_blank'>"+data.result[i].handle+"</a>"+"<td>"+data.result[i].rating+"</tr>";
				}
                str = str + "</table>";
                document.getElementById('rating_table').innerHTML = str;
			});
		}
    });
};

document.getElementById('Delete').onclick = function() {
    if(confirm("This will delete all users from the friends list!!"))
    {
        var arr = new Array();
        chrome.storage.local.set({userIds: arr}, function() {
            alert('All Friends Removed!');
        });
    }
}

document.getElementById("Contests").onclick = function() {
	var con_api = "http://codeforces.com/api/contest.list";
	var str_contest= "<div class='heading_table'>Future Contests:</div> <br/><table id = 'customers' border = 0> <tr> <th>Contest</th> <th>Start Time</th> </tr>";
	$.get(con_api,function(data){
		for(i=9;i>=0;i--){
			if(data.result[i].phase!="BEFORE")
            {

            }
			else{
                var myDate = new Date( data.result[i].startTimeSeconds *1000);
				str_contest=str_contest+"<tr><td>"+data.result[i].name+"</td>" + "<td>" + myDate + "</td></tr>";
			}
		}
		str_contest=str_contest+"</table>"
		document.getElementById("Contest_table").innerHTML = str_contest;
	});
}