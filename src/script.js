var lastX = 0;
var lastY = 0;
var stabledX = 0;
var stabledY = 0;
var gui_duration = 7200;
const dur_capacity = 7200;
var idle_confirm = 0;
var idle_time = 0;
const idle_time_max = 300;
const recharge_speed = 20; //multiplier - 60 is recharge in 1hr / speed_factor
const speed_factor = 1; //debug only. recommended debug value: 180
const bar_length = 5;
var iff_offline_time = 0;
var iff_offline_playcount = 0;
document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
document.onmousewheel = function(){
    idle_confirm = 2147483647;
    idle_count_func();
};
document.onmousedown = function(){
    idle_confirm = 2147483647;
    idle_count_func();
};
document.onmouseup = function(){
    idle_confirm = 2147483647;
    idle_count_func();
};
document.onkeydown = function(){
    idle_confirm = 2147483647;
    idle_count_func();
};
document.onmousemove = function(event) {
    /*
    The following code has been disabled due to:
    There are no need to support old IE.
    ---------------------------------------------------

    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    */

    // Use event.pageX / event.pageY here

    idle_confirm++;
    lastX = event.pageX;
    lastY = event.pageY;

    /*
    if(event.pageX === 0 && event.pageY === 0 &&
        Math.abs(lastX - event.pageX) > 40 &&
        Math.abs(lastY - event.pageY) > 40){
        screen_console_log("Welcome back, Misaka_0x447f.");
        screen_console_log("Initializing HUD");
    }
    */
};
function DOMContentLoaded(){
    setInterval(updateMe, 33);
    setInterval(rest_timer, 100);
    setInterval(idle_count_func, 1000);
    setInterval(auto_timer, 1000);
    setInterval(long_term_timer, 30000);
}
function updateMe(){
    function make_range(value, range, percent){
        return value - range / 2 + range * percent / 100;
    }
    stabledX += (lastX - stabledX) / 5;
    stabledY += (lastY - stabledY) / 5;
//    document.getElementById("mouse-indicator").style.top = stabledY + "px";
//    document.getElementById("mouse-indicator").style.left = stabledX + 20 + "px";
    document.getElementById("left-bottom-hud-1").style.bottom = make_range(8, 1.3, stabledY/10.8) + "rem";
    document.getElementById("left-bottom-hud-1").style.left = make_range(5, 1, -stabledX/19.2) + "rem";

    document.getElementById("right-bottom-hud-1").style.bottom = make_range(8, 1.3, stabledY/10.8) + "rem";
    document.getElementById("right-bottom-hud-1").style.right = make_range(5, 1, stabledX/19.2) + "rem";
//    document.getElementById("left-bottom-hud-1").style.transform =
//        "rotate3d(" + make_range(0.15, 0.15, event.pageY/10.8) + ", 0, -0.015, 15deg)";
    document.getElementById("left-top-hud-1").style.top = make_range(8, 1.3, -stabledY/10.8) + "rem";
    document.getElementById("left-top-hud-1").style.left = make_range(5, 1, -stabledX/19.2) + "rem";

    document.getElementById("right-top-hud-1").style.top = make_range(8, 1.3, -stabledY/10.8) + "rem";
    document.getElementById("right-top-hud-1").style.right = make_range(5, 1, stabledX/19.2) + "rem";
}
function rest_timer() {
    idle_time += 0.1;
    if(idle_time > idle_time_max){
        if(gui_duration < dur_capacity){
            gui_duration += 0.1 * recharge_speed * speed_factor;
        }else if(gui_duration > dur_capacity){
            gui_duration = dur_capacity
        }else{
            /*
            screen_console_log("[" + (new Date()).getTime() + "]Capacity recharged.")
            */
        }
    }else{
        gui_duration -= (Math.random() / 20 + 0.1) * speed_factor;
    }
    var bar_factor = gui_duration / dur_capacity;
    var target_html_pre = string_repeat("I", Math.floor(bar_factor * bar_length * 10)) + "<span style=\"opacity: 0.2\">" +
        string_repeat("I", limit_range(Math.floor(bar_length * 10 - bar_factor * bar_length * 10)), 0, bar_length * 10) + "</span>";
    var i_count = 0;
    var target_html = "";
    for(var i=0; i<target_html_pre.length; i++){
        if(target_html_pre[i] === "I"){
            i_count++;
        }
        if(i_count % 10 !== 0 || target_html_pre[i] !== "I"){
            target_html += target_html_pre[i];
        }else{
            target_html += " ";
        }
    }
    document.getElementById("hud-progressbar").innerHTML = target_html;
}
function idle_count_func() {
    if(idle_confirm > 5){
        idle_time = 0;
    }
    idle_confirm = 0;
}
function auto_timer(){
    iff_offline_time += speed_factor;
    var dateobj = new Date();
    document.getElementById("right-bottom-hud-1-date-time").innerHTML = dateobj.toString().slice(0, 33);
    document.getElementById("right-bottom-hud-1-active-monitor-timer").innerHTML = friendly_time_duration(idle_time);
}
function long_term_timer(){
    var bar_factor = gui_duration / dur_capacity;
    var bar_object = document.getElementById("left-bottom-hud-1-dur-title");
    var iff_title_object = document.getElementById("left-bottom-hud-1-iff-title");
    var iff_object = document.getElementById("left-bottom-hud-1-iff-content");
    var hud_status = document.getElementById("right-bottom-hud-1-status-text")
    if(bar_factor < 0.4 && bar_factor > 0.15){
        class_remove(bar_object, "system-bg-red");
        class_add(bar_object, "system-bg-yellow");
        hud_status.innerHTML = "[Warning] Low battery. Charge needed.";
        hud_status.className = "system-yellow";
    }else if(bar_factor <= 0.15){
        class_add(bar_object, "system-bg-red");
        class_remove(bar_object, "system-bg-yellow");
        hud_status.innerHTML = "[Error] Low battery. Connection closed !";
        hud_status.className = "system-red";
    }else{
        class_remove(bar_object, "system-bg-red");
        class_remove(bar_object, "system-bg-yellow");
        hud_status.innerHTML = "Your HUD is being monitored and protected.";
        hud_status.className = "system-green";
    }

    var iff_offline = document.getElementById("IFF-offline");
    function play_iff_offline_voice(){
        if(idle_time < 15 && iff_offline_playcount < 5){
            iff_offline_playcount++;
            iff_offline.play();
        }
    }
    function reset_iff_playcount() {
        iff_offline_playcount = 0;
    }

    var random_iff = Math.random();
    if(bar_factor < 0.3 - random_iff * 0.2 && bar_factor > 0.1 - random_iff * 0.05) {
        iff_object.innerHTML = "状态存疑/不确定 - 等待后续判断";
        class_add(iff_title_object, "system-bg-yellow");
        class_remove(iff_title_object, "system-bg-red");
        iff_offline_time = 0;
        reset_iff_playcount();
    }else if(bar_factor > 0 && bar_factor <= 0.1 - random_iff * 0.05){
        class_remove(iff_title_object, "system-bg-yellow");
        class_add(iff_title_object, "system-bg-red");
        iff_object.innerHTML = "停止工作 - " + friendly_time_duration(iff_offline_time);
        play_iff_offline_voice();
    }else if(bar_factor <= 0) {
        iff_object.innerHTML = "脱机 - " + friendly_time_duration(iff_offline_time);
        class_remove(iff_title_object, "system-bg-yellow");
        class_add(iff_title_object, "system-bg-red");
        play_iff_offline_voice();
    }else{
        class_remove(iff_title_object, "system-bg-yellow");
        class_remove(iff_title_object, "system-bg-red");
        iff_object.innerHTML = "联机";
        iff_offline_time = 0;
        reset_iff_playcount();
    }
}
function friendly_time_duration(seconds){
	if(seconds <= 3){
		return "刚刚"
	}else if(seconds < 60){
        return Math.floor(seconds) + "秒前";
    }else if(seconds < 3600){
        return Math.floor(seconds / 60) + "分钟前";
    }else{
        return Math.floor(seconds / 3600) + "小时前";
    }
}

