# -*- coding: utf-8 -*-
import json
import os

from PDFUpload import settings
from PDFDeal.models import Drawings, DrawingSize


def pdfToDB(list, file):
    if list['style'] == 'add':
        ds = DrawingSize.objects.get(Name=list['Size'])
        Drawings.objects.create(DocNO=list['DocNO'],
                                Name=list['Name'],
                                Size=ds,
                                FileName=os.path.join(os.path.dirname(os.path.dirname(settings.__file__)) +
                                                      "\\PDFSave", file.name),
                                Rev=int(list['REV']))
    elif list['style'] == 'cite':
        pass
    elif list['style'] == 'replace':
        temp = Drawings.objects.filter(DocNO=list['DocNO'])
        ds = DrawingSize.objects.get(Name=list['Size'])
        temp.update(DocNO=list['DocNO'],
                    Name=list['Name'],
                    Size=ds,
                    FileName=os.path.join(os.path.dirname(os.path.dirname(settings.__file__)) +
                                                      "\\PDFSave", file.name),
                    Rev=int(list['REV']))



def jsonCompareDB(jsoncontent):
    for i in range(0, len(jsoncontent)):
        style = Drawings.objects.filter(DocNO=str(jsoncontent[i]["DocNO"]))
        if len(style) == 0:
            jsoncontent[i]['style'] = "add"
        elif len(style) == 1:
            if style[0].Rev == jsoncontent[i]['REV']:
                jsoncontent[i]['style'] = "cite"
            else:
                jsoncontent[i]['style'] = "replace"
    return jsoncontent
