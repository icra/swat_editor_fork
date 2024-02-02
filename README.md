# README #

Custom Desktop interface to SWAT+ allowing the user to import a project from GIS, modify SWAT+ input, write the text files, and run a [custom SWAT+ model](https://github.com/icra/swatplus) that can model point-source pollution.

Read the documentation at [swatplus.gitbook.io/docs](https://swatplus.gitbook.io/docs) and [join the user group](https://groups.google.com/g/swatplus-editor) to be notified of new releases.

## Installing and running the source code ##

### Back-end development stack ###

1. Install [Python 3](https://www.python.org/) (version 3.5 and up)
2. Install required Python packages
    * From command prompt, go to source code `/api` directory
    * Run `pip install -r requirements.txt`
3. Update the `appsettings.json` file in the root of the source code directory with your python PATH variable (typically `python` on Windows and `python3` on Linux and MacOS)

### Front-end development stack ###

1. Install [Node.js](https://nodejs.org/en/)
2. Install required Node.js packages
    * From command prompt, go to the root directory of the source code
    * Run `npm install`

### Running the source code ###

1. If needed, adjust the `pythonPath` setting in `appsettings.json`; change to `python` (Windows) or `python3` (Linux/MacOS)
1. From command prompt, go to the root directory of the source code
2. Run `npm run serve`
3. In another prompt, run `npm run electron`

### Development tools ###

1. [Visual Studio Code](https://code.visualstudio.com/)
