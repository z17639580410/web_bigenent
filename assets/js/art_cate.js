$(function(){
    var layer = layui.layer
    var form = layui.form
    var index = null
    initArticleList()
    function initArticleList(){
            $.ajax({
                method:'GET',
                url:'/my/article/cates',
                success:function(res){
                    if(res.status !== 0){
                        return layui.layer.msg('加载文章失败！')
                    }
                 var htmlstr =  template('articleList',res)
                 $('tbody').html(htmlstr)
                }
            })
    }
    //为添加类别按钮添加点击事件
    $('#btnAdd').on('click',function(){
   index= layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加文章分类',
            content:$('#tanchu').html()
        })
    })
    //通过代理的形式为form-add添加submit事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    layer.msg('新增分类失败！')
                }
                initArticleList()
                layer.msg('新增分类成功！')
                //根据索引关闭对应的弹出层
                layer.close(index)
            }
        })
    })
    var index1 = null
    $('tbody').on('click','.btn-edit',function(){
        index1 = layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加文章分类',
            content:$('#edit').html()
        }) 
       var id =$(this).attr('data-id')
       console.log(id)
       $.ajax({
           method:'GET',
           url:'/my/article/cates/'+id,
           success:function(res){
               console.log(res)
               form.val('form-edit',res.data)
           }
       })
    })
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功')
                layer.close(index1)
                initArticleList()
            }
        })
    })
    //通过代理的形式为删除按钮添加点击事件
    $('tbody').on('click','.btn-delete',function(){
        var id =$(this).attr('data-id')
        console.log(id)
        layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功')
                     layer.close(index)
                     initArticleList()
                }
            })
            
        })
    })
})