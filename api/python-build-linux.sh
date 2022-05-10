#!/bin/bash 
pyinstaller --distpath ../api_dist swatplus_rest_api.py --noconfirm --onefile
pyinstaller --distpath ../api_dist swatplus_api.py --noconfirm --onefile
cd ../api_dist
staticx swatplus_api swatplus_api_static
staticx swatplus_rest_api swatplus_rest_api_static
rm swatplus_api
rm swatplus_rest_api
mv swatplus_api_static swatplus_api
mv swatplus_rest_api_static swatplus_rest_api