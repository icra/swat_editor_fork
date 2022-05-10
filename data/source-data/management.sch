management.sch: Common landuse management
    MGT_NAME    NUMB_OPS   NUMB_AUTO OP_TYPE  MONTH  DAY  HU_SCH  OP_DATA      OP_DATA2      OP_DATA3
     agr_irr           5         1           
	                       autoirr_str.8
                                     till     4    30   0.130  fldcult        null        0.000
                                     fert     4    30   0.130   elem_n   broadcast       20.000
					                 plnt     5    30   0.150     agrc        null        0.000
					                 hvkl    10    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000    
 agr_notill_nofert       3         0                                                                   
					                 plnt     5    30   0.150     agrc        null        0.000
				                     hvkl    10    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_mintill_fert      5         0                                                              
                                     till     4    30   0.130  fldcult        null        0.000
                                     fert     4    30   0.130   elem_n   broadcast       20.000
				                     plnt     5    30   0.150     agrc        null        0.000
							         hvkl    10    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_notill_fert       4         0                                                              
                                     fert     4    30   0.130   elem_n   broadcast       20.000
					                 plnt     4    30   0.130     agrc        null        0.000
							         hvkl    10    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_plow_fert         5         0 
                                     till     4    30   0.130 diskplow        null        0.000 
                                     fert     4    30   0.130   elem_n   broadcast       20.000
					                 plnt     5    30   0.150     agrc        null        0.000
									 hvkl    10    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_notill_nofert_irr   3         1
 	                       autoirr_str.8
					                 plnt     5    30   0.150     agrc        null        0.000
									 hvkl    10    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_mintill_fert_irr  5         1
 	                       autoirr_str.8
                                     till     4    30   0.130  fldcult        null        0.000
                                     fert     4    30   0.130   elem_n   broadcast       20.000
						             plnt     5    30   0.150     agrc        null        0.000
									 hvkl    12    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_notill_fert_irr   4         1                                                              
                           autoirr_str.8
				                     fert     4    30   0.130   elem_n   broadcast       20.000
								     plnt     5    30   0.150     agrc        null        0.000
								     hvkl    12    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000
 agr_plow_fert_irr     5         1
 	                       autoirr_str.8
                                     till     4    30   0.130 diskplow        null        0.000 
                                     fert     4    30   0.130   elem_n   broadcast       20.000
						             plnt     5    30   0.150     agrc        null        0.000
								     hvkl    12    30   1.200     agrc        null        0.000
                                     skip    12    30   1.200     null        null        0.000	
  past_berm_fert       6         0
                                     plnt     3     1   0.100     past        null        0.000                  
                                     fert     4     1   0.150   elem_n   broadcast       30.000
                                     harv     8     1   0.500     past   hay_cut_high     0.000
                                     harv    10     1   0.500     past   hay_cut_high     0.000
                                     kill    12    30   1.200     past        null        0.000     
                                     skip    12    30   1.200     null        null        0.000
  past_berm_nofert     5         0
                                     plnt     3     1   0.100     past        null        0.000                  
                                     harv     8     1   0.500     past   hay_cut_high     0.000
                                     harv    10     1   0.500     past   hay_cut_high     0.000
                                     kill    12    30   1.200     past        null        0.000     
                                     skip    12    30   1.200     null        null        0.000
  past_berm_grz_fert   7         0
                                     plnt     3     1   0.100     past        null        0.000
                                     graz     3     1   0.100     beef_low       null          360									 
                                     fert     4     1   0.150   elem_n   broadcast       30.000
                                     harv     8     1   0.500     past   hay_cut_high     0.000
                                     harv    10     1   0.500     past   hay_cut_high     0.000
                                     kill    12    30   1.200     past        null        0.000     
                                     skip    12    30   1.200     null        null        0.000
  past_berm_grz_nofert     6         0
                                     plnt     3     1   0.100     past        null        0.000 
                                     graz     3     1   0.100     beef_low       null          360										 
                                     harv     8     1   0.500     past   hay_cut_high     0.000
                                     harv    10     1   0.500     past   hay_cut_high     0.000
                                     kill    12    30   1.200     past        null        0.000     
                                     skip    12    30   1.200     null        null        0.000
       frst_grow           2         0
                                     mons     6     1   0.000     null        null        0.000     
                                     mons     8     1   0.000     null        null        0.000
   agrr             3   1
                        spring_fert_agrr              
                      plnt        0        0    0.150              corn     null      0.0      PLANT BEGIN
                      hvkl       10       30    1.200              corn    grain      0.0      HARVKILL
	              skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
   agrc             3   1
                        fall_fert_agrc 
					  hvkl        6        15    1.200              wwht    grain      0.0      HARVKILL
                      plnt       10        30    0.150              wwht     null      0.0      PLANT BEGIN
                     skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
   ag_P_fert             6   1
                      spring_fert_legume 
					  plnt        0        0    0.150              alfa     null      0.0      PLANT BEGIN
                      harv        0         0   0.400              alfa    hay_cut_low      0.0      HARVONLY
					  harv        0         0   0.600              alfa    hay_cut_low      0.0      HARVONLY
					  harv        0         0   0.800              alfa    hay_cut_low      0.0      HARVONLY
					  hvkl       10       30    1.200              alfa    hay_cut_high      0.0      HARVKILL
	              skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
   ag_tree             2   1
                        spring_fert_agrr              
                  harv       10       30    1.200              almd    grain      0.0      HARVONLY
	              skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    ag_veg             3   1
                        spring_fert_agrr              
                      plnt        0        0    0.150              corn     null      0.0      PLANT BEGIN
                      hvkl       10       30    1.200              corn    grain      0.0      HARVKILL
	              skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    barren             1   0
                  skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    managed_past      6   1
                      spring_fert_agrr 
					  plnt        0        0    0.150              alfa     null      0.0      PLANT BEGIN
                      harv        0         0   0.400              alfa    hay_cut_low      0.0      HARVONLY
					  harv        0         0   0.600              alfa    hay_cut_low      0.0      HARVONLY
					  harv        0         0   0.800              alfa    hay_cut_low      0.0      HARVONLY
					  hvkl       10       30    1.200              alfa    hay_cut_high      0.0      HARVKILL
	              skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
   ag_spring             3   1
                        spring_fert_ag              
                      plnt        0        0    0.05              corn     null      0.0      PLANT BEGIN
                      hvkl       10       30    1.200              corn    grain      0.0      HARVKILL
	              skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    forest             1   0
                  skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    brush             1   0
                  skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    range_brush             1   0
                  skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    range_grass             1   0
                  skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
    wetland             1   0
                  skip        0        0    0.000              null     null      0.0      SKIP_YEAR 
        no_mgt             0         0									 