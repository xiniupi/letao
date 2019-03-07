$(function () {
  
    getProductDetail();
    goShoppingCart();
    function slide() {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
        });
    }
   function getProductDetail(){
       var Id = getQueryString('id');
    $.ajax({
        url:'/product/queryProductDetail',
        data:{id:Id},
        
        success:function(data){
        //    console.log(data.size);
        //    console.log(data);
           var size = data.size;
           var arr = size.split('-');
        //    console.log(arr);
           var newSize = [];
           for(var i = arr[0]-0;i<=arr[1]-0;i++){
                newSize.push(i);
           }
           data.size = newSize;
            var html = template('detailTpl',data);
            $('.detail').html(html);
            slide();
            //区域滚动
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            //初始化输入框
            mui('.mui-numbox').numbox();
            $('.btn-size').on('tap',function(){
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            })
        }
    })
    
   }

   function goShoppingCart(){
       $('.btn-add').on('tap',function(){
           var productId = getQueryString('id');
           console.log(productId);
           var num = mui('.mui-numbox').numbox().getValue();
           var size = $('btn-size').data('size');
           $.ajax({
               url:"/cart/addCart",
               type:'post',
               data:{
                productId:productId,
                num:num,
                size:size
               },
               success:function(data){
                    console.log(data);
                   if(data.error ==400){
                   location = 'login.html?returnUrl='+location.href;
                   } else{
                    
                    mui.confirm( '是否离开结账', '温馨提示', ['是','否'], function(e){
                        if(e.index ==1){
                            mui.toast('请继续剁手',{ duration:'long', type:'div' }) 
                        }else{
                            location = 'cart.html';
                        }
                    },'div')
                   }
               }
           })
       
       })
   }


   function getQueryString(name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = location.search.match(reg);
    if (arr != null) {
        return decodeURI(arr[0].split('=')[1]);
    }
    return "";
}
})