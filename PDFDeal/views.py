# -*- coding: utf-8 -*-
from __future__ import unicode_literals


# Create your views here.
import json
import os


from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from PDFUpload import settings
from PDFDeal.models import Drawings, DrawingSize
from PDFDeal.function.function import *


global my_File
my_File = None
global jsoncontent
jsoncontent = None
global numProgress
numProgress = 0


@csrf_exempt
def home(request):
    return render(request, 'home.html')
    # return HttpResponse(os.path.dirname(os.path.dirname(settings.__file__)))


@csrf_exempt
def interface(request):
    return render(request, 'interface.html')


# 处理前端传入的文件以及文件数据，再输出到前端
# 保存文件有csrf保护，需加@csrf_exempt去除这种保护
@csrf_exempt
def json_to_html(request):
    if request.method == "POST":
        # 将上传的多个文件形成列getlist
        myFile = request.FILES.getlist('file')
        jsoncontent = json.dumps(jsonCompareDB(json.loads(request.POST.get('Data'))))
        if not myFile:
            return HttpResponse('no file')
        return HttpResponse(jsoncontent)
    return HttpResponse('OK')


# 处理前端传入的最终json和文件.
# 保存文件有csrf保护，需加@csrf_exempt去除这种保护
@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        global my_File
        global numProgress
        global jsoncontent
        # 将上传的多个文件形成列getlist
        my_File = request.FILES.getlist('file')
        if not my_File:
            return HttpResponse('no file')
        jsoncontent = json.loads(request.POST.get('Data'))
        if not my_File:
            return HttpResponse('no file')
        for i in range(0, len(my_File)):
            if jsoncontent[i]['style'] != 'cite' or jsoncontent[i]['style'] != 'ignore':
                #读取myFile列使用f.name新建文件
                # destination = open(os.path.join(os.path.dirname(os.path.dirname(settings.__file__)), "PDFSave", my_File[i].name), 'wb+')
                # # 将每个文件以chunks分块写入新建的destination实例
                # for chunk in my_File[i].chunks():
                #     destination.write(chunk)
                # destination.close
                if len(my_File) == 1:
                    numProgress = 100
                else:
                    numProgress = i * 100 / (len(my_File) - 1)
        return HttpResponse('OK')
    return HttpResponse('OK')


@csrf_exempt
def file_to_db(request):
    global my_File
    global numProgress
    global jsoncontent
    # 循环myFile这个列，将读取每个文件
    for i in range(0, len(my_File)):
        if len(my_File) == 1:
            numProgress = 100
        else:
            numProgress = i * 100 / (len(my_File) - 1)
        pdfToDB(jsoncontent[i], my_File[i])
    return HttpResponse('OK')


@csrf_exempt
def show_progress(request):
    return JsonResponse(numProgress, safe=False)
