var page = 1;
var totalPage = 0;
$(function(){
    queryCategory();
   addCategory();
   function queryCategory(){
       $.ajax({
           url:"/category/queryTopCategoryPaging",
          data:{
            page:page,
            pageSize:5
          },
          success:function(data){
              console.log(data);
              totalPage = Math.ceil(data.total/data.size);
              var html = template('firstCategoryTpl',data);
                $('.content table').html(html);
                pagination();
          }
       })
   }
   function addCategory(){
    $('.btn-save').on('click',function(){
        var categoryName =  $('#categoryName').val().trim();
         $.ajax({
             url:"/category/addTopCategory",
             type:"post",
             data:{
                 categoryName:categoryName
             },
             success:function(data){
                 console.log(data);
                 if(data.success){
                     
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
          queryCategory();
      }
  });
}
})