$(function(){
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();
    initScroll();
    // 1. 点击搜索添加记录 添加事件
    // 2. 获取当前输入内容 搜索的内容
    // 3. 判断如果没有输入内容 提示输入
    // 4. 把记录添加到本地存储中
    // 5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
    // 6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
    // 7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
    // 8. 加完后把数组保存到本地存储中（转成json字符串）
    function addHistory(){
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
            queryHistory();
            $('.input-search').val('');
            location = 'productList.html?search=' +search +'&time='+new Date().getTime();
        })
    }
     function queryHistory(){
         var searchHistory = localStorage.getItem('searchHistory');
         if(searchHistory){
            searchHistory = JSON.parse(searchHistory);
        }else{
            searchHistory = [];
        }
         var html = template('searchTpl',{searchHistory});
         $('.search-history ul').html(html);
     }
     function deleteHistory(){
        // 1. 给所有删除按钮添加点击事件（页面历史记录列表是动态渲染查询了之后才有列表）要使用委托添加事件 
        // 2. 点击删除按钮的要获取当前要删除的元素的索引
        // 3. 再获取搜索记录的数组 把这个索引对应的值删掉
        // 4. 重新把删除完成后的数组 保存到本地存储中
        // 5. 调用查询刷新列表
        $('.search-history ul').on('tap','.btn-delete',function(){
            var index = $(this).data('index');
            var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
            searchHistory.splice(index,1);
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
            queryHistory();
        })

     }
     function clearHistory(){
        $('.search-history .btn-clear').on('tap',function(){
            localStorage.removeItem('searchHistory');
            queryHistory();
        })
     }


     function initScroll(){
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators: false //是否显示滚动条
        });
     }
    
})