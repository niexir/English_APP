var main_framework={
    startDate:'2019-02-24 19:04:12',
    study_mouth:8,
    periodical:'2019-4',
    difficulty:'进阶',
    periodical_list:[{
        value: '1 8 2017-10-24 2018-06-24',
        text: '第一期'
    },{
        value: '2 4 2018-06-24 2018-10-24',
        text: '第二期'
    },{
        value: '3 4 2018-10-24 2019-02-24',
        text: '第三期'
    },{
        value: '4 8 2019-02-24',
        text: '第四期'
    }],

    periodical_num:'',
    init:function(){
        this.difficultyFun();
        main_framework.periodical_num=main_framework.periodical_list.length-1;
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
        calendar.init({
            el:'#calendar',
            weekTextE:["S", "M", "T", "W", "T", "F", "S"],
            mouthTextE:['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
            dayClick:function(){
                $(".calendar-day li.already-learning,.calendar-day li.unstudied,.calendar-day li.repair-learning,.calendar-day li.calendar-now-day").click(function(){
                    mui.toast($(this).data('date'),{ duration:'long', type:'div' })
                });
            },
            callback:function(){
                var already_learning=['20190401','20190403','20190404','20190408','20190410','20190411','20190412','20190415','20190416','20190417'];
                var repair_learning=['20190406','20190409','20190413','20190414'];
                var unstudied=['20190402','20190405','20190407','20190418'];
                var list=$('#calendar .calendar-day li.calendar-li-day');
                for(var i=0;i<list.length;i++){
                    var item=$(list[i]).data('date')+'';
                    item=item.substring(0,8);
                    for(var j=0;j<already_learning.length;j++){
                        if(item===already_learning[j]){
                            $(list[i]).addClass('already-learning');
                        }
                    }
                    for(var j=0;j<unstudied.length;j++){
                        if(item===unstudied[j]){
                            $(list[i]).addClass('unstudied');
                        }
                    }
                    for(var j=0;j<repair_learning.length;j++){
                        if(item===repair_learning[j]){
                            $(list[i]).addClass('repair-learning');
                        }
                    }
                }
            }
        });
        main_framework.listenTouchDirection($('.calendar-day')[0]);
        $('#periodical_num').html('<span><b class="color-d7846c weight-normal font-16">'+main_framework.periodical.split('-')[0]+'</b> 第 <b class="color-d7846c weight-normal font-16">'+main_framework.periodical.split('-')[1]+'</b> 期</span>');
        $('#difficulty').html('难度：'+main_framework.difficulty);
    },
    //滑动事件操作
    addHandler: function (element, type, handler) {
        if (element.addEventListener)
            element.addEventListener(type, handler, false);
        else if (element.attachEvent)
            element.attachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    //日历滑动
    listenTouchDirection: function (target) {
        this.addHandler(target, "touchstart", handleTouchEvent);
        this.addHandler(target, "touchend", handleTouchEvent);
        this.addHandler(target, "touchmove", handleTouchEvent);
        var startX;
        var startY;
        function handleTouchEvent(event) {
            switch (event.type){
                case "touchstart":
                    startX = event.touches[0].pageX;
                    startY = event.touches[0].pageY;
                    break;
                case "touchend":
                    var spanX = event.changedTouches[0].pageX - startX;
                    var spanY = event.changedTouches[0].pageY - startY;
                    if(Math.abs(spanX) > Math.abs(spanY)){      //认定为水平方向滑动
                        if(spanX > 30){
                            var oneDate=$($('.calendar-new-day')[0]).data('date')+'';
                            oneDate=oneDate.substring(0,4)+'-'+oneDate.substring(4,6)+'-'+oneDate.substring(6,8)+' 00:00:00';
                            if(main_framework.periodical_list.length){
                                var periodical_arr=main_framework.periodical_list[main_framework.periodical_num].value.split(' ');
                                if(periodical_arr[3]){
                                    if(!main_framework.compareDate(periodical_arr[2]+' 00:00:00',oneDate)){
                                        calendar.leftCallback();
                                    }else{
                                        mui.toast('已经到达最初时间咯！')
                                    }
                                    return;
                                }
                            }
                            if(!main_framework.compareDate(main_framework.startDate,oneDate)){
                                calendar.leftCallback();
                            }else{
                                mui.toast('已经到达最初时间咯！')
                            }
                        } else if(spanX < -30){ //向左
                            var lastDate=$($('.calendar-new-day')[$('.calendar-new-day').length-1]).data('date')+'';
                            lastDate=lastDate.substring(0,4)+'-'+lastDate.substring(4,6)+'-'+lastDate.substring(6,8)+' 23:59:59';
                            var nowDate=main_framework.getEndDate();
                            if(main_framework.periodical_list.length){
                                var periodical_arr=main_framework.periodical_list[main_framework.periodical_num].value.split(' ');
                                if(periodical_arr[3]){
                                    if(main_framework.compareDate(periodical_arr[3]+' 23:59:59',lastDate)){
                                        calendar.rightCallback();
                                    }else{
                                        mui.toast('已经到达最终时间咯！')
                                    }
                                    return;
                                }
                            }
                            if(main_framework.compareDate(nowDate,lastDate)){
                                calendar.rightCallback();
                            }else{
                                mui.toast('还未学习哦！')
                            }
                        }
                    }
                    break;
                case "touchmove":
                    event.preventDefault();
                    break;
            }
        }
    },
    //期刊事件
    difficultyFun:function(){
        var periodicalPicker = new mui.PopPicker();
        periodicalPicker.setData(main_framework.periodical_list);
        var periodical_btn = document.getElementById('periodical_btn');periodical_btn.addEventListener('tap', function(event) {
            periodicalPicker.show(function(items,index){
                var periodical_arr=items[0].value.split(' ');
                main_framework.startDate=periodical_arr[2];

                main_framework.study_mouth=periodical_arr[2];
                calendar.clickYear=parseInt(periodical_arr[2].split('-')[0]);
                calendar.mnow=parseInt(periodical_arr[2].split('-')[1])-1;
                main_framework.periodical_list.forEach(function(item,index){
                    if(items[0].text===item.text){
                        main_framework.periodical_num=index;
                    }
                });
                $('#periodical_num').html('<span><b class="color-d7846c weight-normal font-16">'+periodical_arr[2].split('-')[0]+'</b> 第 <b class="color-d7846c weight-normal font-16">'+periodical_arr[0]+'</b> 期</span>');
                $(".calendar-dyear>ul>li").html((parseInt($(".calendar-dyear>ul>li").html().slice(0,4))-1)+"年");
                calendar.monthclickD();
            });
        }, false);
    },
    //计算最后期限
    getEndDate:function (date,num,flag) {
        var d ='';
        if(date){
            d = new Date(date);
        }else{
            d = new Date();
        }
        if(flag=='mouth'){
            // 将日期设置为下月一号
            d.setMonth(d.getMonth()+num);
        }else if(flag=='time'){
            // 将日期设置为下月一号
            d.setTime(d.getTime()+num);
        }else if(flag=='date'){
            // 将日期设置为下月一号
            d.setDate(num);
        }
        var getMonth=(d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1);
        var getDate=d.getDate()<10?"0"+d.getDate():d.getDate();
        var getHours=d.getHours()<10?"0"+d.getHours():d.getHours();
        var getMinutes=d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes();
        var getSeconds=d.getSeconds()<10?"0"+d.getSeconds():d.getSeconds();
        return d.getFullYear()+'-'+getMonth+'-'+getDate+' '+getHours+":"+getMinutes+':'+getSeconds;
    },
    //计算时间大小
    compareDate:function (nowDate,endDate) {
        var start=new Date(nowDate);
        var end=new Date(endDate);
        var start_s=start.getTime();
        var end_s=end.getTime();
        if(start_s>=end_s){
            return true;
        }else{
            return false;
        }
    },
};
main_framework.init();