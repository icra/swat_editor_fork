#!/bin/bash 
pyinstaller --distpath ../api_dist swatplus_rest_api.py --noconfirm -D
pyinstaller --distpath ../api_dist swatplus_api.py --noconfirm -D