# -*- coding: utf-8 -*-
from __future__ import unicode_literals


# Create your views here.
import os


from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from PDFUpload import settings
from PDFDeal.models import Drawings,DrawingSize


def home(request):
    return render(request, 'home.html')
    # return HttpResponse(os.path.dirname(os.path.dirname(settings.__file__)))


@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        # 将上传的多个文件形成列getlist
        myFile = request.FILES.getlist("myfile", None)
        if not myFile:
            return HttpResponse('no file')
        # 循环myFile这个列，将读取每个文件
        for f in myFile:
            # 读取myFile列使用f.name新建文件
            destination = open(os.path.join(os.path.dirname(os.path.dirname(settings.__file__)) + "\\PDFSave", f.name), 'wb+')
            # 将每个文件以chunks分块写入新建的destination实例
            for chunk in f.chunks():
                destination.write(chunk)
            destination.close()
            temp1 = f.name.split('#')
            temp2 = temp1[3].split('.')
            ds = DrawingSize.objects.get(Name=temp1[2])
            Drawings.objects.create(DocNO=temp1[0],
                                    Name=temp1[1],
                                    Size=ds,
                                    FileName=os.path.join(os.path.dirname(os.path.dirname(settings.__file__)) +
                                                          "\\PDFSave", f.name),
                                    Rev=int(temp2[0]),
                                    )
        return HttpResponse("upload over")
    return HttpResponse('OK')




