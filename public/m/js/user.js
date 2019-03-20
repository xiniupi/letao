$(function(){
    queryUserMessage()
    exitLogin()
   function queryUserMessage(){
    $.ajax({
        url:"/user/queryUserMessage",
        success:function(data){
            console.log(data);
            if(data.error){
                location = 'login.html?returnUrl='+location.href;
            }else{
                $('#main .user').html(data.username);
                $('#main .mobile').html(data.mobile);
            }
        }
    })
   }
   function exitLogin(){
    $('.btn-exit').on('tap',function(){
        $.ajax({
            url:"/user/logout",
            success:function(data){
                console.log(data);
                if(data.success){
                    location = 'login.html?returnUrl='+location.href;
                   
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