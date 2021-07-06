$(function(){
    getUserInfo()
    var layer = layui.layer
    $('#btn-loginout').on('click',function(e){
        e.preventDefault()
        layer.confirm('确定退出？',{icon:3,title:'提示'},function(index){
            // do something
            //1.清空本地存储的token
            localStorage.removeItem('token')
            //2.跳转到登录页
            location.href='./login.html'
            console.log('1')
            //关闭 confirm 询问框
            layer.close(index)


        })
    
    })
    
})
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        //请求头
        headers:{
            Authorization:localStorage.getItem('token')
        },
        success:function(res){
          if(res.status !== 0){return layui.layer.msg('获取用户信息失败')}
          renderAvatar(res.data)
        },
        //无论成功还是失败最终都会调用complete函数
        //在complete回调函数中可以使用res.responsejson拿到响应消息
        /*complete:function(res){
            if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！'){
                //1.强制清空token
                localStorage.removeItem('token')
               //2.强制跳转到登录页
                location.href='./login.html'
            }
        }*/
    })
}
//渲染头像函数
function renderAvatar(user){
    //1.获取用户名称
    var name =user.nickname || user.username
    //2.设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;'+name)
    //3.按需求渲染用户头像
    if(user.user_pic !== null){
       $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        var first =name[0].toUpperCase()
        $('.text-avatar').html(first)
        
    }

}