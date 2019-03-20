var page =1;
var totalPage =0;
$(function(){
  queryMessage();
  changeButton();
  
  function queryMessage(){
    $.ajax({
        url:"/user/queryUser",
        data:{
            page:page,
            pageSize:5
        },
        success:function(data){
            console.log(data);
          
            var html = template('indexTpl',data);
            $('.content').html(html);
            totalPage = Math.ceil(data.total/data.size);
            pagination();
        }
        
    })
    
  }
  function changeButton(){
      $('.content').on('click','.btn-change',function(){
         var isDelete = $(this).data('isdelete');
         console.log(isDelete);
         isDelete = isDelete == 1?0 : 1;
         $(this).data('isdelete',isDelete);
         var id = $(this).data('id');
         $.ajax({
            url:"/user/updateUser",
            type:'post',
            data:{
                id:id,
                isDelete:isDelete
            },
            success:function(data){
                console.log(data);
                if(data.success){
                    queryMessage();
                }
            }
         })
 
      })
  }
  function pagination(){
      $('.page-list').bootstrapPaginator({
        bootstrapMajorVersion: 3, //对应的bootstrap版本
        currentPage: page, //当前页数 也是外面定义的全局变量当前页码数
        numberOfPages: 10, //每次显示页数
        totalPages: totalPage, //总页数 外面定义全局变量totalPage
        shouldShowPage: true, //是否显示该按钮
        useBootstrapTooltip: true,
        //点击事件
        onPageClicked: function (event, originalEvent, type, nowPage) {
            console.log(nowPage);
            // nowPage就是当前点击的每一页
            // 把全局变量的page赋值为当前的nowPage
            page = nowPage;
            // 重新调用查询刷新页面
            queryMessage();
        }
    });
  }
})