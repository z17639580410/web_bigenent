$(function () {
    var layer = layui.layer
    var form = layui.form
    //定义加载文章分类的方法
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎渲染下拉菜单
                console.log(res)
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }
    initEditor()
    var $image = $('#image')


    var options = {
        aspectRatio: 400 / 280, //宽高比例
        preview: '.img-preview'
    }

    // 初始化裁剪区域
    $image.cropper(options)
    $('#xuanzhe').on('click', function () {
        $('#coverfile').click()
    })
    //监听coverfile的change事件
    $('#coverfile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg('请选择图片')
        }
        var file = files[0]
        var newImgUrl = URL.createObjectURL(file)
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options)
    })
    var art_state = '已发布'
    $('#btn-save').on('click', function () {
        art_state = '草稿'

    })
    $('#form-pub').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault()
        //创建一个form表单对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        //将封面裁剪过后的图片转换为文件对象得到文件对象后进行后续的操作
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存储到fd中
                fd.append('cover_img',blob)
                //然后发起ajax请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,//如果向服务器提交的是formdata格式的数据必须定义以下两个配置
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('文章发布失败！')
                }
                layer.msg('文章发布成功！')
               location.href = './../article/art_list.html'
            }
        })
    }
})