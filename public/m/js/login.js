$(function(){
    $('.btn-login').on('tap',function(){
        var userName = $('.userName').val().trim();
        if(userName == ''){
            mui.toast('请输入用户名',{ duration:'long', type:'div' }) ;
            return false;
        }
        var password = $('.password').val().trim();
        if(password == ''){
            mui.toast('请输入密码',{ duration:'long', type:'div' }) ;
            return false;
        }
        console.log(password)
        $.ajax({
            url:"/user/login",
            type:'post',
            data:{
                username:userName,
                password:password
            },
            success:function(data){
                console.log(data);
                if(data.error==403){
                    mui.toast(data.message,{ duration:'long', type:'div' }) 
                }else{
                    var returnUrl = getQueryString('returnUrl');
                    location = returnUrl;
                }
            }
        })
    })
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