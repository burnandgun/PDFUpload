var json = "";
var formData = new FormData();
var changeJudge = 0;
var deleteNum = [];
var selectList = [];
var sitv = null;

function pdfTojson() {
    $('.input2').attr('disabled', false);
    changeJudge = 0;
    deleteNum = [];
    if($('.file')[0].files.length == 0)
    {
        alert("无文档上传");
        return 0;
    };
    $('#paperlist1').html("");
    var jsoncontent = [];
    // var NO = 0;
    $('table').append("<tr height=\"40px\" >\n" +
        "<th align=\"center\" width=\" 24%\"> " + "资料号" + " </th>\n" +
        "<th align=\"center\" width=\" 24%\"> " + "名称" + " </th>\n" +
        "<th align=\"center\" width=\" 24%\"> " + "图幅" + " </th>\n" +
        "<th align=\"center\" width=\" 24%\"> " + "版本号" + " </th>\n" +
        " </tr>");
    for(var i = 0 ; i < $('.file')[0].files.length ; i++)
    {
        var index1 = $('.file')[0].files[i].name.lastIndexOf('.');
        if($('.file')[0].files[i].name.substring(index1 + 1 , $('.file')[0].files[i].name.length) != "pdf")
        {
            continue;
        };
        formData.append('file', $('.file')[0].files[i]);
        var temp = $('.file')[0].files[i].name.replace(".pdf","");
        var templist = temp.split('#');
        var tempcontent = null;
        var jsontemp = {};
        jsontemp.DocNO = templist[0];
        jsontemp.Name = templist[1];
        jsontemp.Size = templist[2];
        jsontemp.REV = templist[3];
        // jsontemp.REV = NO++;
        jsoncontent.push(jsontemp);
        for (var j = 0 ; j < templist.length ; j ++)
        {
            tempcontent = tempcontent +  "<td align=\"center\" > " + templist[j] + " </td>\n"
        };
        $('table').append("<tr height = \"30px\" class = \"close" + i + "\">\n" + tempcontent + "<td align=\"center\" " +
            "style=\"width:4%;background:#95C8F1;font-size: 10px;\">" +
            "<a style=\"font-size: 15px;\" href=\"javascript:;\" " +
            "title=\"关闭\" onclick=\"deleteItem(" + i + ")\">×</a></td>" + " </tr>");
    };
    $('.window1').slideDown(100);
    $('.file').attr('disabled',true);
    json = JSON.stringify(jsoncontent);
    formData.append('Data', json);
    // $.ajax({
    //     url: '/upload_file/',
    //     type: 'POST',
    //     cache: false,
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     beforeSend:function () {
    //         // alert(json)
    //     },
    //     success: function () {
    //     },
    //     error: function () {
    //     },
    // });
}

function deleteItem(i) {
    if(!window.confirm("是否确认删除该项？"))
    {
        return 0 ;
    };
    changeJudge = 1;
    deleteNum.push(i - 1);
    // var temp = JSON.parse(formData.getAll('Data')[0]);
    // delete temp[i - 1];
    // formData.delete('Data');
    // formData.append('Data' , JSON.stringify(temp));
    // var tempfile = formData.getAll('file');
    // delete tempfile[i - 1];
    // formData.delete('file');
    // for(var j = 0 ; j < tempfile.length ; j++)
    // {
    //     formData.append('file', tempfile[j]);
    // };
    $(".close" + i).remove();
}

function jsonToDB()
{
    var temp = JSON.parse(formData.getAll('Data')[0]);
    var tempJSON = [];
    formData.delete('Data');
    var tempfile = formData.getAll('file');
    formData.delete('file');
    for(var i = 0; i < temp.length; i++)
    {
        if(deleteNum.indexOf(i) != -1)
        {
            continue;
        }
        tempJSON.push(temp[i]);
        formData.append('file', tempfile[i]);
    }
    formData.append('Data', JSON.stringify(tempJSON));
    $.ajax({
    url: '/json_to_html/',
    type: 'POST',
    cache: false,
    data: formData,
    processData: false,
    contentType: false,
    beforeSend:function () {
    },
    success: function (data) {
        jsonTohtml(data);
    },
    error: function () {
    },
    });
}

function json2ToDB() {
    $('.progress_bar').slideDown(100);
    var temp = JSON.parse(formData.getAll('Data')[0]);
    var tempdata = [];
    formData.delete('Data');
    var tempfile = formData.getAll('file');
    formData.delete('file');
    for(var i = 0; i < temp.length; i++)
    {
        temp[i]['style'] = selectList[i];
        if(temp[i]['style'] != 'ignore')
        {
            formData.append('file',tempfile[i]);
            tempdata.push(temp[i]);
        }
    }
    formData.append('Data', JSON.stringify(tempdata));
    // var xhr = new XMLHttpRequest();
    // xhr.upload.addEventListener('progress', on_progress, false);
    // xhr.open('POST', '/upload_file/', true);
    // xhr.setRequestHeader('X-CSRFTOKEN','{{ request.COOKIES.csrftoken }}');
    // xhr.send(formData);
    // if(xhr.readyState == 4)
    // {
    //     document.getElementsByClassName('progress3')[0].innerHTML =  "文件上传完成！";
    // }
    $.ajax({
        url: '/upload_file/',
        type: 'POST',
        xhr:function(){
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
                myXhr.upload.addEventListener('progress', on_progress, false);
            }
            return myXhr;
        },
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend:function () {
        },
        success: function () {
            myXhr.abort();
            $('.progress2').width("100%");
            $('.progress3').html("保存文件完成!");
            clearInterval(sitv);
            fileToDB();
        },
        error: function () {
            alert('wrong');
            clearInterval(sitv);
        },
    });
}

