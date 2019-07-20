[Setup]
AppName=Jan K. Pluta
SourceDir=..\app\dist\jkpluta-electron-win32-ia32\
DefaultDirName={pf}\jkpluta-electron
DefaultGroupName=JKP
UninstallDisplayIcon={app}\jkpluta-electron.exe
Compression=lzma2
SolidCompression=yes
OutputDir=..\..\..\dist
#define AppVersion = GetFileVersion(SourcePath + SetupSetting("SourceDir") + "\jkpluta-electron.exe")
AppVersion={#AppVersion}
VersionInfoProductName=Jan K. Pluta
VersionInfoVersion={#AppVersion}
VersionInfoCopyright=Copyright © 2017-2019 by Jan K. Pluta
VersionInfoCompany=JKP
OutputBaseFilename=setup-jkpluta-electron
ShowLanguageDialog=no
DisableWelcomePage=no
DisableDirPage=auto
DisableProgramGroupPage=auto
DisableReadyPage=no
DisableFinishedPage=no
WizardSmallImageFile=..\..\..\IS\Icon.bmp
WizardImageFile=..\..\..\IS\jkpluta-electron.bmp
SignTool=JKP /d "Jan K. Pluta" $f

[Languages]
Name: pl; MessagesFile: "compiler:Languages\Polish.isl"

[Tasks]
Name: "desktopicon"; Description: "Ikona na &pulpicie"; GroupDescription: "Dodatkowe skróty:"; 

[Dirs]
Name: "{app}\css"

[Files]
Source: "*.*"; DestDir: "{app}"; Flags: recursesubdirs;

[Icons]
Name: "{group}\Jan K. Pluta"; Filename: "{app}\jkpluta-electron.exe"
Name: "{commondesktop}\Jan K. Pluta"; Filename: "{app}\jkpluta-electron.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\jkpluta-electron.exe"; Description: "Uruchom aplikację"; Flags: postinstall nowait skipifsilent

