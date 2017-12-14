# !/usr/bin/env python
# coding:utf-8

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PDFUpload.settings")


import django
if django.VERSION >= (1, 7):
    django.setup()


def main():
    from PDFDeal.models import DrawingSize

    DrawingSize.objects.create(Name="A0", Size="841X1189")
    DrawingSize.objects.create(Name="A1", Size="594X841")
    DrawingSize.objects.create(Name="A2", Size="420X594")
    DrawingSize.objects.create(Name="A3", Size="297X420")
    DrawingSize.objects.create(Name="A4", Size="210X297")


if __name__ == "__main__":
    main()
    print('Done!')