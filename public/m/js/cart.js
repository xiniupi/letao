$(function(){
    queryCart();
    deleteCart();
    editCart();

   function queryCart(){
    $.ajax({
        url:'/cart/queryCart',
        success:function(data){
            console.log(data);
            if(data.error){
                location = 'login.html?returnUrl'+getQueryString('returnUrl');
            }else{
                var html = template('cartTpl',{list:data});
                $('#main .mui-table-view').html(html);
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
                getTotal();
                $('.mui-checkbox input:checked').change(function(){
                    getTotal();
                })
            }
        }
    })
 
   }
   function deleteCart(){
       $('#main .mui-table-view').on('tap','.btn-delete',function(){
        var id = $(this).data('id');    
        var li = this.parentNode.parentNode;
      
        mui.confirm( '温馨提示', '删除商品吗', ['是','否'], function(e){
           if(e.index==1){
            mui.swipeoutClose(li);
           }else{
               $.ajax({
                   url:"/cart/deleteCart",
                   data:{id:id},
                   success:function(data){
                    if(data.success == true){
                        mui.toast('删除成功',{ duration:'long', type:'div' }) ;
                        queryCart();
                    }
                   }
               })
           }
        } ,'div' )
       })
   }
   function editCart(){
    $('#main .mui-table-view').on('tap','.btn-edit',function(){
        var data = $(this).data('edit');
        console.log(data)
        var arr = data.productSize.split('-');
        console.log(arr);
        var proSize = [];
        for(var i = arr[0]-0;i<=arr[1]-0;i++){
            console.log(i);
            proSize.push(i);
        }
        data.size = proSize;
        console.log(data.size)
        var html = template('eidtTpl',data);
        console.log(html);
        html = html.replace(/[\r\n]/g, "");
        mui.confirm( html, '删除商品吗', ['是','否'], function(e){
          
           var num =  mui('.mui-numbox').numbox().getValue();
          var size = $('.btn-size.mui-btn-warning').data('size');
         
            if(e.index==1){
             mui.swipeoutClose(li);
            }else{
                $.ajax({
                    url:"/cart/updateCart",
                    type:'post',
                    data:{
                        id:data.id,
                        size:size,
                        num:num
                    },
                    success:function(data){
                     if(data.success == true){
                        queryCart();
                     }
                    }
                })
            }
         } ,'div' )
         mui('.mui-numbox').numbox();
         $('.btn-size').on('tap',function(){
             $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            
         })
    })
}
    function getTotal(){
        var checks = $('.mui-checkbox input:checked');
        var allTotal=0;
        checks.each(function(){
            var price = $(this).data('price');
            var num = $(this).data('num');
            var total = price*num;
            allTotal += total;
            
        })
        allTotal = allTotal.toFixed(2);
        $('#total span').html(allTotal);
    }

    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        console.log(arr);
        if (arr != null) {
            return decodeURI(arr[0].substr(arr[0].indexOf('=') + 1));
        }
        return "";
    }
})