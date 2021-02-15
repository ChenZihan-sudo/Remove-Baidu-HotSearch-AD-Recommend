// ==UserScript==
// @name         Remove-Baidu-HotSearch-AD-Recommend
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  移除百度广告 设置热搜和推荐可选开关
// @author       ChenZihan
// @match        https://www.baidu.com/*
// @grant        none
// ==/UserScript==

(function() {
    //设置按钮节点

    //暴露dpBtn方便移入节点
    var dpBtn = document.createElement("span");

    function dpBtnF(id, style, value, innerHTML) {
        dpBtn.id = id;
        dpBtn.style = style;
        dpBtn.value = value;
        dpBtn.innerHTML = innerHTML;
    }

    let word = null; //检测搜索词是否更换
    let loginstatus = null; //登录状态
    let pageLocation = null; //页面位置
    let triggered = null; //是否被触发

    //使用var还是使用let
    //检查页面位置状态
    //1.登录状态 登录 未登录
    //2.确认网页位置 在首页 在等待搜索界面 在搜索内容界面
    function checkLoginStatus() {
        if (document.getElementById("s_content_2") == null) {
            console.log("未登陆");
            loginstatus = false;
        } else {
            console.log("已登陆");
            loginstatus = true;
        }
    }

    function confirmWebPage() {
        checkLoginStatus()
        if (getSearchWord() == "百度一下，你就知道") {
            console.log("在首页")
            pageLocation = "index"
        } else if (document.getElementById("ent_sug") != null) {
            console.log("在等待搜索页面")
            pageLocation = "waitToSearch"
        } else if (document.getElementById("con-ar") != null) {
            console.log("在搜索内容页面")
            pageLocation = "searchMain"
        }
    }

    //多class寻找
    //通过2个class进行查找 要求：仅需2个class就能定位节点位置 返回节点信息
    function findNodeByClass(fClass, SClass) {
        var fClassFind = document.getElementsByClassName(fClass);
        if (fClassFind.length == 0) { console.log("没有找到") } else if (fClassFind.length == 1) { return fClassFind[0]; } else {
            for (var i = 0; i < fClassFind.length; i++) {
                if (fClassFind[i].className == fClass + " " + SClass || fClassFind[i].className == SClass + " " + fClass) {
                    return fClassFind[i];
                }
            }
        }
    }

    //设置按钮
    //1.根据页面位置进行选择设置位置
    //2.移入节点 并设置按钮触发器
    function setButton() {
        //使用一次 checkLoginStatus() 和 confirmWebPage()
        //如果 在首页 如果 登录 则  不然未登录 则
        confirmWebPage()
        if (pageLocation == "index") {
            console.log("设置按钮，位于首页")
            checkLoginStatus()
            if (loginstatus == false) {
                //未登录 设置按钮 并移入节点 设置触发器
                dpBtnF("dpBtnI", "margin-left: 10px;border-bottom: 2px solid rgb(78, 113, 242);font-size: 14px;color: #282828;", "ToOpen", "开启");
                document.getElementsByClassName("s-hotsearch-title")[0].appendChild(dpBtn);
                dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
            } else {
                dpBtnF("dpBtnI", "margin-left: 120px; margin-top:-1px;border-bottom:2px solid #4e71f2;font-size: 14px;color: #282828;", "ToOpen", "开启");
                document.getElementsByClassName("s-rank-title")[0].appendChild(dpBtn);
                dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
            }
        } else if (pageLocation == "searchMain") {
            console.log("设置按钮，位于搜索内容界面")
                //如果 在搜索内容页面 设置按钮 并移入节点 设置触发器
            dpBtnF("dpBtnI", "margin-left: 10px; margin-top:-1px;border-bottom:2px solid #4e71f2;font-size: 14px;color: #282828;", "ToOpen", "开启"); //设置节点
            findNodeByClass("cr-title", "c-gap-bottom-xsmall").appendChild(dpBtn);
            dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
            setHotSearch()
        } else if (pageLocation == "waitToSearch") {
            console.log("设置按钮，等待搜索")
                //如果在等待搜索界面 则不设置监听按钮 
                //设置延时器, 时间 检查 如果不在未搜索页面中止延时
                //之后 设置在搜索界面相同的按钮
            var Interval = setInterval(() => {
                console.log("设置延时")
                if (document.getElementById("ent_sug") == null) {
                    clearInterval(Interval)
                    console.log("延时中止")
                        //————————————————————————————————————————————————————————————
                        //如果 在搜索内容页面 设置按钮 并移入节点 设置触发器
                    dpBtnF("dpBtnI", "margin-left: 10px; margin-top:-1px;border-bottom:2px solid #4e71f2;font-size: 14px;color: #282828;", "ToOpen", "开启"); //设置节点
                    findNodeByClass("cr-title", "c-gap-bottom-xsmall").appendChild(dpBtn);
                    dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
                    setHotSearch()
                        //—————————————————————————————————————————————————————————————
                }
            }, 1000);
        }
    }
    //设置显示状态 由按钮事件触发 
    //检查显示状态
    function setHotSearch() {
        //获取按钮状态 
        //存在bug调试以确认 var Button = document.getElementById("dpBtnI");
        //设置 值 显示状态
        //如果 按钮是关闭的 按钮应 显示开启 value值为close
        //按钮事件触发     按钮变为显示关闭 value值为open
        console.log(document.getElementById("dpBtnI").value)

        if (document.getElementById("dpBtnI").value == "ToOpen") {
            document.getElementById("dpBtnI").value = "ToClose"
            document.getElementById("dpBtnI").innerHTML = "开启"
            setDisplayOfHotSearch()
        } else if (document.getElementById("dpBtnI").value == "ToClose") {
            document.getElementById("dpBtnI").value = "ToOpen"
            document.getElementById("dpBtnI").innerHTML = "关闭"
                //设置显示状态 
                //获取 网页位置
            setDisplayOfHotSearch("display")
                //如果出现bug 更改为使用全局变量
        }
    }

    function setDisplayOfHotSearch(dpyChange) {
        console.log("从setHotSearch()获取的显示", dpyChange)
            //查看dpyChange 如果 display 设置 显示 不然 设置不显示
            //调整登录状态下按钮显示位置及样式
        if (dpyChange == "display") {
            //显示状态 不设置样式隐藏
            var setDisplay = ""
            if (loginstatus == true) {

                dpBtn.setAttribute("class", "title-text c-font-medium");
            }
        } else {
            setDisplay = "none"
            if (loginstatus == true) {

                dpBtn.setAttribute("class", "title-text c-font-medium");
            }
        }
        //获取界面位置 如果 首页 如果 登录 则 未登录 则
        //在内容界面 设置显示
        //未在内容界面 无按钮 无需设置显示
        confirmWebPage()
        if (pageLocation == "index") {
            checkLoginStatus()
            if (loginstatus == false) {
                document.getElementById("hotsearch-content-wrapper").style.display = setDisplay;
                document.getElementById("hotsearch-refresh-btn").style.display = setDisplay;
            } else {
                document.getElementsByClassName("hot-refresh")[0].style.display = setDisplay;
                document.getElementsByClassName("s-news-rank-content")[0].style.display = setDisplay;
            }
        } else if (pageLocation == "searchMain") {
            findNodeByClass("opr-toplist1-update", "opr-toplist1-link").style.display = setDisplay;
            findNodeByClass("c-table", "opr-toplist1-table").style.display = setDisplay;
        }

    }
    //获取搜索词
    function getSearchWord() {
        word = document.querySelector("head > title").innerHTML
        return word;
    }
    //  触发器-->进行 设置按钮 与setButton()进行绑定
    //选择合适时机进行设置 刷新时进行设置 
    //1.首页到搜索页面     改变搜索词
    //2.搜索页面到搜索页面 出现幕布 或 在输入时直接刷新=>搜索词进行改变
    //结合输入框失焦触发器进行辅助
    //超时, 时间 后执行

    //输出结果 只能执行一次

    function WhenRefresh(WhereTrigger) {
        console.log("函数WhenRefresh已运行", triggered)
        if (triggered == false) {
            triggered = true;
            //来自输入框或按钮的触发
            //对比输入词是否改变 对比时间 设置超时 有改变 触发设置按钮 改变word使下一次仍能触发
            //无改变 检查是否出现幕布 出现幕布 设置延时 幕布消失 清除延时 对比输入词是否改变 改变 设置按钮
            //重新设置触发 当确认搜索词已改变时重新设置触发 
            //只是点击了输入框什么也没做 =>
            //加入广告移除触发 移入
            setTimeout(() => {
                console.log("setTimeout已启用")
                if (word != getSearchWord()) {
                    word = getSearchWord()
                    setButton()
                    dpyNoneAd()
                    console.log("搜索词已改变，页面加载完成")
                } else if (word == getSearchWord()) {
                    console.log("搜索词未改变")
                    if (document.getElementById("_mask") != null) {
                        console.log("存在幕布，设置延时")
                        var interval = setInterval(() => {
                            //————————————————————————————————————————————
                            console.log("设置了延时", word)
                            if (word != getSearchWord() || document.getElementById("_mask") == null) {
                                console.log("页面加载完成，搜索词已改变，取消延时")
                                clearInterval(interval)
                                word = getSearchWord()
                                setButton()
                                dpyNoneAd()
                            }
                            //————————————————————————————————————————————
                        }, 500);
                    } else {
                        console.log("没有任何改变，设置triggered=false")
                        triggered = false;
                    }
                }
            }, 500)
        }
    }


    //输入框触发器
    document.getElementById("kw").addEventListener("focusout", function() {
            triggered = false;
            WhenRefresh("fromInput");
        })
        //按钮触发器
    document.getElementById("su").addEventListener("mousedown", function() {
        triggered = false;
        WhenRefresh("fromButton");
        console.log("成功了！")
    })

    //移除百度页面广告
    //确认网页位置 在搜索内容界面时 移除广告
    //找到nums new_nums 添加信息 已移除广告 按钮：撤销移除
    function setRemoveAdInformation() {

        var RemoveAdTitle = document.createElement("span");
        RemoveAdTitle.id = "RemoveAdTitle"
        RemoveAdTitle.innerHTML = " 已移除广告 正在等待移除二次插入广告..."
        RemoveAdTitle.setAttribute("class", "nums_text");
        findNodeByClass("nums", "new_nums").appendChild(RemoveAdTitle);
        // var RemoveAdBtn = document.createElement("button");
        // RemoveAdBtn.id = "RemoveAdBtn"
        // RemoveAdBtn.innerHTML = "撤销移除"
        // findNodeByClass("nums", "new_nums").appendChild(RemoveAdBtn);

    }

    let checkTimes = 0;
    //寻找广告列表 如果 列表不为空 移除
    function dpyNoneAd() {
        console.log("广告移除启动")
        confirmWebPage()
        if (pageLocation == "searchMain") {
            var AdList = document.querySelectorAll('[cmatchid]');
            if (AdList.length > 0) {
                console.log("查找到广告列表，启用移除")
                for (var i = 0; i < AdList.length; i++) {
                    AdList[i].setAttribute("style", "display:none;");
                }
                setRemoveAdInformation()
                removeAfterDpyAd() //设置二次移除
            } else {
                console.log("未发现广告")
            }
        }
    }
    let checkOnIsRemoveAfterAd = false;

    function removeAfterDpyAd() {
        var adRemoveInterval = setInterval(() => {
            var afterAdList = document.getElementsByClassName("ec_tuiguang_pplink")
            console.log(afterAdList.length)
            if (afterAdList.length > 0) {
                console.log("检测到二次插入广告，移除广告")
                for (var a = 0; a < afterAdList.length; a++) {
                    document.getElementsByClassName("ec_tuiguang_pplink")[a].parentNode.parentNode.remove()
                }
                clearInterval(adRemoveInterval)
                removeAfterDpyAd()
                document.getElementById("RemoveAdTitle").innerHTML = " 已移除广告 移除广告成功"
                checkOnIsRemoveAfterAd = true;
            } else {
                console.log("未发现二次插入广告")
                checkTimes++;
                console.log("检查次数", checkTimes)
                if (checkTimes > 250) {
                    clearInterval(adRemoveInterval)
                    checkTimes = 0
                    if (checkOnIsRemoveAfterAd == false) {
                        document.getElementById("RemoveAdTitle").innerHTML = " 已移除广告"
                    } else {
                        checkOnIsRemoveAfterAd = false;
                    }
                }
            }
        }, 10);
    }

    // function dpyAd() {
    //     var AdList = document.querySelectorAll('[cmatchid]');
    //     if (AdList != null) {
    //         for (var i = 0; i < AdList.length; i++) {
    //             AdList[i].setAttribute("style", "");
    //         }
    //     }
    // }

    getSearchWord() //启动脚本时获取搜索词
    setButton() //启动脚本时设置按钮
    dpyNoneAd() //启动脚本时移除广告
    confirmWebPage() //启动脚本时确认网页位置

    if (pageLocation == "index") {
        setHotSearch() //启动脚本时设置热搜显示状态
    }

    //关闭推荐
    checkLoginStatus() //启动脚本时确认登录状态
    if (pageLocation == "index" && loginstatus == true) {
        console.log("在首页，已登录")

        //设置节点
        var RecChangeButton = document.createElement("span");
        RecChangeButton.id = "RecChangeButton"
        RecChangeButton.innerHTML = "开启推荐"

        //移入父节点
        var parentNode = document.getElementById("s_menus_wrapper")
        parentNode.appendChild(RecChangeButton);

        //设置监听事件
        document.getElementById("RecChangeButton").addEventListener('click', changeStatusOfRec); //添加按钮监听

        //设置推荐隐藏
        document.querySelector("#s_xmancard_news_new > div > div.water-container").style.display = "none"
    }

    function changeStatusOfRec() {
        var RecChangeButton = document.getElementById("RecChangeButton")
        if (RecChangeButton.innerHTML == "开启推荐") {
            RecChangeButton.innerHTML = "关闭推荐"
            document.querySelector("#s_xmancard_news_new > div > div.water-container").style.display = ""
        } else {
            RecChangeButton.innerHTML = "开启推荐"
            document.querySelector("#s_xmancard_news_new > div > div.water-container").style.display = "none"
        }
    }
})();