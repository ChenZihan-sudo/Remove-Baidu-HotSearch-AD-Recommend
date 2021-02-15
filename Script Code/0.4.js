//设置按钮节点

//暴露dpBtn方便移入节点
var dpBtn = document.createElement("button");

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
    if (document.getElementById("s-hotsearch-wrapper") != null || document.getElementById("s_content_2") != null) {
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
        checkLoginStatus()
        if (loginstatus == false) {
            //未登录 设置按钮 并移入节点 设置触发器
            dpBtnF("dpBtnI", "padding:2px;margin:6px;margin-top:0px;", "close", "开启");
            document.getElementsByClassName("s-hotsearch-title")[0].appendChild(dpBtn);
            dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
        } else {
            dpBtnF("dpBtnI", "padding: 2px;margin-right:170px;margin-top: -10px;", "close", "开启");
            document.getElementsByClassName("s-rank-title")[0].appendChild(dpBtn);
            dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
        }
    } else if (pageLocation == "waitToSearch") {
        //如果 在搜索内容页面 设置按钮 并移入节点 设置触发器
        dpBtnF("dpBtnI", "", "close", "开启"); //设置节点
        findNodeByClass("cr-title", "c-gap-bottom-xsmall").appendChild(dpBtn);
        dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
    } else if (pageLocation == "waitToSearch") {
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
                dpBtnF("dpBtnI", "", "close", "开启"); //设置节点
                findNodeByClass("cr-title", "c-gap-bottom-xsmall").appendChild(dpBtn);
                dpBtn.addEventListener('click', setHotSearch); //添加按钮监听
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
    if (document.getElementById("dpBtnI").value = "close") {
        document.getElementById("dpBtnI").value = "open"
        document.getElementById("dpBtnI").innerHTML = "关闭"
            //设置显示状态
            //获取 网页位置
        setDisplayOfHotSearch("display")
            //如果出现bug 更改为使用全局变量
    } else {
        document.getElementById("dpBtnI").value = "close"
        document.getElementById("dpBtnI").innerHTML = "开启"
        setDisplayOfHotSearch()
    }
}

function setDisplayOfHotSearch(dpyChange) {
    //查看dpyChange 如果 display 设置 显示 不然 设置不显示
    //调整登录状态下按钮显示位置及样式
    if (dpyChange == "display") {
        //显示状态 不设置样式隐藏
        var setDisplay = ""
        if (loginstatus == true) { dpBtn.style = "padding: 2px;margin-right:110px;margin-top: -10px;"; }
    } else {
        setDisplay = "none"
        if (loginstatus == true) { dpBtn.style = "padding: 2px;margin-right:170px;margin-top: -10px;"; }
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

    if (triggered == false) {
        triggered = true;
        //来自输入框或按钮的触发
        //对比输入词是否改变 对比时间 设置超时 有改变 触发设置按钮 改变word使下一次仍能触发
        //无改变 检查是否出现幕布 出现幕布 设置延时 幕布消失 清除延时 对比输入词是否改变 改变 设置按钮
        //重新设置触发 当确认搜索词已改变时重新设置触发 
        //只是点击了输入框什么也没做 =>
        setTimeout(() => {
            if (word != getSearchWord()) {
                word = getSearchWord()
                setButton()
            } else if (word == getSearchWord()) {
                if (document.getElementById("_mask") != null) {
                    var interval = setInterval(() => {
                        //————————————————————————————————————————————
                        if (word != getSearchWord()) {
                            clearInterval(interval)
                            word = getSearchWord()
                            setButton()
                        }
                        //————————————————————————————————————————————
                    }, 1000);
                } else {
                    triggered = false;
                }
            }
        }, 500)
    }
}
getSearchWord()
console.log(getSearchWord())

//输入框触发器
document.getElementById("kw").addEventListener("focusout", function() { WhenRefresh("fromInput") })

//按钮触发器
document.getElementById("su").setAttribute("onclick", "WhenRefresh('fromButton')");