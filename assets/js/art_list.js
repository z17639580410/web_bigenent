$(function () {
//定义一个查询的参数对象将来请求数据的时候需要将请求对象提交到服务器
var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
}
var form = layui.form
var layer = layui.layer
//定义美化时间的过滤器
template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
//定义补零的方法
function padZero(n) {
    return n > 9 ? n : '0' + n
}
initTable()

function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取文章列表失败！')
            }
            //使用模板引擎渲染数据
            //  console.log(res)
            var htmlstr = template('tpl-table', res)
            $('tbody').html(htmlstr)
            renderPage(res.total)
        }
    })
}

function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取分类数据失败！')
            }
            //调用模板引擎渲染分类的可选项
            var htmlstr = template('tpl-cate', res)
            //console.log(htmlstr)
            $('[name=cate_id]').html(htmlstr)
            //通知layui重新渲染表单的ui结构
            form.render()
        }
    })
}
initCate()
$('#form-search').on('submit', function (e) {
    e.preventDefault()
    //获取表单中选项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件重新渲染表格的数据
    initTable()

})
//定义渲染分页的函数
var laypage = layui.laypage;

function renderPage(total) {
    laypage.render({
        elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
            ,
        count: total //数据总数，从服务端得到
            ,
        limit: q.pagesize,
        curr: q.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        jump: function (obj, first) { //分页切换时出发jump回调函数,可以通过first来判断使用哪种方式触发的jump函数
            //如果first为true证明是调用了laypage.render()方法触发
            //如果first为false证明是点击页码是触发的
            q.pagenum = obj.curr //把最新的页码值赋值给q的pagenum
            q.pagesize = obj.limit
            //initTable()根据最新获取q的数据列表并渲染表格，在这里调用会造成死循环不能进行页面的跳转
            if (!first) {
                initTable()
            }
        }
    })
}
$('tbody').on('click', '.btn-delete', function () {
    //获取删除按钮的个数 
    var len = $('.btn-delete').length
    var id = $(this).attr('data-id')
    console.log(id)
    layer.confirm('确认删除？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                //判断最后一页是否剩余数据如果没有页码值-1
                if (len === 1) {
                    //如果len等于1那么删完之后就没有任何数据了
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 //页码值最小等1
                }
                initTable()
            }
        })

        layer.close(index)
    })
})


})
