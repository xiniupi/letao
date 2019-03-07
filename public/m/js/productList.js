var proName = '';
$(function(){
   // 页面刚加载调用当前查询商品的函数
    queryProduct();
    // 调用当前商品搜索页面的搜索功能
    searchProduct();
    // 调用商品排序功能
    sortProduct();
    // 调用下拉刷新和上拉加载的功能函数
    pullRefresh();
    goDetail();
    function queryProduct(){
         /* 思路
            1. 根据当前商品名称来搜索商品(商品名称就是用户在输入框输入内容也就是当前url参数 search的值)
            2. 调用查询商品的API
            3. 把后台返回商品列表的数据 调用模板引擎生成html结构
            4. 最后把生成html放到商品列表容器中 */
           proName = getQueryString('search');
       
        $.ajax({
            url: "/product/queryProduct",
            data:{
                   page:1,
                    pageSize:4,
                   proName:proName
                },
            success: function(res){
                var html = template('productListTpl',res);
                $('.mui-card-content .mui-col-xs-6').html(html);
            }
        })
       
    }
    function searchProduct(){
        $('.btn-search').on('tap',function(){
            var search = $('.input-search').val().trim();
           
            if(search == ''){
                mui.toast('请输入内容!',{ duration:'long', type:'div' }) ;
                return false;
            }
            var searchHistory = localStorage.getItem('searchHistory');
            if(searchHistory){
                searchHistory = JSON.parse(searchHistory);
            }else{
                searchHistory = [];
            }
            for(var i = 0;i<searchHistory.length;i++){
                if(searchHistory[i].key == search){
                    searchHistory.splice(i,1);
                    i--;
                }
            }
            searchHistory.unshift({
                key:search,
                time: new Date().getTime()
            })
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
           
            $('.input-search').val('');
            location = 'productList.html?search=' +search +'&time='+new Date().getTime();
        })
    
    }
    function sortProduct(){
         /* 思路
            1. 给所有排序按钮添加点击事件
            2. 切换active类名
            3. 获取当前排序的方式 (提前把所有按钮排序方式保存到按钮属性上 通过js去获取排序方式)
            4. 调用API传人当前商品排序的方式 和 排序顺序（1表示升序  2 表示降序）
            5. 获取后台排序后的商品数据 调用模板 
            6. 把模板渲染到页面 */
           $('.product-content .mui-card-header a').on('tap',function(){
               $(this).addClass('active').siblings().removeClass('active');
               var sort = $(this).data('sort');
               if(sort == 2){
                   $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
                   sort = 1;
               }else{
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                sort =2 ;
               }
               $(this).data('sort',sort);
               var type = $(this).data('type');
               var obj = {
                   page:1,
                   pageSize:4,
                   proName:proName};
                obj[type] = sort;
                $.ajax({
                    url: "/product/queryProduct",
                    data: obj,
                    success: function(res){
                        var html = template('productListTpl',res);
                        $('.mui-card-content .mui-col-xs-6').html(html);
                    }
                })
           })
    }
    function pullRefresh() {
        /* 思路
            1. 进行初始化下拉刷新和上拉加载更多
            2. 指定下拉刷新的回调函数 
            3. 指定上拉加载的回调函数
            4. 在下拉刷新回调函数 请求最新数据 并且 渲染页面 并且结束转圈圈
            5. 在上拉加载更多数据回调函数 请求更多数据 并且 追加页面 并且结束转圈圈
            6. 上拉可能没有数据了 结束并且提示没有数据了 */
        // 1. 初始化下拉刷新
        mui.init({
            pullRefresh: {
                // 指定当前下拉刷新的父容器 建议使用id选择器给区域滚动添加一个 pullrefresh id
                container: '#pullrefresh',
                // 初始化下拉刷新
                down: {
                    // 下拉刷新的回调函数 用真正的刷新数据 发送请求真实刷新数据和页面
                    callback: pulldownRefresh
                },
                // 初始化上拉加载更多
                up: {
                    // 上拉加载的回调函数 用来真正请求更多数据 追加到页面上
                    callback: pullupRefresh
                }
            }
        });
        // 2. 指定下拉刷新的具体业务函数
        function pulldownRefresh() {
            // 如果想要请求慢一点转久一点 加一个定时器延迟请求
            setTimeout(function () {
                // 4. 调用查询函数重新查询刷新页面
                queryProduct();
                // 5. 刷新完成要调用结束转圈圈的函数 函数代码一定不要写错 官网文档有错
                // mui('#pullrefresh').pullRefresh().endPulldown();
                // 使用官方demo文档里面新版代码结束转圈圈
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            }, 1000);
        }
        var page = 1;

        // 3. 指定上拉加载的具体业务函数
        function pullupRefresh() {
            // 如果想要请求慢一点转久一点 加一个定时器延迟请求
            setTimeout(function () {
                //   proName = getQueryString('search')
                // 6. 请求更多数据 请求下一页数据 定义一个page 进行 ++page
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        proName: proName,
                        // 定义一个变量page存储了当前页码数 请求下一页让page进行++ 要前自增
                        page: ++page,
                        pageSize: 4
                    },
                    success: function (res) {
                        console.log(res);
                        // 7. 判断如果数据已经没有长度 表示没有数据 不需要调用模板和追加 直接提示没有数据了
                        if (res.data.length > 0) {
                            // 8.1 调用模板生成商品列表结构
                            var html = template('productListTpl', res);
                            // console.log(html);
                            // 8.2 请求了更多数据下一页 追加到页面 append函数
                            $('.product-list .mui-row').append(html);
                            // 8.3 数据追加完毕要结束转圈圈 注意这个函数是up不是down
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            // 9. 没有数据 结束转圈圈 并且提示没有数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
            }, 1000)
        }
    }
    function goDetail(){
        $('.product-content').on('tap','.product-buy',function(){
            var id = $(this).data('id');
            location = 'detail.html?id='+id;
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