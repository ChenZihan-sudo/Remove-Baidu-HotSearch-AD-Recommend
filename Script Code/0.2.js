// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //设置触发器
    console.log("外部脚本已启动")

    var dpBtn = document.createElement("button");

    var dpBtnF = function(id, style, value, innerHTML, selFunc) {
        console.log(selFunc)
        dpBtn.id = id;
        dpBtn.style = style;
        dpBtn.value = value;
        dpBtn.innerHTML = innerHTML;
    }



    //——————————————关闭首页热点————————————————————
    closeHS();

    function waitToCloseHS() {
        setTimeout(() => {
            closeHS()
        }, 1000);
    }

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

        var pageCheck = document.getElementById("con-ar")
        var multiCheck = document.getElementById("ent_sug")
        console.log(pageCheck, multiCheck, "0000000")
        if (pageCheck != null || multiCheck != null) {
            SearchInPage = true;
            console.log("在搜索内容页面")
        } else {

            var SearchInPage = false;
            console.log("不在搜索内容页面")
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
        // var a = findNodeByClass("cr-title", "c-gap-bottom-xsmall")
        // console.log("biaoti", a)
        // var b = findNodeByClass("opr-toplist1-update", "opr-toplist1-link")
        // console.log("huanyihuan", b)
        // var c = findNodeByClass("c-table", "opr-toplist1-table")
        // console.log("neirong", b)

        hotSearch("none"); //设置关闭状态
        function hotSearch(status) {
            console.log(SearchInPage)
            if (SearchInPage == false) {
                if (loginstatus == false) {
                    document.getElementById("hotsearch-content-wrapper").style.display = status;
                    document.getElementById("hotsearch-refresh-btn").style.display = status;
                } else {
                    document.getElementsByClassName("hot-refresh")[0].style.display = status
                    document.getElementsByClassName("s-news-rank-content")[0].style.display = status
                }
            } else {
                findNodeByClass("opr-toplist1-update", "opr-toplist1-link").style.display = status
                findNodeByClass("c-table", "opr-toplist1-table").style.display = status
            }

        }


        if (SearchInPage == false) {
            if (loginstatus == false) {
                dpBtnF("dpBtnI", "padding:2px;margin:6px;margin-top:0px;", "close", "开启", 1); //设置节点
            } else {
                dpBtnF("dpBtnI", "padding: 2px;margin-right:170px;margin-top: -10px;", "close", "开启", 1); //设置节点
            }
        } else {
            dpBtnF("dpBtnI", "", "close", "开启", 1); //设置节点
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
        targetNode.appendChild(dpBtn);


        dpBtn.addEventListener('click', IHtSearS); //添加监听

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
        //检查在搜索页面下是否关闭
        if (SearchInPage == true) {
            //检查元素是否存在
            if (document.getElementById("con-ar") == null) {
                waitToCloseHS();
            }
        }
    }

    //设置触发器
    var inputChange = document.getElementById("kw")
    inputChange.addEventListener("focusout", function() {
        waitToCloseHS();
    });
})();