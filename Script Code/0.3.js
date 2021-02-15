var dpBtn = document.createElement("button");

var dpBtnF = function(id, style, value, innerHTML) {
    dpBtn.id = id;
    dpBtn.style = style;
    dpBtn.value = value;
    dpBtn.innerHTML = innerHTML;
}

let word = null;
//——————————————关闭首页热点————————————————————
closeHS();


function closeHS() {

    //确认登录状态
    var loginstatus;
    var check = document.getElementById("s_content_2")
    console.log("确认登录状态", check)
    if (check == null) {
        //未登陆
        console.log("未登陆");
        loginstatus = false;
    } else {

        console.log("已登陆");
        loginstatus = true;
    }

    //确认网页位置

    //var pageCheck = document.getElementById("con-ar")
    //var multiCheck = document.getElementById("ent_sug")
    if (document.getElementById("con-ar") != null || document.getElementById("ent_sug") != null) {
        SearchInPage = true;
        console.log("在搜索内容页面")
    } else {
        var SearchInPage = false;
        console.log("不在搜索内容页面")
    }




    // var a = findNodeByClass("cr-title", "c-gap-bottom-xsmall")
    // console.log("biaoti", a)
    // var b = findNodeByClass("opr-toplist1-update", "opr-toplist1-link")
    // console.log("huanyihuan", b)
    // var c = findNodeByClass("c-table", "opr-toplist1-table")
    // console.log("neirong", b)

    hotSearch("none"); //设置关闭状态
    //debugger;



    if (SearchInPage == false) {
        if (loginstatus == false) {
            dpBtnF("dpBtnI", "padding:2px;margin:6px;margin-top:0px;", "close", "开启", 1); //设置节点
        } else {
            dpBtnF("dpBtnI", "padding: 2px;margin-right:170px;margin-top: -10px;", "close", "开启", 1); //设置节点
        }
    } else {
        dpBtnF("dpBtnI", "", "close", "开启"); //设置节点
    }

    //移至父级下
    // var targetNode;

    if (SearchInPage == false) {
        if (loginstatus == false) {
            var targetNode = document.getElementsByClassName("s-hotsearch-title")[0];
        } else {
            targetNode = document.getElementsByClassName("s-rank-title")[0];
        }
    } else {
        targetNode = findNodeByClass("cr-title", "c-gap-bottom-xsmall");
    }
    if (targetNode != undefined) {
        targetNode.appendChild(dpBtn);
    }



    dpBtn.addEventListener('click', IHtSearS); //添加按钮监听



    //检查在搜索页面下是否关闭 未关闭重新启动并关闭 
    //会导致添加多个触发器 删除触发器 重新启用
    if (SearchInPage == true) {
        console.log("页面检查")
            //检查元素是否存在
        console.log(document.getElementById("_mask"), "mubu")
        if (document.getElementById("con-ar") == null || document.getElementById("_mask") != null) {
            //删除触发器
            clear = document.getElementById("dpBtnI").removeEventListener('click', IHtSearS); //删除按钮监听
            console.log("清除触发2", clear)
            setTimeout(() => { closeHS() }, 1000);
            console.log("未成功关闭=====>重新启动关闭函数并删除触发器")
            SearchInPage = true;
        }
    }

    //运行时记录搜索词 
    word = document.querySelector("head > title").innerHTML
}

//封装--多class寻找
//通过2个class进行查找 需要两个class在一个节点 只出现一次
function findNodeByClass(fClass, SClass) {
    var fClassFind = document.getElementsByClassName(fClass);
    if (fClassFind.length == 0) { console.log("没有找到的说") } else if (fClassFind.length == 1) { return fClassFind[0]; } else {
        for (var i = 0; i < fClassFind.length; i++) {
            if (fClassFind[i].className == fClass + " " + SClass || fClassFind[i].className == SClass + " " + fClass) {
                return fClassFind[i];
            }
        }
    }
}

function hotSearch(status, SearchInPage, loginstatus) {
    console.log("被使用", status)
    if (SearchInPage == false) {
        if (loginstatus == false) {
            document.getElementById("hotsearch-content-wrapper").style.display = status;
            document.getElementById("hotsearch-refresh-btn").style.display = status;
        } else {
            document.getElementsByClassName("hot-refresh")[0].style.display = status
            document.getElementsByClassName("s-news-rank-content")[0].style.display = status
        }
    } else {

        var a = findNodeByClass("opr-toplist1-update", "opr-toplist1-link")
        var b = findNodeByClass("c-table", "opr-toplist1-table")
        if (a != undefined && b != undefined) {
            a.style.display = status
            b.style.display = status
        }


    }

}

function IHtSearS() {
    var BtnStatus = document.getElementById("dpBtnI");
    if (BtnStatus.value == "close") {
        //修改事件状态
        hotSearch("");
        BtnStatus.value = "open";
        BtnStatus.innerHTML = "关闭";
        if (loginstatus == true) {
            dpBtn.style = "padding: 2px;margin-right:110px;margin-top: -10px;";
        }
    } else {
        hotSearch("none");
        BtnStatus.value = "close";
        BtnStatus.innerHTML = "开启";
        if (loginstatus == true) {
            dpBtn.style = "padding: 2px;margin-right:170px;margin-top: -10px;";
        }
    }
}

//设置页面变化触发器
var inputChange = document.getElementById("kw")
inputChange.addEventListener("focusout", function() {
    if (document.getElementById("s-hotsearch-wrapper") == null) {
        //1.不在未搜索页面
        setTimeout(() => {
            var clear;
            if (document.getElementById("_mask") != null && document.getElementById("ent_sug") == null) {
                setTimeout(() => { closeHS() }, 500);
                clear = document.getElementById("dpBtnI").removeEventListener('click', IHtSearS); //删除按钮监听
                console.log("删除触发器", clear)
            } else if (word != document.querySelector("head > title").innerHTML) {
                console.log("当前词", word)
                    //重新存储变量
                word = document.querySelector("head > title").innerHTML
                console.log("改变后词", word)
                setTimeout(() => { closeHS() }, 500);
                clear = document.getElementById("dpBtnI").removeEventListener('click', IHtSearS); //删除按钮监听
                console.log("删除触发器", clear)
            }
        }, 500);


        //2.在未搜索页面时
        if (document.getElementById("ent_sug") != null) {
            //设置计时器 检查刷新
            var Interval = setInterval(() => {
                console.log("设置延时")
                if (document.getElementById("ent_sug") == null) {
                    closeHS();
                    clearInterval(Interval)
                    console.log("延时中止")
                }
            }, 1000);
        }
    }
})