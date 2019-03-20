$(function(){
    var vCode = '';
    $('.btn-register').on('tap',function(){
         $('.mui-input-group input').each(function(){
            console.log($(this).val());
            var isChecked = true;
            if($(this).val().trim() == ""){
                mui.toast(this.placeholder,{ duration:'long', type:'div' }) ;
                isChecked = false;
                return false;
            }
            if(isChecked){
                var mobile = $('.mobile').val().trim();
                if(!(/^1[34578]\d{9}$/.test(mobile))){ 
                    mui.toast('手机号有误',{ duration:'long', type:'div' }) ; 
                    return false; 
                }
                var username = $('.username').val().trim();
                if(!/^[0-9a-zA-Z]+$/.test(username)){
                    mui.toast('用户名必须且只含有数字和字母,6-10位',{ duration:'long', type:'div' }) ; 
                    return false; 
                }
                var password = $('.password').val().trim();
                var secondPassword = $('.secondPassword').val().trim();
                if(password != secondPassword){
                    mui.toast('两次密码不一样',{ duration:'long', type:'div' }) ; 
                    return false; 
                }
                var vcode = $('.input-vcode').val().trim();
                if(vcode != vCode){
                    mui.toast('验证码不一致',{ duration:'long', type:'div' }) ; 
                    return false; 
                }
                $.ajax({
                    url:"/user/register",
                    type:'post',
                    data:{
                        username:username,
                        password:password,
                        mobile:mobile,
                        vCode:vcode
                    },
                    success:function(data){
                        if(data.error){
                            mui.toast(data.message,{ duration:'long', type:'div' }) ; 
                        }else{
                            location = 'login.html?returnUrl=user.html';
                        }
                    }
                })
            }   
        })
    })
    $('.btn-vcode').on('tap',function(){
        $.ajax({
            url:"/user/vCode",
            success:function(data){
                    console.log(data.vCode);
                    vCode = data.vCode;
            }
        })
    })
})