var calendar={
    obj:{},
    res:'',
    festivalG:{
        "0101" : "元旦",
        "0214" : "情人节",
        "0305" : "雷锋日",
        "0308" : "妇女节",
        "0312" : "植树节",
        "0401" : "愚人节",
        "0501" : "劳动节",
        "0504" : "青年节",
        "0601" : "儿童节",
        "0701" : "中国诞辰",
        "0801" : "建军节",
        "0910" : "教师节",
        "1001" : "国庆节",
        "1224" : "平安夜",
        "1225" : "圣诞节"
    },
    monthText:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthTextS:["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    weekText:["日", "一", "二", "三", "四", "五", "六"],
    weekTextE:["SUN", "MON", "TUE", "WEB", "THU", "FRI", "SAT"],
    nstr : new Date(), //当前Date
    ynow : '', //年份
    mnow : '', //月份
    mcopy : '', //copy最初月份
    dnow : '', //今日日期
    clickYear : '',//点击后的年份
    n1str : '', //当月第一天Date
    firstday:'',//当月第一天星期几
    m_days:'', //各月份的总天数
    tr_str:'',//表格所需行数问题
    shiftMonth : '',//新组成的当前月份数组
    nowMonth:'',//当前月份
    getParams:function(){
        var _this=this;
        var date=new Date();
        _this.ynow = date.getFullYear();
        _this.mnow = date.getMonth();
        _this.mcopy = date.getMonth();
        _this.dnow = date.getDate();
        _this.clickYear = _this.ynow;
        _this.n1str = new Date(_this.ynow, _this.mnow, 1);
        _this.shiftMonth = _this.monthText.slice(_this.mnow).concat(_this.monthText.slice(0, _this.mnow));
        _this.nowMonth = _this.shiftMonth[0];
    },
    init:function(obj){
        this.obj=obj;
        var html='<div class="h-calendar">'+
            '<div class="calendar">\n' +
            '        <div class="calendar-head">\n' +
            '            <div class="calendar-year">\n' +
            '                <ul></ul>\n' +
            '            </div>\n' +
            '            <a href="#" class="calender-prev calender-prev-btn iconfont icon-arrow-left"></a>\n' +
            '            <a href="#" class="calender-next calender-next-btn iconfont icon-arrow-right"></a>\n' +
            '        </div>\n' +
            '        <div class="calendar-week">\n' +
            '            <table>\n' +
            '                <thead>\n' +
            '                <tr>\n' ;
        var weekTextE='';
        if(calendar.obj.weekTextE){
            weekTextE = calendar.obj.weekTextE;
        }else{
            weekTextE = calendar.weekTextE;
        }
        if(calendar.obj.mouthTextE){
            calendar.monthText = calendar.obj.mouthTextE;
        }
        weekTextE.forEach(function(item){
            html+='<td>'+item+'</td>';
        });
        html+='                </tr>\n' +
            '                </thead>\n' +
            '            </table>\n' +
            '        </div>\n' +
            '        <div class="calendar-day">\n' +
            '            <ul class="mui-row"></ul>\n' +
            '        </div>\n' +
            '        <div class="calendar-title">\n' +
            '            <i></i>\n' +
            '            <div></div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="calendar-choose">\n' +
            '        <div class="calendar-head">\n' +
            '            <div class="calendar-dyear">\n' +
            '                <ul>\n' +
            '                    <li>2017</li>\n' +
            '                </ul>\n' +
            '            </div>\n' +
            '            <a href="#" class="calender-prev-d calender-prev-btn iconfont icon-arrow-left"></a>\n' +
            '            <a href="#" class="calender-next-d calender-next-btn iconfont icon-arrow-right"></a>\n' +
            '        </div>\n' +
            '        <div class="calendar-month">\n' +
            '            <ul></ul>\n' +
            '        </div>\n' +
            '    </div></div>';
        $(obj.el).html(html);
        calendar.getParams();
        calendar.defaults();
        calendar.clickFun();
        calendar.yearHtml(calendar.clickYear, calendar.shiftMonth);
    },
    //初始化表格
    defaults:function(){
        var html = '';
        calendar.firstday = calendar.n1str.getDay(); //当月第一天星期几
        calendar.m_days = new Array(31, 28 + calendar.is_leap(calendar.ynow), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //各月份的总天数
        // calendar.tr_str = Math.ceil((calendar.m_days[calendar.mnow] + calendar.firstday) / 7);//表格所需行数问题
        calendar.tr_str = 6;//表格所需行数问题
        for (var i = 0; i < calendar.tr_str; i++) { //表格的行
            for (var k = 0; k < 7; k++) { //表格每行的单元格
                var idx = i * 7 + k; //单元格自然序列号
                var date_str = idx - calendar.firstday+1; //计算日期
                var hoverDate=null;
                var date_str_copy=date_str;
                var mnow_copy=calendar.mnow;
                var festivalText='';
                if (date_str <= 0) {
                    if(calendar.mnow == 0){
                        html += "<li data-date='" + calendar.clickYear + 12 + (calendar.m_days[11] + date_str) + k + "'>" + (calendar.m_days[11] + date_str) + "<br><span class='calendar-festival'>"+festivalText+"</span></li>";
                    }else{
                        html += "<li data-date='" + calendar.clickYear + calendar.mnow + (calendar.m_days[calendar.mnow - 1] + date_str) + k + "'>" + (calendar.m_days[calendar.mnow - 1] + date_str) + "<br><span class='calendar-festival'>"+festivalText+"</span></li>";
                    }
                } else if (date_str > calendar.m_days[calendar.mnow]) {
                    (calendar.mnow < 9) ?(mnow_copy = "0" + (calendar.mnow+2)):(mnow_copy=calendar.mnow+2);
                    if(calendar.mnow == 11){
                        ((date_str - calendar.m_days[0]) < 10) && (hoverDate = "0" + (date_str - calendar.m_days[0]));
                        html += "<li data-date='" + (calendar.clickYear+1) + "01" + hoverDate + k + "'>" + (date_str - calendar.m_days[0]) + "<br><span class='calendar-festival'>"+festivalText+"</span></li>";
                    }else{
                        ((date_str-calendar.m_days[calendar.mnow]) < 10) && (hoverDate = "0" + (date_str - calendar.m_days[0]));
                        html += "<li data-date='" + calendar.clickYear + mnow_copy + hoverDate + k + "'>" + (date_str-calendar.m_days[calendar.mnow])  + "<br><span class='calendar-festival'>"+festivalText+"</span></li>";
                    }
                } else {
                    (calendar.mnow < 9) ?(mnow_copy = "0" + (calendar.mnow+1)):(mnow_copy=calendar.mnow+1);
                    (date_str < 10) && (date_str_copy = "0" + date_str);
                    //打印日期：今天底色为红,周末红色字
                    if(k==0||k==6){
                        (date_str == calendar.dnow)&&(calendar.mnow==calendar.mcopy)&&(calendar.clickYear==calendar.ynow) ?
                            (html += "<li data-date='" + calendar.clickYear + mnow_copy+ date_str_copy + k + "' class='calendar-li-day calendar-new-day calendar-now-day'>" + date_str + "<br><span class='calendar-festival'>"+festivalText+"</span></li>") :
                            (html += "<li data-date='" + calendar.clickYear + mnow_copy + date_str_copy + k + "' class='calendar-li-day calendar-rest-day'>" + date_str + "<br><span class='calendar-festival'>"+festivalText+"</span></li>");
                    }else{
                        (date_str == calendar.dnow)&&(calendar.mnow==calendar.mcopy)&&(calendar.clickYear==calendar.ynow) ?
                            (html += "<li data-date='" + calendar.clickYear + mnow_copy+ date_str_copy + k + "' class='calendar-li-day calendar-new-day calendar-now-day'>" + date_str + "<br><span class='calendar-festival'>"+festivalText+"</span></li>") :
                            (html += "<li data-date='" + calendar.clickYear + mnow_copy + date_str_copy + k + "' class='calendar-li-day calendar-new-day'>" + date_str + "<br><span class='calendar-festival'>"+festivalText+"</span></li>");
                    }
                }//过滤无效日期（小于等于零的、大于月总天数的）
            }
        }
        $(".calendar-day>ul").html(html);
        calendar.obj.callback&&calendar.obj.callback();
        calendar.hoverDayInfor();
    },
    is_leap:function(year) {
        return (year % 100 == 0 ? calendar.res = (year % 400 == 0 ? 1 : 0) : calendar.res = (year % 4 == 0 ? 1 : 0));
    },
    //鼠标移入提示框
    hoverDayInfor:function(year) {
        if(calendar.obj.isHover) {
            $(".calendar-day li.calendar-new-day,.calendar-day li.calendar-rest-day").hover(function () {
                var weekDate = $(this).attr("data-date");
                var top = $(this).offset().top - $(".calendar-day").offset().top + $(this).height() + 72;
                var left = $(this).offset().left - $(".calendar-day").offset().left + $(this).width() + 10;
                var dayHoverInfor = calendar.weekText[weekDate.slice(8)];
                $(".calendar-title>div").html('<p>' + weekDate.slice(0, 4) + '-' + weekDate.slice(4, 6) + '-' + weekDate.slice(6, 8) + '</p><p>星期' + dayHoverInfor + '</p>');
                $(".calendar-title").css({top: top, left: left, display: "block"});
            }, function () {
                $(".calendar-title").css({display: "none"});
            });
        }
        calendar.obj.dayClick&&calendar.obj.dayClick();
    },
    //加载头部信息
    yearHtml:function(yearNum, shiftMonth) {
        var yearHtml = "";
        for (var i = 0; i < shiftMonth.length; i++) {
            yearHtml += '<li data-mouth="'+shiftMonth[i]+'">' + shiftMonth[i] + ' ' + yearNum + '</li>';
        }
        $(".calendar-year>ul").html(yearHtml);
        //月份头部点击
        $(".calendar-year > ul > li").click(function(){
            $(".calendar-dyear>ul>li").html($(this).html().split(" ")[1]+"年");
            $(".calendar").fadeOut();
            $(".calendar-choose").fadeIn();
            calendar.mheadClick();
        });
    },
    //加载月份选择的内容
    mheadClick:function(yearNum, shiftMonth) {
        var html='';
        for(var i=0;i<calendar.monthTextS.length;i++){
            (calendar.mnow==i)?
                (html += "<li data-date='"+calendar.monthText[i]+"' class='calendar-li-day calendar-new-day calendar-now-day'>" + calendar.monthTextS[i] + "</li>") :
                (html += "<li data-date='"+calendar.monthText[i]+"' class='calendar-li-day calendar-new-day'>" + calendar.monthTextS[i] + "</li>");
        }
        $(".calendar-month>ul").html(html);
        $(".calendar-month>ul>li").click(function(){
            $(this).siblings("li").removeClass("calendar-now-day");
            $(this).addClass("calendar-now-day");
            for(var j=0;j<calendar.monthText.length;j++){
                ($(this).attr("data-date")==calendar.monthText[j])&&(calendar.mnow=j);
            }
            calendar.monthclickD();
        });
        //年份头部点击
        $(".calendar-dyear > ul > li").click(function () {
            calendar.clickYear=$(this).html().slice(0,4);
            var flag=0;//记录当前是否选择月份
            for(var i=0;i<calendar.monthText.length;i++){
                if($(".calendar-month>ul>li:nth-child("+(i+1)+")").hasClass("calendar-now-day")){
                    flag=1;break;
                }
            }
            if(flag){
                for(var j=0;j<calendar.monthText.length;j++){
                    ($(".calendar-month>ul>li.calendar-now-day").attr("data-date")==calendar.monthText[j])&&(calendar.mnow=j);
                }
            }
            calendar.monthclickD();
        });
    },
    //获取新的年月
    monthclickD:function() {
        calendar.shiftMonth = calendar.monthText.slice(calendar.mnow).concat(calendar.monthText.slice(0, calendar.mnow));
        calendar.n1str = new Date(calendar.clickYear, calendar.mnow, 1); //当月第一天Date
        calendar.yearHtml(calendar.clickYear, calendar.shiftMonth);
        calendar.defaults();
        $(".calendar").fadeIn();
        $(".calendar-choose").fadeOut();
    },
    clickFun:function(){
        //左侧按钮点击事件-主
        $(".calender-prev").click(function () {
            calendar.leftCallback();
        });
        //右侧按钮点击事件-主
        $(".calender-next").click(function () {
            calendar.rightCallback();
        });
        //左侧按钮点击事件-次
        $(".calender-prev-d").click(function(){
            calendar.leftYearCallback();
        });
        //右侧按钮点击事件-次
        $(".calender-next-d").click(function(){
            calendar.rightYearCallback();
        });
    },
    leftCallback:function(){
        if(calendar.mnow==0){
            calendar.mnow=11;
            calendar.clickYear--;
        }else{
            calendar.mnow--;
        }
        $(".calendar-year>ul").css({animation: "slideLeft 1s", "-webkit-animation": "slideLeft 1s"});
        calendar.nowMonth = $(".calendar-year>ul>li:first-child").html().split(" ")[0];
        calendar.shiftMonth = calendar.shiftMonth.concat(calendar.shiftMonth.splice(0, calendar.shiftMonth.length - 1));
        if (calendar.nowMonth == "January") {
            calendar.clickYear = calendar.clickYear - 1;
        }
        calendar.n1str = new Date(calendar.clickYear, calendar.mnow, 1); //当月第一天Date
        $(".calendar-year>ul").css({animation: ""});
        calendar.yearHtml(calendar.clickYear, calendar.shiftMonth);
        calendar.defaults();
    },
    rightCallback:function(){
        if(calendar.mnow==11){
            calendar.clickYear++;
            calendar.mnow=0;
        }else{
            calendar.mnow++;
        }
        $(".calendar-year>ul").css({animation: "slideRight 1s", "-webkit-animation": "slideRight 1s"});
        calendar.nowMonth = $(".calendar-year>ul>li:first-child").html().split(" ")[0];
        calendar.shiftMonth = calendar.shiftMonth.concat(calendar.shiftMonth.splice(0, 1));
        if (calendar.nowMonth == "December") {
            calendar.clickYear = calendar.clickYear + 1;
        }
        calendar.n1str = new Date(calendar.clickYear, calendar.mnow, 1); //当月第一天Date
        $(".calendar-year>ul").css({animation: ""});
        calendar.yearHtml(calendar.clickYear, calendar.shiftMonth);
        calendar.defaults();
        // console.log(calendar.nowMonth,calendar.shiftMonth,calendar.ynow,calendar.mnow,calendar.dnow,calendar.clickYear);
    },
    leftYearCallback:function(){
        calendar.clickYear--;
        $(".calendar-dyear>ul>li").html((parseInt($(".calendar-dyear>ul>li").html().slice(0,4))-1)+"年");
        calendar.mheadClick();
    },
    rightYearCallback:function(){
        calendar.clickYear++;
        $(".calendar-dyear>ul>li").html((parseInt($(".calendar-dyear>ul>li").html().slice(0,4))+1)+"年");
        calendar.mheadClick();
    },
};