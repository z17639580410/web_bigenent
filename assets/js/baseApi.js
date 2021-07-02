//注意：每次调用$.get()或$.post()或$.ajax()的时候
//会先调用ajaxPrefilter 这个函数
//在这个函数中可以拿到ajax提供的配置对象
$.ajaxPrefilter(function(options){
    //在发起请求之前统一拼接请求的根路径
   options.url = 'http://api-breakingnews-web.itheima.net'+options.url

if(options.url.indexof('/my/') !== -1){
    //统一为有权限的接口设置请求头
    //ondexof方法如果不包含options.url会返回-1
   options.headers={
    Authorization:localStorage.getItem('token')
   }
}
})