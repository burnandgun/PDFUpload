# # !/usr/bin/env python
# # coding:utf-8


# import os
#
# from PDFUpload import settings
#
# b = 'a'
# c = open(os.path.join(os.path.dirname(os.path.dirname(settings.__file__)), b), 'wb+')

# import os
#
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PDFUpload.settings")
#
# import sys
# reload(sys)
# sys.setdefaultencoding('utf8')
#
#
# import django
# if django.VERSION >= (1, 7):
#     django.setup()
#
#
# from PDFDeal.models import *
# from PDFUpload import settings
#
#
# print settings.BASE_DIR
#
# print  os.path.join(settings.BASE_DIR, 'static')

a = "test.pdf"
print(a[-3:])