/*
function screen_console_log(log_content){
    console.log(log_content);
    var prev_content = document.getElementById("console-content").innerHTML.split("<br>");
    prev_content = prev_content.clean("");
    prev_content.push(log_content);
    var back_content = "";
    for(var i = prev_content.length - 8; i < prev_content.length; i++) {
        if(i >= 0){
            back_content += prev_content[i] + "<br/>";
        }
    }
    document.getElementById("console-content").innerHTML = back_content;
}
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === deleteValue) {
            this.splice(i, 1);//返回指定的元素
            i--;
        }
    }
    return this;
};
*/
/*
function class_exist(obj, name){
    return obj.classList.contains(name);
}
*/
function class_add(obj, name){
    obj.classList.add(name);
    return true;
}
function class_remove(obj, name){
    obj.classList.remove(name);
    return true;
}
function limit_range(value, a, b){
    if(value<a){
        return a;
    }
    if(value>b){
        return b;
    }
    return value;
}
function string_repeat(string, i){
    var returns = "";
    while(i > 0){
        if(i > 10){
            i-=10;
            returns += string + string + string + string + string + string + string + string + string + string
        }else{
            i--;
            returns += string
        }
    }
    return returns;
}
function button1_click(){
    document.getElementById("right-top-hud-notice-group").style.display = "none";
}
/*
function get_random_comm(){
    //NO DO: fix name && timer error
    var comm_base = [
        [
            "wei, zaima",
            "buzai, cmn",
            "buzai, cmn!",
            "惊了，怎么御坂里面也有猛男的"
        ],
        [
            "ping",
            "pong"
        ],
        [
            "0x447f",
            "感觉这样毫无意义。",
            "得寻找有意义的片段才行。",
            "但是即便找到了有意义的对话",
            "也知道那是自己制作的。",
            "总之，写了一个壁纸，",
            "来幻想自己加入了御坂网络。",
            "0x4480",
            "Sodayo(便乘)",
            "小姑娘要不要来包昏睡红茶呢",
            "0x447f",
            "我想我没心情开玩笑。"
        ]
    ];
    function get_random_continue(comm_array, types, typesarg){
        if(comm_array.length > 1 && isHex(comm_array[0])){
            var target_string = comm_array[0].slice(2);
            setInterval(function(){
                get_random_continue(comm_array, "single", target_string)
            }, ((Math.random() * 5) + 5) * 1000);
            send_msg(comm_array, "single", target_string)
        }else if(comm_array.length > 0){
            setInterval(function(){
                get_random_continue(comm_array, types, typesarg)
            }, ((Math.random() * 5) + 5) * 1000);
            send_msg(comm_array, types, typesarg);
        }
        function send_msg(comm_array, types, typesarg){
            if(isHex(comm_array[0])){
                comm_array.shift();
            }
            if(types === "single"){
                screen_console_log("Misaka_0x" + typesarg + ": " + comm_array[0]);
            }else{
                var misaka = Math.floor((Math.random() * 9950) + 10050).toString(16);
                screen_console_log("Misaka_0x" + misaka + ": " + comm_array[0]);
            }
            comm_array.shift();
        }
    }
    var run_random_comm = Math.floor(Math.random() * comm_base.length * 1.5);
    if(run_random_comm < comm_base.length){
        get_random_continue(comm_base[run_random_comm]);
    }
    setTimeout(get_random_comm, ((Math.random() * 60) + 30) * 1000);
}
function isHex(a){
    return parseInt(a).toString(16) === a.slice(2);
}
*/