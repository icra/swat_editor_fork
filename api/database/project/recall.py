from peewee import *
from . import base, hru_parm_db


class Recall_rec(base.BaseModel):
	name = CharField(unique=True)
	rec_typ = IntegerField()  # 1-day, 2-mon, 3-yr, 4-const


class Recall_dat(base.BaseModel):
	recall_rec = ForeignKeyField(Recall_rec, on_delete='CASCADE', related_name='data')
	jday = IntegerField()
	mo = IntegerField()
	day_mo = IntegerField()
	yr = IntegerField()
	ob_typ = CharField(null=True)
	ob_name = CharField(null=True)
	flo = DoubleField()
	sed = DoubleField()
	orgn = DoubleField()
	sedp = DoubleField()
	no3 = DoubleField()
	solp = DoubleField()
	chla = DoubleField()
	nh3 = DoubleField()
	no2 = DoubleField()
	cbod = DoubleField()
	dox = DoubleField()
	sand = DoubleField()
	silt = DoubleField()
	clay = DoubleField()
	sag = DoubleField()
	lag = DoubleField()
	gravel = DoubleField()
	tmp = DoubleField()

#ICRA Adrià Riu
class Recall_pollutants_dat(base.BaseModel):
	recall_rec = ForeignKeyField(Recall_rec, on_delete='CASCADE', related_name='data')
	pollutants_pth = ForeignKeyField(hru_parm_db.Pollutants_pth, on_delete='CASCADE', related_name='data')
	jday = IntegerField()
	mo = IntegerField()
	day_mo = IntegerField()
	yr = IntegerField()
	load = DoubleField()




