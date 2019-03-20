var page = 1;
var totalPage = 0;

$(function(){
    queryCategory();
   selectCategory();
   function queryCategory(){
       $.ajax({
           url:"/category/querySecondCategoryPaging",
          data:{
            page:page,
            pageSize:5
          },
          success:function(data){
              console.log(data);
              totalPage = Math.ceil(data.total/data.size);
              var html = template('secondCategoryTpl',data);
                $('.content tbody').html(html);
                pagination();
          }
       })
   }
  
   function selectCategory(){
       $('.btn-add').on('click',function(){
           $.ajax({
            url:"/category/queryTopCategory",
            success:function(data){
                // console.log(data);
                var html = '';
                for(var i = 0;i<data.rows.length;i++){
                    html += '<option value="'+data.rows[i].id+'">'+data.rows[i].categoryName+'</option>';
                }
                // console.log(html);
                 $('.select-category').html(html);
            }
           })
           
       })
       var file = null;
       $('.select-logo').on('change',function(){
            if(this.files[0].length<0){
                return false;
            }
           file = this.files[0];
           var url = window.URL.createObjectURL(file);
           $('.brand-logo').attr('src',url);
       })
       $('.btn-save').on('click',function(){
        var categoryId =  $('.select-category').val();
        console.log(categoryId);
        var brandName = $('.brand-name').val().trim();
        console.log(brandName);
           if(file == null){
               return false;
           }
           var formData = new FormData();   
           formData.append('pic1',file);
           $.ajax({
               url:"/category/addSecondCategoryPic",
               data:formData,
               type:"post",
               processData: false,
               // 3.10 请求报文的类型不要设置   
               contentType: false,
               // 3.11 取消异步
               async: false,
               // 3.12 取消缓存
               cache:false,
               success:function(data){
                    console.log(data);
                   if(data.picAddr){
                       var brandLogo = data.picAddr;
                       $.ajax({
                           url: "/category/addSecondCategory",
                           type: 'post',
                           data:{
                               categoryId: categoryId,
                               brandName:brandName,
                               brandLogo: brandLogo,
                               hot: 1
                           },
                           success:function(data){
                             if(data.success){
                                queryCategory();
                            }
                        }
                       })
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