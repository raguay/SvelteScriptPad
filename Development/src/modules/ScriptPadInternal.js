const chokidar = window.chokidar;
const os = window.os;
const fs = window.fs;
const fsex = window.fsex;
const nw = window.nw;
const childProcess = window.childProcess;
const execSync = childProcess.execSync;
const exec = childProcess.exec;
import moment from 'moment';
const math = window.mathjs;
import Handlebars from "handlebars";
const axios = window.axios;
const request = window.syncrequest;
import ip from 'ip';
import SystemScripts from './SystemScripts';
import SystemRegExps from './SystemRegExps';
import SystemTemplates from './SystemTemplates';

const ScriptPadInternal = {
  logger: null,
  app: null,
  httpServer: null,
  server: null,
  HOME: os.homedir(),
  NOTES: null,
  NOTESDIR: os.homedir() + '/.scriptpad',
  NOTESFILELOC: os.homedir() + '/.scriptpad/.notesjson',
  SCRIPTS: null,
  SCRIPTSFILELOC: os.homedir() + '/.scriptpad/.scriptsjson',
  REGEXP: null,
  REGEXPFILELOC: os.homedir() + '/.scriptpad/.regexpjson',
  PREFERENCES: {
    server: 'http://localhost:9978',
    codeMode: 'javascript',
    noteMode: 'markdown',
    codeLineNumbers: true,
    noteLineNumbers: false,
    scriptKeyMap: 'vim',
    noteKeyMap: 'sublime',
    style: 'default',
    UseNotePlan: false,
    UseTaskPaper: false,
    taskpaper: [],
    styleActiveLine: true,
    REDAuto: true,
    REDDashboard: false,
    RedSecret: "jesus-is-lord",
    clearCache: false
  },
  //
  // Some default values:
  //
  PREFERENCESFILELOC: os.homedir() + '/.scriptpad/preferences.json',
  SERVERLOCATION: nw.__dirname,
  USERTEMPLATESFILE: os.homedir() + '/.scriptpad/templates.json',
  SCRIPTBARPREFERENCES: os.homedir() + '/.scriptpad/scriptbar.json',
  TEMPLATES: null,
  STYLE: {
    buttons: [{
      selected: true,
      color: '#CC5A7B',
      id: 0
    }, {
      selected: false,
      color: '#E47D98',
      id: 1
    }, {
      selected: false,
      color: '#FF8CAA',
      id: 2
    }, {
      selected: false,
      color: '#FFBBD0',
      id: 3
    }, {
      selected: false,
      color: '#F1C0CC',
      id: 4
    }, {
      selected: false,
      color: '#F9E2EA',
      id: 5
    }, {
      selected: false,
      color: '#C2B1DB',
      id: 6
    }, {
      selected: false,
      color: '#B09BD2',
      id: 7
    }, {
      selected: false,
      color: '#8279AC',
      id: 8
    }],
    commandbuttons: [{
      selected: true,
      color: '#CC5A7B',
      id: 0
    }, {
      selected: false,
      color: '#E47D98',
      id: 1
    }, {
      selected: false,
      color: '#FF8CAA',
      id: 2
    }, {
      selected: false,
      color: '#FFBBD0',
      id: 3
    }, {
      selected: false,
      color: '#F1C0CC',
      id: 4
    }, {
      selected: false,
      color: '#F9E2EA',
      id: 5
    }, {
      selected: false,
      color: '#C2B1DB',
      id: 6
    }, {
      selected: false,
      color: '#B09BD2',
      id: 7
    }, {
      selected: false,
      color: '#8279AC',
      id: 8
    }],
    matchStyle: ['#CC5A7B', '#E47D98', '#FF8CAA', '#FFBBD0', '#F1C0CC', '#F9E2EA', '#C2B1DB', '#B09BD2', '#8279AC'],
    textcolor: '#aba8a9',
    editorBackground: '#013948',
    appBackground: '#191b1e',
    editorTheme: 'oceanic-next',
    shadowColor: '#0D1E2A',
    scriptMenuBackground: '#0281A3',
    scriptMenuTextColor: '#EFF1EB',
    selectionBackgroundColor: 'white',
    selectionColor: 'gray',
    selectionMenuColor: 'blue',
    selectionMenuBackgroundColor: 'lightgray',
    scriptMenuItemSystem: 'darkgrey',
    scriptMenuItemUser: 'lightblue',
    todoIconAddress: 'imgs/clipboard.png',
  },
  STYLESLOCATION: os.homedir() + '/.scriptpad/styles/',

  HOSTNAME: 'localhost',
  PORTNUMBER: 9978,
  CONNECTED: false,
  nw: nw,
  fs: fs,
  moment: moment,
  math: math,
  chokidar: chokidar,
  execSync: execSync,
  Handlebars: Handlebars,
  axios: axios,
  request: request,
  //
  // The NotePlan calendar todos possible locations. Only one of 
  // these should be
  // valid on a computer. The acutal file is YYYYMMDD.txt.
  //
  // The todos for TaskPaper lists are in the preferences as they 
  // can be almost 
  // anywhere on the computer.
  //
  NPiCLOUD: os.homedir() + '/Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents/Calendar/',
  NPLOCAL: os.homedir() + '/Library/Containers/co.noteplan.NotePlan/Data/Library/Application Support/co.noteplan.NotePlan/Calendar/',
  NPLOCALBASIC: os.homedir() + '/Library/Application Support/co.noteplan/Calendar/',
  NPFoundFile: '',
  getTodos: function(callback) {
    //
    // Get the different todos
    //
    this.getTodosCallback = callback;
    var ToDos = []
    if (this.PREFERENCES.UseNotePlan) {
      var rawToDos = ''
      var todosNP = []
      var todayFN = this.moment().format('YYYYMMDD') + '.txt'
      if (fs.existsSync(this.NPiCLOUD + todayFN)) {
        this.NPFoundFile = this.NPiCLOUD + todayFN;
        rawToDos = fs.readFileSync(this.NPFoundFile, 'utf8')
      } else if (fs.existsSync(this.NPLOCAL + todayFN)) {
        this.NPFoundFile = this.NPLOCAL + todayFN;
        rawToDos = fs.readFileSync(this.NPFoundFile, 'utf8')
      } else if (fs.existsSync(this.NPLOCALBASIC + todayFN)) {
        this.NPFoundFile = this.NPLOCALBASIC + todayFN;
        rawToDos = fs.readFileSync(this.NPFoundFile, 'utf8')
      } else {
        rawToDos = '';
      }

      //
      // Clean it up for the user.
      //
      if (rawToDos !== '') {
        rawToDos = rawToDos.split('\n')
        var stop = rawToDos.length
        for (var i = 0; i < stop; i++) {
          rawToDos[i] = rawToDos[i].trim()
          var done = false
          if (rawToDos[i] != '') {
            if (rawToDos[i][3] == 'x') {
              done = true
              rawToDos[i] = '-' + rawToDos[i].substr(5)
            }
            todosNP.push({
              description: rawToDos[i].substr(2),
              done: done,
              deleted: done
            })
          }
        }
      }

      //
      // Add to all the todos sending to the user.
      //
      ToDos.push({
        'name': 'Note Plan',
        'location': 'Note Plan',
        'todos': todosNP
      })
    }
    if (this.PREFERENCES.UseTaskPaper) {
      //
      // Read in each taskpaper todos and add them to the sturcture.
      //
      var stopP = this.PREFERENCES.taskpaper.length
      for (var x = 0; x < stopP; x++) {
        var todos = []
        var rawToDos = []

        //
        // the file should exist, but if not, just check to be sure.
        //
        if (fs.existsSync(this.PREFERENCES.taskpaper[x].loc)) {
          rawToDos = fs.readFileSync(this.PREFERENCES.taskpaper[x].loc, 'utf8')
        }

        //
        // Split it by lines.
        //
        rawToDos = rawToDos.split('\n')
        var stop = rawToDos.length
        for (var i = 0; i < stop; i++) {
          rawToDos[i] = rawToDos[i].trim()
          var done = false
          if (rawToDos[i] != '') {
            if ((!rawToDos[i].endsWith(':'))) {
              if (rawToDos[i].indexOf('@done') >= 0) {
                done = true
              }
              todos.push({
                description: rawToDos[i].substr(2),
                done: done,
                deleted: done
              })
            }
          }
        }
        //
        // Add to all the todos sending to the user.
        //
        ToDos.push({
          'name': this.PREFERENCES.taskpaper[x].name,
          'location': this.PREFERENCES.taskpaper[x].loc,
          'todos': todos
        })
      }
    }
    return (ToDos);
  },
  saveTodos: function(todos) {
    //
    // Get the location of the save file. 
    //
    this.SAVINGTODOS = true;
    var tstop = todos.length
    for (var l = 0; l < tstop; l++) {
      if (todos[l].name === 'Note Plan') {
        //
        // It's a Note Plan todo. Save it. Get the file location.
        //
        var savePath = ''
        var todayFN = this.moment().format('YYYYMMDD') + '.txt'
        if (fs.existsSync(this.NPiCLOUD + todayFN)) {
          savePath = this.NPiCLOUD + todayFN
        } else if (fs.existsSync(this.NPLOCAL + todayFN)) {
          savePath = this.NPLOCAL + todayFN
        } else {
          savePath = this.NPLOCALBASIC + todayFN
        }

        //
        // Prepare the todos
        //
        var NotDone = []
        var stop = todos[l].todos.length
        var Done = []
        for (var i = 0; i < stop; i++) {
          if (todos[l].todos[i].done) {
            //
            // It's done, add NotePlan's syntax.
            //
            Done.push('- [x] ' + todos[l].todos[i].description.trim())
          } else {
            //
            // Just a normal todo.
            //
            NotDone.push('- ' + todos[l].todos[i].description.trim())
          }
        }

        //
        // Write out the file. Working on expansion, don't save.
        //
        try {
          fs.writeFileSync(savePath, NotDone.join('\n') + '\n' + Done.join('\n'),{ flag: 'w+' })
        } catch(e) {
          console.log("Can't write to Noteplan file")
        }
      } else {
        //
        // It's a taskpaper todo. Save it.
        //
        var index = 0
        var stop = this.PREFERENCES.taskpaper.length
        for (var i = 0; i < stop; i++) {
          if (this.PREFERENCES.taskpaper[i].name === todos[l].name) {
            index = i
          }
        }

        //
        // create the variables and get the location.
        //
        var savePath = this.PREFERENCES.taskpaper[index].loc
        var NotDone = []
        NotDone.push(this.moment().format('dddd MM-DD-YYYY:'))
        var Done = []
        Done.push('Archive:')

        //
        // Save the todos
        //
        var stop = todos[l].todos.length
        for (var i = 0; i < stop; i++) {
          if (todos[l].todos[i].done) {
            Done.push('\t- ' + todos[l].todos[i].description.trim())
          } else {
            NotDone.push('\t- ' + todos[l].todos[i].description.trim())
          }
        }

        //
        // Write out the file. Put the not done tasks before the done
        // tasks.
        //
        try {
          fs.writeFileSync(savePath, NotDone.join('\n') + '\n' + Done.join('\n'))
        } catch(e) {
          console.log("Can't write file " + savePath)
        }
      }
    }
    this.SAVINGTODOS = false;
  },

  //
  // The file that contains the list of servers to send the clipboard information
  // to. There should be a server per line.
  //
  SERVERLISTPATH: os.homedir() + '/.scriptpad/.clipboardservers',

  //
  // Get the system scripts.
  //
  SYSTEMSCRIPTS: SystemScripts,
  SYSTEMREGEXPS: SystemRegExps,
  SYSTEMTEMPLATES: SystemTemplates,

  //
  // Setup the file watching and signal the user app when changes happen.
  //
  NOTEPLANWATCHER: null,
  TASKPAPERWATCHER: null,
  SAVINGTODOS: false,
  setFileWatches: function() {
    if (this.PREFERENCES.UseNotePlan) {
      if (this.NOTEPLANWATCHER !== null) {
        this.NOTEPLANWATCHER.close();
      }
      this.NOTEPLANWATCHER = chokidar.watch(this.NPFoundFile, {
        ignored: /[\/\\]\./,
        persistent: true,
        depth: 1,
        awaitWriteFinish: true,
        ignorePermissionErrors: true
      });
      var that = this;
      this.NOTEPLANWATCHER.on('change', (path) => {
        that.callReadTodos();
      });
    }
    if (this.PREFERENCES.UseTaskPaper) {
      if (this.TASKPAPERWATCHER !== null) {
        this.TASKPAPERWATCHER.close();
        this.TASKPAPERWATCHER = null;
      }
      var stopP = this.PREFERENCES.taskpaper.length;
      var that = this;
      for (var x = 0; x < stopP; x++) {
        if (this.TASKPAPERWATCHER === null) {
          this.TASKPAPERWATCHER = chokidar.watch(this.PREFERENCES.taskpaper[x].loc, {
            ignored: /[\/\\]\./,
            persistent: true,
            depth: 1,
            awaitWriteFinish: true,
            ignorepermissionErrors: true
          });
        } else {
          this.TASKPAPERWATCHER.add(this.PREFERENCES.taskpaper[x].loc);
        }
        this.TASKPAPERWATCHER.on('change', (path) => {
          that.callReadTodos();
        });
      }
    }
  },
  getTodosCallback: null,
  callReadTodos: function() {
    if (!this.SAVINGTODOS && this.getTodosCallback != null) {
      //
      // Tell the main window to reload the todos.
      //
      this.getTodosCallback();
    }
  },
  getStyleFile: function(name) {
    if (fs.existsSync(this.STYLESLOCATION)) {
      if (fs.existsSync(this.STYLESLOCATION + name + '.json')) {
        this.STYLE = JSON.parse(fs.readFileSync(this.STYLESLOCATION + name + '.json', 'utf8'));
      } else {
        console.log("Style doesn't exist:  " + name);
      }
    } else {
      fs.mkdirSync(this.STYLESLOCATION);
      fs.writeFileSync(this.STYLESLOCATION + 'default.json', JSON.stringify(this.STYLE), 'utf-8', 0o666, 'w+')
    }
    return (this.STYLE);
  },
  getStyleNames: function() {
    var result = [];
    if (fs.existsSync(this.STYLESLOCATION)) {
      result = fs.readdirSync(this.STYLESLOCATION).map(x => String(x).split('.')[0]);
    } else {
      fs.mkdirSync(this.STYLESLOCATION);
      fs.writeFileSync(this.STYLESLOCATION + 'default.json', JSON.stringify(this.STYLE), 'utf-8', 0o666, 'w+')
      result = ["default"];
    }
    globalThis.styleList = result;
    return (result);
  },
  getEditorThemes: function() {
    return (fs.readdirSync(this.SERVERLOCATION + "/scriptpad/editorThemes").map(x => String(x).split('.')[0]));
  },
  writeStyleFile: function(name) {
    if (fs.existsSync(this.STYLESLOCATION)) {
      fs.writeFileSync(this.STYLESLOCATION + name + '.json', JSON.stringify(this.STYLE), 'utf-8', 0o666, 'w+')
    } else {
      fs.mkdirSync(this.STYLESLOCATION);
      fs.writeFileSync(this.STYLESLOCATION + name + '.json', JSON.stringify(this.STYLE), 'utf-8', 0o666, 'w+')
    }
  },

  //
  // Function:         getRegExp
  //
  // Description:      This is for reading the user defined
  //                   regular expressions from the file and passing
  //                   them on.
  //
  getRegExp: function() {
    if (this.REGEXP === null) {
      //
      // Read the scripts file.
      //
      if (fs.existsSync(this.REGEXPFILELOC)) {
        this.REGEXP = JSON.parse(fs.readFileSync(this.REGEXPFILELOC, 'utf8'))
      } else {
        if (!fs.existsSync(this.NOTESDIR)) {
          //
          // Make the directory.
          //
          fs.mkdirSync(this.NOTESDIR)
        }
        this.REGEXP = []
        this.putRegExps(this.REGEXP)
      }
    }
    return (this.REGEXP)
  },

  //
  // Function:         putRegExps
  //
  // Description:      This is for saving the user defined
  //                   regular expressions.
  //
  // Input:
  //                    regexp       An array of Regular Expression objects.
  //
  putRegExps: function(regexp) {
    if ((regexp === null) || ((typeof regexp) === 'undefined')) {
      regexp = []
    }
    this.REGEXP = regexp

    fs.writeFileSync(this.REGEXPFILELOC, JSON.stringify(this.REGEXP), 'utf-8', 0o666, 'w+')
  },

  //
  // Function:         getScripts
  //
  // Description:      This is for getting the user defined
  //                   scripts from the file and passing them on.
  //
  getScripts: function() {
    if (this.SCRIPTS === null) {
      //
      // Read the scripts file.
      //
      if (fs.existsSync(this.SCRIPTSFILELOC)) {
        this.SCRIPTS = JSON.parse(fs.readFileSync(this.SCRIPTSFILELOC, 'utf8'))
      } else {
        if (!fs.existsSync(this.NOTESDIR)) {
          //
          // Make the directory.
          //
          fs.mkdirSync(this.NOTESDIR)
        }
        this.SCRIPTS = []
        this.putScripts(this.SCRIPTS)
      }
    }
    return (this.SCRIPTS)
  },

  getSystemScripts: function() {
    return (this.SYSTEMSCRIPTS)
  },

  getSystemRegExps: function() {
    return (this.SYSTEMREGEXPS)
  },
  getSystemTemplates: function() {
    return(this.SYSTEMTEMPLATES)
  },
  getUserTemplates: function() {
     if (this.TEMPLATES === null) {
      //
      // Read the scripts file.
      //
      if (fs.existsSync(this.USERTEMPLATESFILE)) {
        this.TEMPLATES = JSON.parse(fs.readFileSync(this.USERTEMPLATESFILE, 'utf8'))
      } else {
        if (!fs.existsSync(this.NOTESDIR)) {
          //
          // Make the directory.
          //
          fs.mkdirSync(this.NOTESDIR)
        }
        this.TEMPLATES = []
        this.saveUserTemplates(this.TEMPLATES)
      }
    }
    return (this.TEMPLATES)
  },
  saveUserTemplates: function(templates) {
     if ((templates === null) || ((typeof templates) === 'undefined')) {
      templates = []
    }
    this.TEMPLATES = templates

    fs.writeFileSync(this.USERTEMPLATESFILE, JSON.stringify(this.TEMPLATES), 'utf-8', 0o666, 'w+')
  },
  //
  // Function:         getJavaScriptScript
  //
  // Description:      This will returned the named script.
  //
  // Inputs:
  //                   script          The name of the script.
  //
  getJavaScriptScript: function(script) {
    var scriptObj = this.getScripts().find(value => value.name == script)
    if (scriptObj === undefined) {
      scriptObj = this.getSystemScripts().find(value => value.name == script)
    }
    return scriptObj.script
  },

  //
  // Function:         runJavaScriptScripts
  //
  // Description:      This will run some given text with a script.
  //
  // Inputs:
  //                   script          The script.
  //                   text            The text to process.
  //
  runJavaScriptScripts: function(script, text) {
    var originalText = text;
    var that = this;
    var SP = {
      text: text,
      moment: moment,
      mathjs: math,
      mathParser: math.parser(),
      that: that,
      Handlebars: Handlebars,
      ProcessMathSelection: function(txt) {
        var result = this.mathParser.evaluate(txt)
        return result
      },
      ProcessMathNotes: function(Note) {
        var result = ''
        this.mathParser.clear()
        let lines = Note.match(/^.*((\\r\\n|\\n|\\r)|$)/gm)
        let numLines = lines.length
        for (let i=0;i<lines.length;i++) {
          var line = lines[i];
          var lineResult = ''
          line = line.trim()
          if (line.indexOf('>') === 0) {
            line = line.substr(2)
            var inx = line.indexOf('|')
            if (inx !== -1) {
              line = line.substr(0, inx-1)
              line = line.trim()
            }
            lineResult = this.mathParser.evaluate(line)
            if ((typeof lineResult) === 'function') {
              lineResult = 'Definition'
            }
            var whiteSP = 32 - (line.length + 3);
            if(whiteSP < 1) {
              whiteSP = 1;
            }
            result += '> ' + line + this.insertCharacters(whiteSP, ' ') + ' | ' + lineResult
          } else {
            result += line
          }
          if (--numLines !== 0) result += '\n'
        }
        return result
      },
      runScript: function(script, text) {
        return that.runJavaScriptScripts(that.getJavaScriptScript(script), text)
      },
      returnNote: function(id) {
        var result = '';
        id = id - 1;
        if((id >= 0) && (id <= 9)) result = that.NOTES[id];
        return result;
      },
      insertCharacters: function(num, ichar) {
        var result = ''
        if (num < 0) return result
        for (var i = 0; i < num; i++) {
          result += ichar
        }
        return result
      }
    };

    //
    // Try to evaluate the expression.
    //
    try {
      var scriptFunction = new Function('SP', script + '; return SP;');
      SP = scriptFunction(SP);
    } catch (error) {
      console.log(error);
      SP.text = originalText;
    }
    //
    // Make sure we have a string and not an array or object.
    //
    if(typeof SP.text != 'String') {
      SP.text = SP.text.toString();
    }
    return (SP.text);
  },

  //
  // Function:         putScripts
  //
  // Description:      This is for saving the user defined scripts.
  //
  // Inputs:
  //                   scripts         An array of script objects.
  //
  putScripts: function(scripts) {
    if ((scripts === null) || ((typeof scripts) === 'undefined')) {
      scripts = []
    }
    this.SCRIPTS = scripts

    fs.writeFileSync(this.SCRIPTSFILELOC, JSON.stringify(this.SCRIPTS), 'utf-8', 0o666, 'w+')
  },

  //
  // Function:         getNote
  //
  // Description:      This get the specified note from the
  //                   global variable making sure that it was read
  //                   from disk as well.
  //
  // Inputs:
  //                   noteid      The id of the note to get.
  //
  getNote: function(noteid) {
    if((noteid >= 0)&&(noteid <=8)) {
      this.readNotesFile()
      return (this.NOTES[noteid])
    }
  },

  //
  // Function:         saveNote
  //
  // Description:      This saves the note to the harddrive.
  //
  // Inputs:
  //                   noteid        The id of the note to save
  //                   body          The body of the note.
  //
  saveNote: function(noteid, body) {
    if ((body === null) || (typeof body === 'undefined')) {
      body = ""
    }
    if((noteid >= 0)&&(noteid <=8)) {
      this.readNotesFile()
      this.NOTES[noteid] = body
      this.writeNotesFile()
    }
  },

  //
  // Function:    readPreferencesFile
  //
  // Description: This will read the preferences file into
  //              the global data structure.
  //
  readPreferencesFile: function() {
    //
    // Preferences haven't been loaded yet. Load them if the
    // file has been created or create the defaults otherwise.
    //
    if (fs.existsSync(this.PREFERENCESFILELOC)) {
      //
      // There are preferences already. Load them.
      //
      this.PREFERENCES = JSON.parse(fs.readFileSync(this.PREFERENCESFILELOC, 'utf8'))
    } else {
      //
      // Create the preferences file using the default preferences.
      //
      this.writePreferencesFile()
    }
    return(this.PREFERENCES)
  },

  //
  // Function:    writePreferencesFile
  //
  // Description: This will write the global preferences
  //              to it's file.
  //
  writePreferencesFile: function() {
    fs.writeFileSync(this.PREFERENCESFILELOC, JSON.stringify(this.PREFERENCES), 'utf-8', 0o666, 'w+')
  },

  //
  // Function:         writeNotesFile
  //
  // Description:      This actually writes the notes to the file.
  //
  writeNotesFile: function() {
    fs.writeFileSync(this.NOTESFILELOC, JSON.stringify(this.NOTES), 'utf-8', 0o666, 'w+')
  },

  //
  // Function:         readNotesFile
  //
  // Description:      This reads the notes file and gets all the notes.
  //
  readNotesFile: function() {
    if (this.NOTES === null) {
      if (fs.existsSync(this.NOTESFILELOC)) {
        this.NOTES = JSON.parse(fs.readFileSync(this.NOTESFILELOC, 'utf8'))
      } else {
        if (!fs.existsSync(this.NOTESDIR)) {
          //
          // Make the directory.
          //
          fs.mkdirSync(this.NOTESDIR)
        }
        this.NOTES = []
        this.NOTES[0] = ""
        this.NOTES[1] = ""
        this.NOTES[2] = ""
        this.NOTES[3] = ""
        this.NOTES[4] = ""
        this.NOTES[5] = ""
        this.NOTES[6] = ""
        this.NOTES[7] = ""
        this.NOTES[8] = ""
        this.writeNotesFile()
      }
    }
  },
  //
  // This is the installation for Alfred.
  //
  installAlfred: function() {
    let stdout = this.execSync('cd "' + this.SERVERLOCATION + '/WorkflowScripts"; /usr/bin/open ScriptPadWorkflow.alfredworkflow');
  },
  //
  // This is the installation for Keyboard Maestro.
  //
  installKeyboardMaestro: function() {
    let stdout = this.execSync('cd "' + this.SERVERLOCATION + '/WorkflowScripts"; /usr/bin/open ScriptPadMacros.kmlibrary');
  },
  //
  // This is the installation for Dropzone.
  //
  installDropzone: function() {
    let stdout = this.execSync('cd "' + this.SERVERLOCATION + '/WorkflowScripts"; /usr/bin/open ScriptPad.dzbundle');
    stdout += this.execSync('cd "' + this.SERVERLOCATION + '/WorkflowScripts"; /usr/bin/open "ScriptPad Run Script.dzbundle"');
  },
  //
  // This is the installation for PopClip.
  //
  installPopClip: function() {
    let stdout = this.execSync('cd "' + this.SERVERLOCATION + '/WorkflowScripts"; /usr/bin/open ScriptPad.popclipext');
  },
  //
  // This is the installation for LaunchBar.
  //
  installLaunchBar: function() {
    let stdout = this.execSync('cd "' + this.SERVERLOCATION + '/WorkflowScripts"; /usr/bin/open "ScriptPad - Set Note.lbaction"; /usr/bin/open "ScriptPad - Paste Note.lbaction"; /usr/bin/open "ScriptPad - Set BulletinBoard.lbaction";/usr/bin/open "ScriptPad - Append BulletinBoard.lbaction"; /usr/bin/open "ScriptPad - Run Script.lbaction"; /usr/bin/open "ScriptPad - Run Template.lbaction";');
  },

  //
  // This is for launching the help page.
  //
  showHelp: function() {
    var that = this;
    this.showURL('http://localhost:9978/docs', 'helpWin', (win) => {
      that.helpwin = win;
    })
  },
  helpWin: null,
  
  //
  // this function allows for the launching of an arbitrary website.
  //
  showURL: function(url, ID, callback) {
    this.nw.Window.open(url,{
      id: ID
    }, callback);
  },

  //
  // These routes are for integration with TeaCode.
  //
  //
  //
  TeaCodeExpand: function(text, ext) {
    //
    // Get the expander to query and escape the quotes.
    //
    var expander = text.replace(new RegExp("\"", "g"), "\\\"");

    //
    // Query TeaCode with osascript.
    //
    let stdout = this.execSync('/usr/bin/osascript -l JavaScript -e "Application(\'TeaCode\').expandAsJson(\'' + expander + '\', { \'extension\': \'' + ext + '\' })"');

    //
    // Return TeaCode's JSON return to the user.
    //
    return (JSON.parse(stdout.toString('utf8')))
  },
  quit: async function() {
    //
    // Close the main window ASAP.
    //
    globalThis.mainwin.hide();

    //
    // Quit all of the file watcherers.
    //
    if(this.NOTEPLANWATCHER != null) this.NOTEPLANWATCHER.close();
    if(this.TASKPAPERWATCHER != null) this.TASKPAPERWATCHER.close();

    //
    // Close Node-Red
    //
    if(this.REDSTARTED) {
      this.RED.stop();
    }

    //
    // Close the server.
    //
    this.server.close();

    //
    // Close the Bulletinboard.
    //
    try {
      const response = await axios.get('http://localhost:9697/api/quit');
    } catch (error) {
      console.error(error);
    }
    
    //
    // Close out the Module windows if any.
    //
    if(typeof globalThis.moduleWin !== 'undefined') {
      for(var i=0; i < globalThis.moduleWin.length;i++) {
        try {
          if(typeof globalThis.moduleWin[i] !== 'undefined') {
            globalThis.moduleWin[i].close();
          }
        } catch(error) {
          console.log(error);
        }
      }
    }
    
    //
    // Clear out all data. I want the application to get the most
    // recent information locally. Don't rely on cache information 
    // as it will change.
    //
    if(this.PREFERENCES.clearCache) {
      nw.App.clearCache();

      window.chrome.browsingData.remove({
        since: 0
      }, {
        appcache: true,
        cache: true,
        cookies: true,
        downloads: true,
        fileSystems: true,
        formData: true,
        history: true,
        indexedDB: true,
        localStorage: true,
        pluginData: true,
        passwords: true,
        serverBoundCertificates: true,
        serviceWorkers: true,
        webSQL: true
      });
    }

    //
    // Quit the application.
    //
    globalThis.mainwin.close(true);
    this.nw.App.quit();
  },
  setupHandlebarHelpers: function() {
    //
    // Get a reference to the this of the current object.
    //
    var that = this;

    //
    // Create the helpers functions for Handlebars.
    //
    this.Handlebars.registerHelper('env', function(name) {
      return process.env[name];
    });

    this.Handlebars.registerHelper('save', function(name, text) {
      that.Handlebars.registerHelper(name, function() {
        return text;
      });
      return text;
    });

    this.Handlebars.registerHelper('clipboard', function() {
      return that.nw.Clipboard.get().get('text');
    });

    this.Handlebars.registerHelper('date', function(dFormat) {
      return that.moment().format(dFormat);
    });

    this.Handlebars.registerHelper('cdate', function(cTime, dFormat) {
      return that.moment(cTime).format(dFormat);
    });

    this.Handlebars.registerHelper('last', function(weeks, dow, fmat) {
      return that.moment().add(-7 * weeks, 'd').day(dow).format(fmat);
    });

    this.Handlebars.registerHelper('next', function(weeks, dow, fmat) {
      return that.moment().add(7 * weeks, 'd').day(dow).format(fmat);
    });

    this.Handlebars.registerHelper('userfillin', function(ques, defA = "") {
      return that.getFeedback(ques, defA);
    });

    this.Handlebars.registerHelper('copyclip', function(name) {
      return that.getCopyClip(name);
    });
  },
  getFeedback: function( Question, Default ) {
    return this.getAnswer(Question, Default);
  },
  listTemplates: function() {
    var result = this.SYSTEMTEMPLATES.map(item => { return item.name; });
    result = result.concat(this.TEMPLATES.map(item => { return item.name; }));
    return result;
  },
  getTemplateByName: function(name) {
    var result = this.TEMPLATES.find(item => item.name === name);
    if(typeof result === 'undefined') {
      result = this.SYSTEMTEMPLATES.find(item => item.name === name);
    } else if (typeof result === 'undefined') {
      result = null;
    }
    return(result);
  },
  runTemplate: function(templateName, template, text) { 
    var result = '';
    try {
      //
      // Create various default targets for the templater. These have
      // to be created since they are various types of time/date stamps.
      //
      var data = [];
      data["cDateMDY"] = this.moment().format("MMMM DD, YYYY");
      data["cDateDMY"] = this.moment().format("DD MMMM YYYY");
      data["cDateDOWDMY"] = this.moment().format("dddd, DD MMMM YYYY");
      data["cDateDOWMDY"] = this.moment().format("dddd MMMM DD, YYYY");
      data["cDay"] = this.moment().format("DD");
      data["cMonth"] = this.moment().format("MMMM");
      data["cYear"] = this.moment().format("YYYY");
      data["cMonthShort"] = this.moment().format("MMM");
      data["cYearShort"] = this.moment().format("YY");
      data["cDOW"] = this.moment().format("dddd");
      data["cMDthYShort"] = this.moment().format("MMM Do YY");
      data["cMDthY"] = this.moment().format("MMMM Do YYYY");
      data["cHMSampm"] = this.moment().format("h:mm:ss a");
      data["cHMampm"] = this.moment().format("h:mm a");
      data["cHMS24"] = this.moment().format("H:mm:ss");
      data["cHM24"] = this.moment().format("H:mm");
      data["Templatename"] = templateName;
      data["text"] = text;

      //
      // Get the User's default data.
      //
      var defaultData = this.getTemplateByName('Defaults');
      if(defaultData !== null) {
        data = this.MergeRecursive(data, JSON.parse(defaultData.template));
      }

      //
      // Parse the Template
      //
      var tpTemplate = Handlebars.compile(template);

      //
      // Run the template with the data.
      //
      result = tpTemplate(data);
      
      //
      // Make sure we have a string and not an array or object.
      //
      if(typeof result != 'String') {
        result = result.toString();
      }

    } catch (error) {
        console.log("Handlebars Error: " + error);
        result = "There was an error.";
    }
    return(result);
  },
  //
  //  Function:        MergeRecursive
  //
  //  Description:     Recursively merge properties of two objects
  //
  //  Inputs:
  //                   obj1    The first object to merge
  //                   obj2    The second object to merge
  //
  MergeRecursive: function(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  },

  //
  //  Function:        MergeRenameRecursive
  //
  //  Description:     Recursively merge properties of two objects
  //
  //  Inputs:
  //                   obj1    The first object to merge
  //                   obj2    The second object to merge
  //                   tadd    A string to add to the title.
  //
  MergeRenameRecursive: function(obj1, obj2, tadd) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p + tadd] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p + tadd] = obj2[p];
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p + tadd] = obj2[p];
      }
    }
    return obj1;
  },
  //
  // The following functions are for getting information from the Alfred
  // workflow CopyClips. 
  //
  //
  getAlfredDir: function() {
    var result = '';
    const firstPick = os.homedir() + "/Library/Application Support/Alfred/Workflow Data";
    const secondPick = os.homedir() + "/Library/Application Support/Alfred 2/Workflow Data";
    const thirdPick = os.homedir() + "/Library/Application Support/Alfred 3/Workflow Data";
    if(this.fs.existsSync(firstPick)) {
      result = firstPick;
    } else if(this.fs.existsSync(secondPick)) {
      result = secondPick;
    } else if(this.fs.existsSync(thirdPick)) {
      result = thirdPick;
    }
    return(result);
  },
  copyClipFileBeg: "/com.customct.CopyClips/copyclips/copy-",
  getCopyClip: function(clipNum) {
    if(this.getAlfredDir !== '') {
      return this.fs.readFileSync(this.getAlfredDir() + this.copyClipFileBeg + clipNum + ".txt")
    } else {
      return 'Alfred CopyClip workflow not installed.'
    }
  },
  saveCopyClip: function(clipNum, clipText) {
    //
    // Save the clip to the clip number.
    //
    if(this.getAlfredDir !== '') {
      this.fs.writeFileSync(this.getAlfredDir() + this.copyClipFileBeg + clipNum + ".txt", clipText, 'utf8');
    }
  },
  getAnswer: function( Question, Default ) {
    return this.queryUserDialog('question', Question, Default);
  },
  queryUserDialog: function( dialog, ...options ) {
    var ans = '';
    var everything = '"' + dialog + '" "' + options.join('" "') + '"';
    ans = execSync('bin/queryUser ' + everything);
    return(ans);
  },
  getIP: function() {
    return ip.address();
  },
  //
  // Some Node-Red specific items.
  //
  REDSTARTED: false,    // Whether or not Node-Red has been started
  RED: null,            // Reference to the Node-Red object
  REDVARS: {},          // Node-Red Variables
  startRed: function(callback) {
    if((typeof this.RED !== 'undefined') && (this.RED !== null) && (!this.REDSTARTED)) {
      this.RED.start().then(() => {
        this.REDSTARTED = true;
        callback();
      });
    }
  },
  stopRed: function(callback) {
    if(this.REDSTARTED) {
      this.REDSTARTED = false;
      this.RED.stop();
      callback();
    }
  },
  initNodeRed: function(logger) {
    //
    // Get the location of the Red preferences.
    //
    this.NodeRedHome = this.HOME + "/.nodered-scriptpad/";

    //
    // Check for directory structure present and properly initialized.
    //
    if(!fs.existsSync(this.NodeRedHome)) {
      //
      // Create the Node-Red home.
      //
      fs.mkdirSync(this.NodeRedHome);
    }

    if(!fs.existsSync(this.NodeRedHome + "node_modules/")) {
      //
      // Create and populate the node modules directories and files.
      //
      fs.mkdirSync(this.NodeRedHome + "node_modules");

      //
      // Copy the modules for working with Node-Red and ScriptPad.
      //
      fsex.copy(this.SERVERLOCATION + "/nodered_modules",this.NodeRedHome + "node_modules");
    }

    //
    // Initialize the system.
    //
    this.RED = window.nodered;
    if((typeof this.RED !== 'undefined') && (this.RED !== null)) {
      // Create the settings object - see default settings.js file for other options
      var settings = {
        httpAdminRoot: "/red/admin",
        httpNodeRoot: "/red/api",
        userDir: this.NodeRedHome,
        nodesDir: this.NodeRedHome + 'nodes/',
        credentialSecret: this.PREFERENCES.RedSecret,
        flowFile: "scriptpad-nodered.json",
        editorTheme: {
          projects: {
            enabled: false
          }
        }, 
        logging: {
          // Console logging
          console: {
            level: "off",
            metrics: false,
            audit: false
          },
          // Custom logger
          myCustomLogger: {
            level: "info",
            metrics: false,
            audit: false,
            handler: function(settings) {
              // Called when the logger is initialised
              // Return the logging function
              return function(msg) {
                logger(msg);
              };
            }
          }
        },
        functionGlobalContext: {
          ScriptPad: this
        }    // enables global context
      };

      // Initialise the runtime with a server and settings
      this.RED.init(this.httpServer,settings);

      // Serve the editor UI from /red
      this.app.use(settings.httpAdminRoot,this.RED.httpAdmin);

      // Serve the http nodes UI from /api
      this.app.use(settings.httpNodeRoot,this.RED.httpNode);
    }
  },
  //
  // Set a Node-Red Variable
  //
  SetRedVar: function(name,val) {
    this.REDVARS[name] = val;

    //
    // Send it to anyone needing the information on 
    // Websockets.
    //
    if(typeof this.io !== 'undefined') {
      this.io.emit('varchanged', {
        variable: name,
        value: val
      });
      this.io.emit(name, val);
    }
  },
  //
  // Get a Node-Red Variable
  //
  GetRedVar: function(name) {
    var result = null;
    if(typeof this.REDVARS[name] !== 'undefined') {
      result = this.REDVARS[name];
    }
    return(result);
  },
  //
  // Get the array of Node-Red variables.
  //
  GetRedVarArray: function() {
    return(this.REDVARS);
  },
  //
  // This section is for working with the script environments
  //
  // scriptEnv {
  //    name    - Name of the environment
  //    envVar  - key,value array of environment variables
  //}
  //
  scriptEnv: null,
  ENVIRONMENTVARIABLESFILELOC: os.homedir() + '/.scriptpad/environments.json',
  createDefaultEnv: function() {
    
    var newEnv = {
      name: 'Default',
      envVar: process.env
    }
    return(newEnv);
  },
  getEnvNames: function() {
    if(this.scriptEnv === null) {
      this.scriptEnv = this.loadEnv();
    }
    return(this.scriptEnv.map((item) => item.name));
  },
  addEnv: function(env) {
    if(this.scriptEnv === null) {
      this.scriptEnv = this.loadEnv();
    }
    var newScriptEnv = this.scriptEnv.find(item => item.name === env.name);
    if(typeof newScriptEnv === 'undefined') {
      this.scriptEnv.push(env);
    } else {
      this.scriptEnv = this.scriptEnv.map(item => {
        if(item.name === env.name) item = env;
        return(item);
      });
    }
    this.saveEnv();
  },
  removeEnv: function(oldEnv) {
    if(this.scriptEnv === null) {
      this.scriptEnv = this.loadEnv();
    }
    this.scriptEnv = this.scriptEnv.filter(env => env.name !== oldEnv);
    this.saveEnv();
  },
  loadEnv: function() {
    if (fs.existsSync(this.ENVIRONMENTVARIABLESFILELOC)) {
      //
      // There are preferences already. Load them.
      //
      this.scriptEnv = JSON.parse(fs.readFileSync(this.ENVIRONMENTVARIABLESFILELOC, 'utf8'));
    } else {
      //
      // Create the preferences file using the default preferences.
      //
      this.scriptEnv = [];
      this.saveEnv();
    }
    return(this.scriptEnv)
  },
  saveEnv: function() {
    if(this.scriptEnv === null) {
      this.scriptEnv = this.loadEnv();
    }
    fs.writeFileSync(this.ENVIRONMENTVARIABLESFILELOC, JSON.stringify(this.scriptEnv));
  },
  getEnv: function(name) {
    //
    // See if it have a lowercase for default.
    //
    if(name.includes('default')) name = "Default";

    //
    // Make sure the environments are loaded.
    //
    if(this.scriptEnv === null) {
      this.scriptEnv = this.loadEnv();
    }

    //
    // If it doens't find the envionment, return an empty env.
    //
    var tmpEnv = this.scriptEnv.find((env) => env.name === name);
    if(typeof tmpEnv === 'undefined') tmpEnv = [];
    return(tmpEnv);
  },
  //
  // This section is for external script control.
  //
  // extScripts {
  //    name     - User given name for the script
  //    script   - File name of the script
  //    path     - directory of the script
  //    env      - name of the environment
  // }
  //
  extScripts: null,
  EXTSCRIPTSFILELOC:  os.homedir() + '/.scriptpad/extscripts.json',
  listExtScripts: function() {
    if(this.extScripts === null) {
      this.extScripts = this.loadExtScripts();
    }
    return(this.extScripts.map((es) => es.name));
  },
  addExtScript: function(newScript) {
    if(this.extScripts === null) {
      this.extScripts = this.loadExtScripts();
    }
    var extScript = this.extScripts.find(item => item.name === newScript.name);
    if(typeof extScript === 'undefined') {
      this.extScripts.push(newScript);
    } else {
      this.extScripts = this.extScripts.map(item => {
        if(item.name === newScript.name) item = newScript;
        return(item);
      });
    }
    this.saveExtScripts();
  },
  getExtScript: function(scriptName) {
    if(this.extScripts === null) {
      this.extScripts = this.loadExtScripts();
    }
    return this.extScripts.find((es) => es.name === scriptName);
  },
  saveExtScripts: function() {
    fs.writeFileSync(this.EXTSCRIPTSFILELOC, JSON.stringify(this.extScripts));
  },
  loadExtScripts: function() {
    if (fs.existsSync(this.EXTSCRIPTSFILELOC)) {
      //
      // There are preferences already. Load them.
      //
      this.extScripts = JSON.parse(fs.readFileSync(this.EXTSCRIPTSFILELOC, 'utf8'));
    } else {
      //
      // Create the preferences file using the default preferences.
      //
      this.extScripts = [];
      this.saveExtScripts();
    }
    return(this.extScripts)
  },
  removeExtScript: function(info) {
    if(this.extScripts === null) {
      this.extScripts = this.loadExtScripts();
    }
    this.extScripts = this.extScripts.filter(item => { return item.name !== info; });
    this.saveExtScripts();
  },
  runExtScript: function(extScript, info) {
    //
    // info.script    - Name of the script - a string
    // info.env       - Environment name to run the script - 'default' : Environment defined by the script.
    // info.envVar    - Additional environment variables - key, value pairs
    // info.commandLine - Command line for the script - a string
    //
    // extScript.name     - File name of the script
    // extScript.script   - User name for the script
    // extScript.path     - directory of the script
    // extScript.env      - name of the environment
    //
    var result = '';
    var env = {};

    if(this.extScripts === null) {
      this.extScripts = this.loadExtScripts();
    }

    //
    // Get the environment.
    //
    if(info.env !== '') {
      env = this.getEnv(info.env);
      if(env !== 'undefined') env = env.envVar;
    }else if(extScript.env !== '') {
      env = this.getEnv(extScript.env);
      if(env !== 'undefined') env = env.envVar;
    }
   
    //
    // Add any new environment variables.
    //
    env = {...env, ...info.envVar};
    try {
      if((info.commandLine !== null)&&(typeof info.commandLine !== 'undefined')) {
        result = childProcess.execFileSync(extScript.path + "/" + extScript.script, info.commandLine.split(' '), {
          env: env,
          cwd: extScript.path,
          shell: '/bin/sh',
          encoding: 'utf8'
        });
      } else {
        result = childProcess.execFileSync(extScript.path + "/" + extScript.script, [], {
          env: env,
          cwd: extScript.path,
          shell: '/bin/sh',
          encoding: 'utf8'
        });
      }
      if(typeof result === 'object') result = result.toString();
    } catch(e) {
      result = "Error: " + e.message;
    }
    return(result);
  }
}

export default ScriptPadInternal;
