const bodyParser = window.bodyparser;

module.exports = (router, ScriptPad, setAPIText) => {
  //
  // Here, we need to setup the middleware for the router. The first
  // two are for parsing the body of a request. The third & fourth one is a 
  // security checker. We are going to allow non-API calls only from our
  // system, while API calls are limited to our sub-domain.
  //
  router.use('*', (req, res, next) => {
    //
    // We need to do some security checking on all the API calls.
    //
    var okay = true
    var requesterIP = req.ip.split('.')
    var localIP = req.connection.localAddress.split('.')
    if ((requesterIP[0] === localIP[0]) && (requesterIP[1] === localIP[1]) && (requesterIP[2] === localIP[2]) && (requesterIP[0] === localIP[0])) {
      //
      // Okay, the request is within our sub-domain. You can allow it.
      //
      okay = true
    } else {
      okay = false
    }
    //
    // If okay is true, proceed. Otherwise, just drop out.
    //
    if (okay) {
      next()
    }
  })
  router.use(bodyParser.json()) // for parsing application/json
  router.use(bodyParser.urlencoded({
    extended: true
  })) // for parsing application/x-www-form-urlencoded

  //
  // This is an external application request for changing a note. The note
  // can be either replaced or appended to depending on the last flag (a|w).
  //
  router.route('/note/:noteID(\\d+)/:append(a|w)').get((req, res, next) => {
    res.json({
      note: ScriptPad.getNote(req.params.noteID - 1)
    })
  }).put((req, res, next) => {
    var note = ''
    if (req.params.append === 'a') {
      note = ScriptPad.getNote(req.params.noteID - 1)
    }
    note += req.body.note
    setAPIText(req.params.noteID - 1, note)

    //
    // Tell the person that sent it that we got it okay.
    //
    res.send("okay")
  })

  //
  // A request for environments.
  //
  router.route('/scripts/env/list').get((req, res, next) => {
    res.json(ScriptPad.getEnvNames());
  })

  router.route('/scripts/env/:env').get((req, res, next) => {
    res.json(ScriptPad.getEnv(req.params.env));
  }).put((req, res, next) => {
    ScriptPad.addEnv(req.body);
    res.json({
      text: 'okay'
    });
  }).delete((req, res, next) => {
    ScriptPad.removeEnv(req.params.env);
    res.json({
      text: 'okay'
    });
  });

  //
  // Outside application requesting names of scripts to use.
  //
  router.route('/scripts/list').get((req, res, next) => {
    res.json(ScriptPad.getScripts().map(value => value.name).concat(ScriptPad.getSystemScripts().map(value => value.name)).concat(ScriptPad.listExtScripts()));
  })

  router.route('/scripts/ext/list').get((req, res, next) => {
    var list = ScriptPad.listExtScripts();
    res.json(list);
  })

  router.route('/scripts/ext/:script').get((req, res, next) => {
    var script = ScriptPad.getExtScript(req.params.script);
    console.log(script);
    res.json(script);
  }).put((req, res, next) => {
    ScriptPad.addExtScript(req.body);
    res.json({
      text: "okay"
    })
  }).delete((req, res, next) => {
    ScriptPad.removeExtScript(req.params.script);
    res.json({
      text: "okay"
    })
  });

  //
  // Outside application asking to process text with a script.
  //
  router.route('/script/run').put((req, res, next) => {
    var scriptArray = ScriptPad.getScripts();
    var script = null;
    var scriptIndex = scriptArray.find((ele) => { return ele.name === req.body.script})
    if(typeof scriptIndex !== 'undefined') {
      script = scriptIndex.script;
      res.json({
        text: ScriptPad.runJavaScriptScripts(script, req.body.text)
      });
    } else {
      scriptIndex = ScriptPad.getExtScript(req.body.script);
      if(typeof scriptIndex !== 'undefined') {
        //
        // It's an external script.
        //
        res.json({
          text: ScriptPad.runExtScript(scriptIndex,req.body)
        }) 
      } else {
        //
        // Find it in the built in scripts.
        //
        scriptArray = ScriptPad.getSystemScripts();
        scriptIndex = scriptArray.find((ele) => { return ele.name === req.body.script})
        if(typeof scriptIndex !== 'undefined') {
          script = scriptIndex.script;
        } else {
          script = {script: "SP.text = 'Error: Not a Script.';"}
        }
        res.json({
          text: ScriptPad.runJavaScriptScripts(script, req.body.text)
        })
      }
    }
  })

  //
  // These routes are for the template expansion.
  //
  router.route('/template/list').get((req, res, next) => {
    res.json({
      templates: ScriptPad.listTemplates().filter(item => { 
        var result = true;
        if(item === 'Defaults') {
          result = false;
        }
        return result;
      })
    });
  })

  router.route('/template/run').put((req, res, next) => {
    var template = ScriptPad.getTemplateByName(req.body.template);
    if(template === null) {
      res.json({
        text: 'Not Defined.'
      })
    } else {
      res.json({
        text: ScriptPad.runTemplate(template.name, template.template, req.body.text)
      });
    }
  });

  router.route('/nodered/var/:varname').put((req, res, next) => {
    ScriptPad.SetRedVar(req.params.varname,req.body.text);
    res.json({
      text: 'okay'
    });
  }).get((req, res, next) => {
    res.json({
      text: ScriptPad.GetRedVar(req.params.varname)
    });
  });

  router.route('/getip').get((req, res, next) => {
    //
    // Return the local IP address.
    //
    res.json({
      ip: ScriptPad.getIP()
    });
  });

  router.route('/scriptbar/config').get((req, res, next) => {
    if(globalThis.fs.existsSync(ScriptPad.SCRIPTBARPREFERENCES)) {
      res.json({
        config: JSON.parse(globalThis.fs.readFileSync(ScriptPad.SCRIPTBARPREFERENCES).toString())
      });
    } else {
      res.json({
        config: []
      })
    }
  }).put((req, res, next) => {
    globalThis.fs.writeFileSync(ScriptPad.SCRIPTBARPREFERENCES, JSON.stringify(req.body.config));
    res.json({
      text: 'okay'
    })
  });

  router.route('/web/launch').get((req, res, next) =>{
    res.json({
      text: 'okay'
    })
  }).put((req, res, next) => {
    ScriptPad.showURL(req.body.url, req.body.url, (win) => {
    });
    res.json({
      text: 'okay'
    })
  });
}
