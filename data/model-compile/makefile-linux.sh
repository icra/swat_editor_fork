#!/bin/bash 
# run the following first to set intel environment
# . ~/intel/oneapi/setvars.sh or . /opt/intel/oneapi/setvars.sh
#mv proc_allo.f90 proc_allo.f90x
#mv ru_allo.f90 ru_allo.f90x
#mv sim_inityr.f90 sim_inityr.f90x
#mv water_hru.f90 water_hru.f90x
rm *.o
rm *.mod
rm rev60.5.4_64rel_linux
ifort -c hru_module.f90 -traceback -O3 -parallel
ifort -c time_module.f90 -traceback -O3 -parallel
ifort -c constituent_mass_module.f90 -traceback -O3 -parallel
ifort -c *_module.f90 -traceback -O3 -parallel
ifort -c allocate_parms.f90 -traceback -O3 -parallel
ifort -c *.f90 -traceback -O3 -parallel
ifort -o rev60.5.4_64rel_linux *.o -traceback -O3 -parallel -static