# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class DrawingSize(models.Model):
    Name = models.CharField(max_length=20, verbose_name="名称")
    Size = models.CharField(max_length=20, verbose_name="尺寸", null=True, blank=True)

    def __unicode__(self):
        return u'%s' % (self.Name .__str__())

    class Meta:
        verbose_name = "图幅"
        verbose_name_plural = "图幅汇总"


class Drawings(models.Model):
    DocNO = models.CharField(max_length=20, verbose_name="资料号", unique=True)
    Name = models.CharField(max_length=20, verbose_name="名称")
    Size = models.ForeignKey(DrawingSize, verbose_name="图幅", null=True, blank=True)
    FileName = models.CharField(max_length=100, verbose_name="地址")
    Regtime = models.DateTimeField(verbose_name="创建时间", null=True, blank=True, auto_now_add=True)
    Updatetime = models.DateTimeField(verbose_name="更新时间", null=True, blank=True, auto_now=True)
    Rev = models.IntegerField(verbose_name="版本号", default=0)
    # Status = models.ForeignKey(PDM_Status, verbose_name="状态", null=True, blank=True)
    isActive = models.BooleanField(verbose_name="是否生效", default=True)

    def __unicode__(self):
        return u'%s' % (self.Updatetime.__str__())

    class Meta:
        verbose_name = "材料"
        verbose_name_plural = "材料汇总"


class Units(models.Model):
    Name = models.CharField(max_length=20, verbose_name="名称")
    # Department = models.ForeignKey(Department, verbose_name="部门", null=True, blank=True)

    def __unicode__(self):
        return u'%s' % (self.Name .__str__())

    class Meta:
        verbose_name = "单位"
        verbose_name_plural = "单位汇总"


class Materials(models.Model):
    Name = models.CharField(max_length=20, verbose_name="名称")
    # Department = models.ForeignKey(Department, verbose_name="部门", null=True, blank=True)

    def __unicode__(self):
        return u'%s' % (self.Name .__str__())

    class Meta:
        verbose_name = "材料"
        verbose_name_plural = "材料汇总"


class PDM_Status(models.Model):
    NO = models.CharField(max_length=20, verbose_name="代码", unique=True)
    Name = models.CharField(max_length=20, verbose_name="名称")

    def __unicode__(self):
        return u'%s' % (self.Name .__str__())

    class Meta:
        verbose_name = "状态"
        verbose_name_plural = "状态汇总"
