/* axios v0.19.0-beta.1 | (c) 2018 by Matt Zabriskie */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.axios=t():e.axios=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){var t=new i(e),n=s(i.prototype.request,t);return o.extend(n,i.prototype,t),o.extend(n,t),n}var o=n(2),s=n(3),i=n(5),a=n(22),u=n(11),c=r(u);c.Axios=i,c.create=function(e){return r(a(c.defaults,e))},c.Cancel=n(23),c.CancelToken=n(24),c.isCancel=n(10),c.all=function(e){return Promise.all(e)},c.spread=n(25),e.exports=c,e.exports.default=c},function(e,t,n){"use strict";function r(e){return"[object Array]"===j.call(e)}function o(e){return"[object ArrayBuffer]"===j.call(e)}function s(e){return"undefined"!=typeof FormData&&e instanceof FormData}function i(e){var t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function a(e){return"string"==typeof e}function u(e){return"number"==typeof e}function c(e){return"undefined"==typeof e}function f(e){return null!==e&&"object"==typeof e}function p(e){return"[object Date]"===j.call(e)}function d(e){return"[object File]"===j.call(e)}function l(e){return"[object Blob]"===j.call(e)}function h(e){return"[object Function]"===j.call(e)}function m(e){return f(e)&&h(e.pipe)}function y(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function g(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function x(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)}function v(e,t){if(null!==e&&"undefined"!=typeof e)if("object"!=typeof e&&(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.call(null,e[s],s,e)}function w(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=w(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)v(arguments[n],e);return t}function b(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=b(t[n],e):"object"==typeof e?t[n]=b({},e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)v(arguments[n],e);return t}function E(e,t,n){return v(t,function(t,r){n&&"function"==typeof t?e[r]=S(t,n):e[r]=t}),e}var S=n(3),R=n(4),j=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:o,isBuffer:R,isFormData:s,isArrayBufferView:i,isString:a,isNumber:u,isObject:f,isUndefined:c,isDate:p,isFile:d,isBlob:l,isFunction:h,isStream:m,isURLSearchParams:y,isStandardBrowserEnv:x,forEach:v,merge:w,deepMerge:b,extend:E,trim:g}},function(e,t){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t){/*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    e.exports=function(e){return null!=e&&null!=e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new i,response:new i}}var o=n(2),s=n(6),i=n(7),a=n(8),u=n(22);r.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{},e.url=arguments[0]):e=e||{},e=u(this.defaults,e),e.method=e.method?e.method.toLowerCase():"get";var t=[a,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},r.prototype.getUri=function(e){return e=u(this.defaults,e),s(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},o.forEach(["delete","get","head","options"],function(e){r.prototype[e]=function(t,n){return this.request(o.merge(n||{},{method:e,url:t}))}}),o.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(o.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(2);e.exports=function(e,t,n){if(!t)return e;var s;if(n)s=n(t);else if(o.isURLSearchParams(t))s=t.toString();else{var i=[];o.forEach(t,function(e,t){null!==e&&"undefined"!=typeof e&&(o.isArray(e)?t+="[]":e=[e],o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),i.push(r(t)+"="+r(e))}))}),s=i.join("&")}return s&&(e+=(e.indexOf("?")===-1?"?":"&")+s),e}},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(2);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(2),s=n(9),i=n(10),a=n(11),u=n(20),c=n(21);e.exports=function(e){r(e),e.baseURL&&!u(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=s(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});var t=e.adapter||a.adapter;return t(e).then(function(t){return r(e),t.data=s(t.data,t.headers,e.transformResponse),t},function(t){return i(t)||(r(e),t&&t.response&&(t.response.data=s(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,n){"use strict";function r(e,t){!s.isUndefined(e)&&s.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function o(){var e;return"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process)?e=n(13):"undefined"!=typeof XMLHttpRequest&&(e=n(13)),e}var s=n(2),i=n(12),a={"Content-Type":"application/x-www-form-urlencoded"},u={adapter:o(),transformRequest:[function(e,t){return i(t,"Accept"),i(t,"Content-Type"),s.isFormData(e)||s.isArrayBuffer(e)||s.isBuffer(e)||s.isStream(e)||s.isFile(e)||s.isBlob(e)?e:s.isArrayBufferView(e)?e.buffer:s.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):s.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},s.forEach(["delete","get","head"],function(e){u.headers[e]={}}),s.forEach(["post","put","patch"],function(e){u.headers[e]=s.merge(a)}),e.exports=u},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(2),o=n(14),s=n(6),i=n(17),a=n(18),u=n(15);e.exports=function(e){return new Promise(function(t,c){var f=e.data,p=e.headers;r.isFormData(f)&&delete p["Content-Type"];var d=new XMLHttpRequest;if(e.auth){var l=e.auth.username||"",h=e.auth.password||"";p.Authorization="Basic "+btoa(l+":"+h)}if(d.open(e.method.toUpperCase(),s(e.url,e.params,e.paramsSerializer),!0),d.timeout=e.timeout,d.onreadystatechange=function(){if(d&&4===d.readyState&&(0!==d.status||d.responseURL&&0===d.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in d?i(d.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?d.response:d.responseText,s={data:r,status:d.status,statusText:d.statusText,headers:n,config:e,request:d};o(t,c,s),d=null}},d.onabort=function(){d&&(c(u("Request aborted",e,"ECONNABORTED",d)),d=null)},d.onerror=function(){c(u("Network Error",e,null,d)),d=null},d.ontimeout=function(){c(u("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",d)),d=null},r.isStandardBrowserEnv()){var m=n(19),y=(e.withCredentials||a(e.url))&&e.xsrfCookieName?m.read(e.xsrfCookieName):void 0;y&&(p[e.xsrfHeaderName]=y)}if("setRequestHeader"in d&&r.forEach(p,function(e,t){"undefined"==typeof f&&"content-type"===t.toLowerCase()?delete p[t]:d.setRequestHeader(t,e)}),e.withCredentials&&(d.withCredentials=!0),e.responseType)try{d.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&d.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&d.upload&&d.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){d&&(d.abort(),c(e),d=null)}),void 0===f&&(f=null),d.send(f)})}},function(e,t,n){"use strict";var r=n(15);e.exports=function(e,t,n){var o=n.config.validateStatus;!o||o(n.status)?e(n):t(r("Request failed with status code "+n.status,n.config,null,n.request,n))}},function(e,t,n){"use strict";var r=n(16);e.exports=function(e,t,n,o,s){var i=new Error(e);return r(i,t,n,o,s)}},function(e,t){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},function(e,t,n){"use strict";var r=n(2),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,s,i={};return e?(r.forEach(e.split("\n"),function(e){if(s=e.indexOf(":"),t=r.trim(e.substr(0,s)).toLowerCase(),n=r.trim(e.substr(s+1)),t){if(i[t]&&o.indexOf(t)>=0)return;"set-cookie"===t?i[t]=(i[t]?i[t]:[]).concat([n]):i[t]=i[t]?i[t]+", "+n:n}}),i):i}},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,s,i){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(s)&&a.push("domain="+s),i===!0&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){t=t||{};var n={};return r.forEach(["url","method","params","data"],function(e){"undefined"!=typeof t[e]&&(n[e]=t[e])}),r.forEach(["headers","auth","proxy"],function(o){r.isObject(t[o])?n[o]=r.deepMerge(e[o],t[o]):"undefined"!=typeof t[o]?n[o]=t[o]:r.isObject(e[o])?n[o]=r.deepMerge(e[o]):"undefined"!=typeof e[o]&&(n[o]=e[o])}),r.forEach(["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"],function(r){"undefined"!=typeof t[r]?n[r]=t[r]:"undefined"!=typeof e[r]&&(n[r]=e[r])}),n}},function(e,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(23);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e,t=new r(function(t){e=t});return{token:t,cancel:e}},e.exports=r},function(e,t){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])});
//# sourceMappingURL=axios.min.map

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

$(document).ready(function($) {


    $(document).on('click','.select-paytype',function(){

        var value = $(this).attr("data-id");

        var payment = $('input[name="pay-reference"]').val('setPayment');

        $("input[name='trans']").val("pay");
        $('input[name="location"]').val(value);

        var code =  window.localStorage.getItem('ref');
        $('input[name="content"]').val(code);


        Swal({
            title: "Payment Method",
            text: value + " Selected As Payment Method",
            icon: "success",
            button: "Ok!"
        });

        $('#checkout-cart2').text('Continue');

    });

    $(document).on("click" , ".checkout-cart" , function(e) {

        e.preventDefault();

        var trans = $(this).attr('data-trans-type');

        $("input[name='trans']").val(trans);

        var act = $("#cart-order-form").attr("action");
        var key = $('input[name="shop-key"]').val();


        if ($("#cart-order-form").parsley().isValid()) {

            var data = getFormData("cart-order-form");
            var url = act  + key;

            if(data.trans == "cart" || data.trans == ""){

                swal("Incomplete","Select An Action. Either Confirm / Pay / Or Status Check", "error");
            }else if(data.trans == "finish"){

              swal("Awesome","Thank you for taking the time to shop with us.", "success");

            }else{

                var content = new FormData();

                if(data.trans == 'pay'){

                    var code = $('input[name="pay-reference"]').val();

                    if(code == undefined){

                    code = window.localStorage.getItem('ref');

                    }else{

                        window.localStorage.setItem('ref', code);

                    }




                    Object.entries(data).forEach(function ([key, value]) {

                        if(key == 'content'){

                            content.append('content',code);

                        }else{

                            content.append(key, value);

                        }

                    });


                }else{

                    Object.entries(data).forEach(function ([key, value]) {

                            content.append(key, value);

                    });


                }


                axios.post(url,content).then(function (response) {

                    var res = response.data;
                    console.log(res);

                    if(res.type == "success"){


                        if(res.pay == "confirm"){

                            Swal({
                                title: "Order Created!",
                                text: res.msg,
                                icon: "success",
                                button: "Ok!"
                            });

                            var cart = [];
                            localStorage.cart = JSON.stringify(cart);
                            showCart();

                        }else if(res.pay == "paystart"){

                            Swal({
                                title: "Payment Started",
                                text: 'You Are Almost Done!!! Read Instructions In The Payment Hub.',
                                icon: "success",
                                button: "Ok!"
                            });



                            var code = $('input[name="pay-reference"]').val();
                            $('input[name="content"]').val(code);


                            var mg = res.msg;

                            $('div.trans-payee').html(mg);


                        }else if(res.pay == "payend"){

                            var mg = res.details;

                            Swal({
                                title: "Success!",
                                text: "Now Make Payment. Read The Instrustions In The Payment Hub. To Make Payment",
                                icon: "success",
                                button: "Ok!"
                            });
                            var mg = res.msg;

                            $('.trans-payee').html(mg);
                            $('#checkout-cart2').text('Finish');
                            $("input[name='trans']").val("finish");
                            $('input[name="location"]').val("Thank You.");
                            clearCart();

                            setTimeout(function(){
                            location.window.reload();
                          },1000);


                        }else {


                            swal("Something's Wrong!", "Broken!!", "error");

                        }


                    }else {

                        swal("Something's Wrong!", res.message, "error");

                    }


                }).catch(function (error) {
                    console.log(error);
                });

            }

        }else {

            swal("Something's Wrong!","All Fields Must Be Filled", "error");

        }

    });

});

function getmylocation(){

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {

            // Get the coordinates of the current position.
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            Swal({
                title: "Location Found",
                text: "Your Location is  Latitude - " +lat + " && Longitude - " + long ,
                icon: "success",
                button: "Ok!"
            });

            $('#OrderLoc').value(lat + "," + long);
        });
    }
    else {

        swal("Device Error!","Your Device Doesn't Support Location", "error");
    }
}

$(document).ready(function($) {

    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });



    var cartWrapper = $('.cd-cart-container');
    var cartBody = cartWrapper.find('.body')
    var cartList = cartBody.find('ul').eq(0);
    var cartTotal = cartWrapper.find('.checko').find('span');
    var cartTrigger = $('.cd-cart-trigger');
    var cartCount = cartTrigger.children('.count')
    var addToCartBtn = $('.add-to-cart');
    var totalCost = $("#TotalCost");
    var totalOrder = $("#TotalOrder");

    $(".get-location").on('click',function(){
        console.log("location");
        getmylocation();
    });

    $(document).on('keyup','.confir' ,function() {

        var name = $("input[name='pay-name']").val();
        var email = $("input[name='pay-email']").val();
        var number = $("input[name='pay-number']").val();
        var address = $("input[name='pay-address']").val();
        var country = $("input[name='pay-country'] :selected").val();

        var final = name + '##' + email + '##' + number + '##' + address + '##' + country;

        $("input[name='content']").val(final);
    });

    $(document).on('keyup','.conref',function() {

        var name = $("input[name='pay-referene']").val();

        $("input[name='content']").val(name);
    });

    $(document).on('click','.chatbox-open',function(){
        $(".chatbox-popup, .chatbox-close").fadeIn();
    });

    $(document).on('click',".chatbox-close",function(){
      $(".chatbox-popup, .chatbox-close").fadeOut();
    });



    $(document).on('change',"input[name='transtype']",function(){

        var value = $(this).val();
        $(".trans-confirm").fadeOut(10).removeClass("con-show").addClass('con-off');
        $(".trans-pay").fadeOut(10).removeClass("con-show").addClass('con-off');
        $(".trans-cart").fadeOut(10).removeClass("con-show").addClass('con-off');
        $(".trans-status").fadeOut(10).removeClass("con-show").addClass('con-off');

        if(value == "pay" || value =="confirm" || value == "cart"){
            if(value == "pay"){

            $(".btn-go").fadeIn(300);
                $(".m-btn").html("Start Payment");

            }else if(value =="confirm"){

                $(".btn-go").fadeIn(300);
                $(".m-btn").html("Confirm Order");

            }else if(value == "cart"){

                $(".btn-go").fadeOut(300);

            }

        }else{

            $(".btn-go").fadeOut(300);
        }

        $(".trans-"+ value).fadeIn(500).addClass('con-show').removeClass("con-off");
        showCart();

        $("input[name='trans']").val(value);

    });



    var cart = [];

    $(function() {
        if (localStorage.cart) {
            cart = JSON.parse(localStorage.cart);
            showCart();
        }
    });

    cartWrapper.on('click', function(event) {
        if ($(event.target).is($(this))) toggleCart(true);
    });

    //open/close cart
    cartTrigger.on('click', function(event) {
        event.preventDefault();
        toggleCart();
    });

    // Trigger Add To Cart
    // Trigger Add To Cart

    $(document).on('click', '.add-to-cart',function(event) {
        event.preventDefault();
        var trigger = $(this);

        var data = trigger.attr('data-product-options');

        console.log(data);

        if(data == null || data == undefined || data == "none" || data == ""){

        addToCart(trigger.data('price'), trigger.data('name'), 1);

        }else{

            var tit = data.split('/---/');

            var use = tit[1];

            var spl = use.split('###');
            var fro = [];

            spl.forEach(function(value){

                var spli = value.split('/-/');
                var pl = {
                        name : spli[0],
                        description : spli[1],
                        type : spli[2],
                        opt:spli[3],
                        price:spli[4]

                };

                fro.push(pl);

            });

            var html = '<div class="text-left text-size-22 GeomanistLight">'+ tit[0] + '</div><div class="space2"></div>';


            fro.forEach(function(value){

                if(value.type == "select"){

                    html += value.description;
                    html += '<select class="swal2-input" id="'+ value.name +'">';
                    html += '<option value="none" >None</option>';
                    var p = value.opt;
                    var e = p.split(",");

                    e.forEach(function(val){

                        html += '<option value="'+val +'" >' + val +'</option>';

                    });

                    html += '</select>';

                }else if(value.type == "text"){

                    html += value.description;
                    html += '<input id="'+ value.name +'" value="none" class="swal2-input">' ;

                }


            });

            Swal({
                title: 'Product Options',
                html: html,
                focusConfirm: false,
                preConfirm: () => {

                    return new Promise((resolve, reject) => {
                        // get your inputs using their placeholder or maybe add IDs to them

                        var answers = {};

                        fro.forEach(function(value){

                            if(value.type == "text"){

                                var sort = $('input[id="'+ value.name +'"]').val();

                            }else if(value.type == "select"){

                                var sort = document.getElementById(value.name).value;

                            }
                            var use = value.name;
                            answers[use]  =  sort + '/==/' + value.price;


                        });
                        resolve(answers);
                        return answers;
                    });
                }
            }).then(function(answers){


                var add = 'Product Options = ';
                var cont = 0;
                var valid = 0;
                var price = 0;
                var ip = answers.value;


                Object.entries(ip).forEach(function([key,value]){

                    var pric = value.split('/==/');

                    if(pric[0] == "" || pric[0] == undefined || pric[0] == null || pric[0] == 'none'){

                        cont++;

                    }else{

                        valid++;
                    }



                    add += key + ' : ' + pric[0];
                    price += parseFloat(pric[1]);

                });



                var option = tit[2];

                if(option  == 'all' && cont == 0){

                    addToCart(trigger.data('price'), trigger.data('name'), 1, add, price);


                }else if(option  == 'all' && cont != 0){

                    Swal({
                        title: "Something Went Wrong",
                        text: 'All Inputs and Options Must Be filled',
                        icon: "error",
                        button: "Ok!"
                    });



                }else if(option == 'one' && valid == 1 ){


                    addToCart(trigger.data('price'), trigger.data('name'), 1,add, price);


                }else if(option == 'one' && valid > 1 ){

                    Swal({
                        title: "Something Went Wrong",
                        text: "You need to select only one option in the list of options. Make sure dropdown options have none selected if you don't need them ",
                        icon: "error",
                        button: "Ok!"
                    });

                }else if(option == 'one' && valid == 0 ){

                    Swal({
                        title: "Something Went Wrong",
                        text: "You need to select only one option in the list of options. Make sure dropdown options have none selected if you don't need them ",
                        icon: "error",
                        button: "Ok!"
                    });



                }else if( option == 'any'){

                    addToCart(trigger.data('price'), trigger.data('name'), 1,add, price);

                }






            });


        }


    });

    function toggleCart(bool) {
        var cartIsOpen = (typeof bool === 'undefined') ? cartWrapper.hasClass(
            'cart-open') : bool;

        if (cartIsOpen) {
            cartWrapper.removeClass('cart-open');
            //reset undo

            undo.removeClass('visible');
            cartList.find('.deleted').remove();

        } else {
            cartWrapper.addClass('cart-open');
        }
    }

    function addToCart(price, name, qty,options = 'No Options',extra = 0) {
        var price = price + extra;
        var name = name;
        var qty = qty;
        var opt = options;

        toast({
            type: 'success',
            title: name + "Added To Cart"
        })


        // update qty if product is already present
        for (var i in cart) {
            if (cart[i].Product == name && cart[i].Options == opt) {
                cart[i].Qty = cart[i].Qty + qty;
                showCart();
                saveCart();
                return;
            }
        }
        // create JavaScript Object
        var item = {
            Product: name,
            Options: opt,
            Price: price,
            Qty: qty
        };
        cart.push(item);
        saveCart();
        showCart();
    }

    $(document).on("click", ".deleteCartItem", function() {
        var index = $(this).attr("data-delete");
        cart.splice(index, 1); // delete item at index
        showCart();
        saveCart();

    });

    function saveCart() {
        if (window.localStorage) {
            localStorage.cart = JSON.stringify(cart);
        }
    }

    function clearCart() {
        if (window.localStorage) {
            var cart = [];
            localStorage.cart = JSON.stringify(cart);
        }
    }


    function showCart() {

        if (cart.length == 0) {
            $("#cart").css("visibility", "hidden");
            $(".TotalCartPrice").html(0);
            totalCost.val(0);
            $(".cd-cart-trigger .count").html(0);
            return;
        }

        $("#cart").css("visibility", "visible");
        $("#cartBody").empty();
        var total = 0;
        var count = 0;
        var ord = "";
        for (var i in cart) {
            var item = cart[i];
            var row = "<div class='container product ux-card'><span class='text-left GeomanistMedium'>" + item.Product + "</span><div class='clear gray GeomanistLight float-left'>"+ item.Options +"</div><span class='clear float-left'>" +
                item.Price + "</span><span class='float-left'>  * " + item.Qty + "</span>" +"<span class='float-right'>" +
                "<button class='padding-left1 deleteCartItem' data-delete='" +
                i + "'><span class='mdi mdi-delete-variant'></span></button></span><span class='float-right'>" + item.Qty * item.Price + "</span></div>";

            $("#cartBody").append(row);
            var produc = (item.Qty * item.Price);
            if (ord == "") {
                var that = "";
            } else {
                var that = ",";
            }
            ord = ord + that + " (" + item.Qty + " x " + item.Product + " =  " +
                item.Qty *
                item.Price + " )";
            total = Number(total) + Number(produc);
            count++;
        }

        $(".TotalCartPrice").html(total);
        totalCost.val(total);
        $("#TotalOrder").val(ord);
        $("#TotalCost").val(total);
        totalOrder.val(ord);
        $(".cd-cart-trigger .count").html(count);
    }

});

/**
 * Create google maps Map instance.
 * @param {number} lat
 * @param {number} lng
 * @return {Object}
 */
const createMap = ({ lat, lng }) => {
    return new google.maps.Map(document.getElementById('shopMap'), {
        center: { lat, lng },
        zoom: 15
    });
};

/**
 * Create google maps Marker instance.
 * @param {Object} map
 * @param {Object} position
 * @return {Object}
 */
const createMarker = ({ map, position }) => {
    return new google.maps.Marker({
        map: map,
        position: position,
        title: 'Your Location',
        draggable: true,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 10,
            strokeColor: '#FF0000'
        },
    });
};

/**
 * Track the user location.
 * @param {Object} onSuccess
 * @param {Object} [onError]
 * @return {number}
 */
const trackLocation = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
        return onError(new Error('Geolocation is not supported by your browser.'));
    }

    return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
};

/**
 * Get position error message from the given error code.
 * @param {number} code
 * @return {String}
 */
const getPositionErrorMessage = code => {
    switch (code) {
        case 1:
            return 'Permission denied.';
        case 2:
            return 'Position unavailable.';
        case 3:
            return 'Timeout reached.';
    }
}

/**
 * Initialize the application.
 * Automatically called by the google maps API once it's loaded.
*/
function mapInit() {
    const initialPosition = { lat:     5.60372, lng: -0.18696 };
    const map = createMap(initialPosition);
    const marker = createMarker({ map, position: initialPosition });
    const $info = document.getElementById('MapInfo');

    // disable the default draggability of the underlying map
    // when starting to drag a marker object:
    google.maps.event.addListener(marker, "drag", function(){

        var laturl = marker.getPosition().lat();
        var lngurl = marker.getPosition().lng();

        $info.textContent = `Lat: ${laturl.toFixed(5)} Lng: ${lngurl.toFixed(5)}`;
        var loc = laturl + "," + lngurl;
        $("#OrderLoc").val(loc);

    });

    let watchId = trackLocation({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            marker.setPosition({ lat, lng });
            map.panTo({ lat, lng });
            $info.textContent = `Lat: ${lat.toFixed(5)} Lng: ${lng.toFixed(5)}`;
            $info.classList.remove('error');
        },
        onError: err => {
            console.log($info);
            $info.textContent = `Error: ${err.message || getPositionErrorMessage(err.code)}`;
            $info.classList.add('error');
        }
    });
}

$(document).ready(function(){

   // mapInit();

});

(function($) {
    var dialog;
    $(document).on('click','.dig-trigger', function() {
        dialog = $('#' + $(this).data('dialog'));
        $(dialog).addClass('dialog--open');
    });
    $(document).on('click','.action, .dialog__overlay ,.chatbox-close', function() {
        $(dialog).removeClass('dialog--open');
        $(dialog).addClass('dialog--close');
        $(dialog).find('.dialog__content').on('webkitAnimationEnd MSAnimationEnd oAnimationEnd animationend', function() {
            $(dialog).removeClass('dialog--close');
        });
    });



    $('.dialogEffects').on('click', function(e) {
        e.preventDefault();
        $('.dialogEffects').removeClass('selected');
        $(this).addClass('selected');
        var cssClass = $(this).data('class');
        $('#dialogEffects').removeAttr('class').addClass(cssClass);
    });
})(jQuery);
