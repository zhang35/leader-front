!function(t){var e=0,n={iframe:"iframe",popup:"popup"},o={strict:"strict",loose:"loose",html5:"html5"},r={mode:n.iframe,standard:o.html5,popHt:500,popWd:400,popX:200,popY:200,popTitle:"",popClose:!1,extraCss:"",extraHead:"",retainAttr:["id","class","style"]},i={};t.fn.printArea=function(n){t.extend(i,r,n),e++;var o="printArea_";t("[id^="+o+"]").remove(),i.id=o+e;var s=t(this),c=a.getPrintWindow();a.write(c.doc,s),setTimeout(function(){a.print(c)},1e3)};var a={print:function(e){var o=e.win;t(e.doc).ready(function(){o.focus(),o.print(),i.mode==n.popup&&i.popClose&&setTimeout(function(){o.close()},2e3)})},write:function(t,e){t.open(),t.write(a.docType()+"<html>"+a.getHead()+a.getBody(e)+"</html>"),t.close()},docType:function(){if(i.mode==n.iframe)return"";if(i.standard==o.html5)return"<!DOCTYPE html>";var t=i.standard==o.loose?" Transitional":"",e=i.standard==o.loose?"loose":"strict";return'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01'+t+'//EN" "http://www.w3.org/TR/html4/'+e+'.dtd">'},getHead:function(){var e="",n="";return i.extraHead&&i.extraHead.replace(/([^,]+)/g,function(t){e+=t}),t(document).find("link").filter(function(){var e=t(this).attr("rel");return"undefined"===t.type(e)==0&&"stylesheet"==e.toLowerCase()}).filter(function(){var e=t(this).attr("media");return"undefined"===t.type(e)||""==e||"print"==e.toLowerCase()||"all"==e.toLowerCase()}).each(function(){n+='<link type="text/css" rel="stylesheet" href="'+t(this).attr("href")+'" >'}),i.extraCss&&i.extraCss.replace(/([^,\s]+)/g,function(t){n+='<link type="text/css" rel="stylesheet" href="'+t+'">'}),"<head><title>"+i.popTitle+"</title>"+e+n+"</head>"},getBody:function(e){var n="",o=i.retainAttr;return e.each(function(){for(var e=a.getFormData(t(this)),r="",i=0;i<o.length;i++){var s=t(e).attr(o[i]);s&&(r+=(r.length>0?" ":"")+o[i]+"='"+s+"'")}n+="<div "+r+">"+t(e).html()+"</div>"}),"<body>"+n+"</body>"},getFormData:function(e){var n=e.clone(),o=t("input,select,textarea",n);return t("input,select,textarea",e).each(function(e){var n=t(this).attr("type");"undefined"===t.type(n)&&(n=t(this).is("select")?"select":t(this).is("textarea")?"textarea":"");var r=o.eq(e);"radio"==n||"checkbox"==n?r.attr("checked",t(this).is(":checked")):"text"==n?r.attr("value",t(this).val()):"select"==n?t(this).find("option").each(function(e){t(this).is(":selected")&&t("option",r).eq(e).attr("selected",!0)}):"textarea"==n&&r.text(t(this).val())}),n},getPrintWindow:function(){switch(i.mode){case n.iframe:var t=new a.Iframe;return{win:t.contentWindow||t,doc:t.doc};case n.popup:var e=new a.Popup;return{win:e,doc:e.doc}}},Iframe:function(){var e,n=i.id,o="border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;";try{e=document.createElement("iframe"),document.body.appendChild(e),t(e).attr({style:o,id:n,src:"#"+(new Date).getTime()}),e.doc=null,e.doc=e.contentDocument?e.contentDocument:e.contentWindow?e.contentWindow.document:e.document}catch(r){throw r+". iframes may not be supported in this browser."}if(null==e.doc)throw"Cannot find document.";return e},Popup:function(){var t="location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";t+=",width="+i.popWd+",height="+i.popHt,t+=",resizable=yes,screenX="+i.popX+",screenY="+i.popY+",personalbar=no,scrollbars=yes";var e=window.open("","_blank",t);return e.doc=e.document,e}}}(jQuery);