function fileToDB() {
    sitv = setInterval(function(){
        var prog_url ='/show_progress/';                   // prog_url指请求进度的url，后面会在django中设置
        $.getJSON(prog_url, function(res){
            $('.progress2').width(res + '%');
            $('.progress3').html("保存数据中：" + res + '%');     // 改变进度条进度，注意这里是内层的div， res是后台返回的进度
        });
    }, 100);
    $.ajax({
        url: '/file_to_db/',
        cache: false,
        processData: false,
        contentType: false,
        beforeSend:function () {
        },
        success: function () {
            $('.progress2').width('100%');
            $('.progress3').html("保存数据完成!");
            clearInterval(sitv);
            $('.input2').attr('disabled', true);
        },
        error: function () {
            alert('wrong');
            clearInterval(sitv);
        },
    });
}

function jsonTohtml(data) {
    $('#paperlist2').html("");
    $('.window1').fadeOut(100);
    //var NO = 0;
    var jsoncontent2 = JSON.parse(data);
    $('table').append("<tr height=\"40px\" >\n" +
        "<th align=\"center\" width=\" 24%\"> " + "资料号" + " </th>\n" +
        "<th align=\"center\" width=\" 24%\"> " + "名称" + " </th>\n" +
        "<th align=\"center\" width=\" 24%\"> " + "图幅" + " </th>\n" +
        "<th align=\"center\" width=\" 24%\"> " + "版本号" + " </th>\n" +
        "<th align=\"center\" width=\" 4%\"> " + "状态" + " </th>\n" +
        " </tr>");
    for(var i = 0 ; i < jsoncontent2.length ; i++)
    {
        var templist = new Array();
        var tempcontent = null;
        templist.push(jsoncontent2[i]['DocNO']);
        templist.push(jsoncontent2[i]['Name']);
        templist.push(jsoncontent2[i]['Size']);
        templist.push(jsoncontent2[i]['REV']);
        selectList.push(jsoncontent2[i]['style']);
        for (var j = 0 ; j < templist.length ; j ++)
        {
            tempcontent = tempcontent +  "<td align=\"center\" > " + templist[j] + " </td>\n"
        }
        if(jsoncontent2[i]['style'] == 'add')
        {
            $('table').append("<tr height = \"30px\">\n" + tempcontent + "<td align=\"center\" " +
                "style=\"width:4%;background:#FFFFFF;font-size: 10px;\">" +
                "<select id=\"style" + i.toString() + "\" onchange=\"selectChange("+ i +", this.value)\"><option value = \"add\">新增</option>" +
                "<option value = \"ignore\">忽略</option>" +
                "</select>" +
                "</td>" + "</tr>");
        }
        else if(jsoncontent2[i]['style'] == 'cite')
        {
            $('table').append("<tr height = \"30px\">\n" + tempcontent + "<td align=\"center\" " +
                "style=\"width:4%;background:#FFFFFF;font-size: 10px;\">" +
                "<select id=\"style" + i.toString() + "\" onchange=\"selectChange("+ i +", this.value)\"><option value = \"cite\">引用</option>" +
                "<option value = \"replace\">替换</option>" + "<option value = \"ignore\">忽略</option>" +
                "</select>" +
                "</td>" + "</tr>");
        }
        else if(jsoncontent2[i]['style'] == 'replace')
        {
            $('table').append("<tr height = \"30px\">\n" + tempcontent + "<td align=\"center\" " +
                "style=\"width:4%;background:#FFFFFF;font-size: 10px;\">" +
                "<select id=\"style" + i.toString() + "\" onchange=\"selectChange("+ i +", this.value)\">" +
                "<option value = \"replace\">替换</option>" + "<option value = \"ignore\">忽略</option>" +
                "</select>" +
                "</td>" + "</tr>");
        }
    }
    $('.window2').slideDown(100);
    $('.file').attr('disabled',true);
}

function changeConfrim() {
    if(changeJudge)
    {
        if(!window.confirm('已修改内容，确认关闭并取消修改?'))
        {
            return 0;
        };
    };
    json = "";
    formData = new FormData();
    changeJudge = 0;
    deleteNum = [];
    $('.theme-popover').fadeOut(100);
    $('.file').attr('disabled',false);
}

function selectChange(i, value) {
    selectList[i] = value;
    $('.input2').attr('disabled', false);
}

//上传文件进度条
function on_progress(evt) {
    if(evt.lengthComputable)
    {
        var ele = document.getElementsByClassName('progress2');
        var percent = Math.round((evt.loaded)* 100/evt.total);
        ele[0].style.width = percent + "%";
        document.getElementsByClassName('progress3')[0].innerHTML = "文件上传中:" + percent + "%";
    }
    if(evt.loaded == evt.total)
    {
        var ele = document.getElementsByClassName('progress2');
        ele[0].style.width = "100%";
        document.getElementsByClassName('progress3')[0].innerHTML = "文件上传已经完成!";
        sitv = setInterval(function(){
                var prog_url ='/show_progress/';                   // prog_url指请求进度的url，后面会在django中设置
                $.getJSON(prog_url, function(res){
                    $('.progress2').width(res + '%');
                    $('.progress3').html("保存文件中：" + res + '%');     // 改变进度条进度，注意这里是内层的div， res是后台返回的进度
                });
            }, 100);
    }
}