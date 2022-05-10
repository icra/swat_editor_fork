#include <idp.iss>

#define SWATPlusVersion "2.1"
#define SWATPlusPatchVersion "0"
#define QSWATPlusVersion "2.2"
#define QSWATPlusPatchVersion "3"
#define ModelVersion "60.5.4"
#define SWATURL "https://swat.tamu.edu/"

[Setup]
AppId={{31E602D4-5220-421E-BE21-8F0A111FC4AD}
AppName=SWAT+ Tools
AppVersion={#SWATPlusVersion}.{#SWATPlusPatchVersion}
DefaultDirName=C:\SWAT\SWATPlus
PrivilegesRequired=lowest
SetupIconFile=..\public\icons\ico\256x256.ico
DisableProgramGroupPage=yes
AppPublisher=Texas A&M AgriLife Research
AppPublisherURL={#SWATURL}
AppSupportURL={#SWATURL}
AppUpdatesURL={#SWATURL}
OutputBaseFilename=swatplustools-installer-{#SWATPlusVersion}.{#SWATPlusPatchVersion}
OutputDir=output
ArchitecturesInstallIn64BitMode=x64
LicenseFile=..\license.txt
EnableDirDoesntExistWarning=True
DirExistsWarning=no
DisableDirPage=no

[Files]
Source: "..\data\downloads\QSWATPlus3_9install{#QSWATPlusVersion}.{#QSWATPlusPatchVersion}.exe"; DestDir: "{tmp}"; Components: qswat; 
Source: "dist\swatplus.editor-installer-{#SWATPlusVersion}.{#SWATPlusPatchVersion}.exe"; DestDir: "{tmp}"; Components: editor; 
Source: "{tmp}\swatplus_soils.sqlite"; DestDir: "{app}\Databases"; Flags: external; ExternalSize: 219260928; Components: soils
Source: "{tmp}\swatplus_wgn.sqlite"; DestDir: "{app}\Databases"; Flags: external; ExternalSize: 350517248; Components: wgn

[Dirs]
Name: "{app}\Databases"

[Components]
Name: "qswat"; Description: "QSWAT+ QGIS interface {#QSWATPlusVersion}.{#QSWATPlusPatchVersion}"; Types: typical full custom
Name: "qswat\swatGraph"; Description: "SWATGraph tool.  Not needed if you have QSWAT."; Types: typical full custom
Name: "qswat\manual"; Description: "QSWAT+ user manual"; Types: typical full custom
Name: "editor"; Description: "SWAT+ Editor {#SWATPlusVersion}.{#SWATPlusPatchVersion} (includes model rev. {#ModelVersion})"; Types: typical full custom
Name: "wgn"; Description: "Global weather generator data for SWAT+ (download)"; Types: full
Name: "soils"; Description: "US SSURGO/STATSGO soil data for SWAT+ (download)"; Types: full

[Types]
Name: "typical"; Description: "Typical installation"
Name: "full"; Description: "Full installation"
Name: "custom"; Description: "Custom installation"; Flags: iscustom

[Files]
Source: "..\data\downloads\SWATPlus\*"; DestDir: "{app}"; Excludes: "\Tools\SWATGraph, \Documents"; Components: qswat; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\data\downloads\SWATPlus\Tools\SWATGraph\runSWATGraph.bat"; DestDir: "{app}\Tools\SWATGraph"; Components: qswat\swatGraph; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\data\downloads\SWATPlus\Documents\QSWATPlus_Manual_v{#QSWATPlusVersion}.pdf"; DestDir: "{app}\Documents"; Components: qswat\manual;  Flags: ignoreversion recursesubdirs createallsubdirs

[Run]
Filename: "{tmp}\QSWATPlus3_9install{#QSWATPlusVersion}.{#QSWATPlusPatchVersion}.exe"; WorkingDir: "{tmp}"; Flags: skipifdoesntexist skipifsilent
Filename: "{tmp}\swatplus.editor-installer-{#SWATPlusVersion}.{#SWATPlusPatchVersion}.exe"; Parameters: "/D=""{app}\SWATPlusEditor"""; WorkingDir: "{tmp}"; Flags: skipifdoesntexist skipifsilent
Filename: "{tmp}\QSWATPlus3_9install{#QSWATPlusVersion}.{#QSWATPlusPatchVersion}.exe"; Parameters: "/VERYSILENT /CURRENTUSER"; WorkingDir: "{tmp}"; Flags: skipifdoesntexist skipifnotsilent
Filename: "{tmp}\swatplus.editor-installer-{#SWATPlusVersion}.{#SWATPlusPatchVersion}.exe"; Parameters: "/S /D=""{app}\SWATPlusEditor"""; WorkingDir: "{tmp}"; Flags: skipifdoesntexist skipifnotsilent

[Messages]
SelectDirBrowseLabel=If you select a different location from the default, you will need to set this location in the QSWAT+ Parameters form the first time you run QSWAT+.
ConfirmUninstall=Are you sure you want to remove %1? SWAT+ Editor, tools, and documents will be removed. The QSWAT+ plugin will need to be uninstalled separately.

[UninstallRun]
Filename: "{app}\SWATPlusEditor\Uninstall SWATPlusEditor.exe"; WorkingDir: "{app}\SWATPlusEditor"; Flags: skipifdoesntexist

[Code]
procedure InitializeWizard;
begin
    //idpAddFileSizeComp('https://bitbucket.org/swatplus/swatplus.editor/downloads/swatplus_soils.sqlite', ExpandConstant('{tmp}\swatplus_soils.sqlite'), 196940800, 'soils');
    //idpAddFileSizeComp('https://bitbucket.org/swatplus/swatplus.editor/downloads/swatplus_wgn.sqlite', ExpandConstant('{tmp}\swatplus_wgn.sqlite'), 350517248, 'wgn');
    //Possible bug in above? Seems to download regardless if comp selected or not. So need to use no size given below for now.
    idpAddFileComp('https://bitbucket.org/swatplus/swatplus.editor/downloads/swatplus_soils.sqlite', ExpandConstant('{tmp}\swatplus_soils.sqlite'), 'soils');
    idpAddFileComp('https://bitbucket.org/swatplus/swatplus.editor/downloads/swatplus_wgn.sqlite', ExpandConstant('{tmp}\swatplus_wgn.sqlite'), 'wgn');

    idpDownloadAfter(wpReady);
end;