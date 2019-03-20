$(function(){
    $('.btn-login').on('click',function(){
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();
        $.ajax({
            url:"/employee/employeeLogin",
            type:"post",
            data:{
                username:username,
                password:password,
            },
            success:function(data){
                if(data.success){
                    location = 'index.html';
                }else{
                    if(data.error ==1000){
                        alert('用户名错误');
                    }else{
                        alert('密码错误');
                    }
                }
            }
            
        })
    })
})