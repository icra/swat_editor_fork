#ICRA Adrià Riu

from .base import BaseFileModel, FileColumn as col
from helpers import utils
from database.project.recall import Recall_pollutants_dat, Recall_rec
import database.project.hru_parm_db as db


class Pollutants_om_exc(BaseFileModel):
	def __init__(self, file_name, version=None, swat_version=None):
		self.file_name = file_name
		self.version = version
		self.swat_version = swat_version

	def read(self, database='project'):
		raise NotImplementedError('Reading not implemented yet.')

	def write(self):
		#self.write_default_table(db.Exco_om_exc, True)
		table = Recall_pollutants_dat
		order_by = db.Pollutants_pth.id
		#recall_recs = Recall_rec.select(Recall_rec, Recall_dat).join(Recall_dat).where((Recall_rec.rec_typ == 4) & (Recall_dat.flo != 0))
		valid_recs = Recall_pollutants_dat.select(
				Recall_pollutants_dat.recall_rec_id,
				Recall_pollutants_dat.pollutants_pth,
				Recall_pollutants_dat.jday,
				Recall_pollutants_dat.mo,
				Recall_pollutants_dat.day_mo,
				Recall_pollutants_dat.yr,
				Recall_pollutants_dat.load
			).join(Recall_rec).where((Recall_rec.rec_typ == 4) & (Recall_pollutants_dat.load != 0))
		valid_ids = [r.recall_rec_id for r in valid_recs]
		recall_recs = Recall_rec.select().where(Recall_rec.id.in_(valid_ids))

		if valid_recs.count() > 0:
			with open(self.file_name, 'w') as file:
				file.write(self.get_meta_line())
				cols = [col(table.recall_rec_id),
						col(table.pollutants_pth_id),
						col(table.jday),
						col(table.mo),
						col(table.day_mo),
						col(table.yr),
						col(table.load)
						]
				self.write_headers(file, cols)
				file.write("\n")

				for rec in valid_recs:
					rec_name = Recall_rec.select(Recall_rec.name).where(Recall_rec.id == rec.recall_rec_id)
					poll_name = db.Pollutants_pth.select(db.Pollutants_pth.name).where(db.Pollutants_pth.id == rec.pollutants_pth_id)
					if rec_name.count() > 0 and poll_name.count() > 0:
						file.write(utils.string_pad(rec_name[0].name))
						file.write(utils.string_pad(poll_name[0].name))
						file.write(utils.num_pad(rec.jday))
						file.write(utils.num_pad(rec.mo))
						file.write(utils.num_pad(rec.day_mo))
						file.write(utils.num_pad(rec.yr))

						decimal_places = len(str(float_number).split('.')[1])
						file.write(utils.num_pad(rec.load, decimals = decimal_places))
						file.write("\n")


class Exco_pollutants_exc(BaseFileModel):
	def __init__(self, file_name, version=None, swat_version=None):
		self.file_name = file_name
		self.version = version
		self.swat_version = swat_version

	def read(self, database='project'):
		raise NotImplementedError('Reading not implemented yet.')

	def write(self):
		self.write_default_table(db.Pollutants_pth, True)
