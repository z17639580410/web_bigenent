$(function(){

    var layer = layui.layer
     // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)
  //为上传按钮绑定点击事件
  $('#btnimg').on('click',function(){
    $('#file').click()
  })
  //为文件选择框绑定change事件
  $('#file').on('change',function(e){
      //获取用户选择的文件
      var fileList = e.target.files
      if(fileList.length === 0){
        return layer.msg('请选择文件！')
      }
      //拿到用户选择的文件
      var file = fileList[0]
      //根据选择的文件创建一个url地址
      var nweImgUrl = URL.createObjectURL(file)
      //先销毁旧的裁剪区域再重新设置图片路径之后再重新创建裁剪区域
      $image.cropper('destroy').attr('src',nweImgUrl).cropper(options)
  })
  //为确定按钮绑定点击事件
  $('#btnUpload').on('click',function(){
    var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 100,
      height: 100
    }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //调用接口把头像上传到服务器
      $.ajax({
        method:'POST',
        url:'/my/update/avatar',
        data:{
            avatar:dataURL
        },
        success:function(res){
            if(res.status !== 0){
                return layer.msg('头像更新失败！')
            }
            window.parent.getUserInfo()
        }
      })
  })
})