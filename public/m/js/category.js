$(function(){
    //发送ajax请求
    $.ajax({
        url:'/category/queryTopCategory',
        beforeSend:function(){
            $('.mask').show();
        },
        complete:function(){
            $('.mask').hide();
        },
        success:function(data){
            // console.log(data)
            // return;
            var html = template('categoryLeftTpl',data);
            $('.category-left ul').html(html);
        }
    })
    var oldId
    $('.category-left ul').on('tap','li',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var id = $(this).data('id');
        if(id == oldId)
        return false;
        queryRightCategory(id);
        oldId = id;
       
    })
    //封装右侧的函数
    function queryRightCategory(id){
        $.ajax({
            url:'/category/querySecondCategory',
            data:{id:id},
            success: function(data){
                var html = template('categoryRightTpl',data);
                $('.category-right .mui-row').html(html);
            }
        })
    }
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false //是否显示滚动条
    });
})