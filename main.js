var buttons = document.getElementsByName('note');
      for (var i = 0, len = buttons.length; i < len; i++) {
        buttons[i].onclick = function (){
          addNote(this, 0);
        }
      }
      
      var buttons = document.getElementsByName('note1');
      for (var i = 0, len = buttons.length; i < len; i++) {
        buttons[i].onclick = function (){
          addNote(this, 1);
        }
      }
      
      var first = [true, true];
      var firstEvents = [null, null];
      var restEvents = [[], []];
      var bpm = 60;
      var state = false;
      var tickNotes = ["E4", "G4"];
      var otherNotes = ["E3", "G3"];
      var tick = [true, true];
      var stype = [2, 2];
      var optionsShown = [false, false];
      var silence = [false, false];
      
      var soundType = [[], []];
      for (var i = 0; i < 2; i++) {
        soundType[i].push(new Tone.SimpleSynth({
            "oscillator": {
              "type" :"square"
            },
            "envelope" : {
              "attack" : 0.01,
              "decay" : 0.2,
              "sustain" : 0.2,
              "release" : 0.2,
            }
        }).toMaster());
        soundType[i].push(new Tone.DrumSynth().toMaster());
        soundType[i].push(new Tone.PolySynth(6, Tone.SimplerSynth, {
          "oscillator": {
              "partials" : [0, 2, 3, 4],
          }
        }).toMaster());    
      }
      
      var schedules = [];
      schedules.push(new ContinuedScheduler());
      schedules.push(new ContinuedScheduler());
      
      function addNote(button, id) {
        var value = button.id;
        var c = document.getElementById("content" + id.toString());
        var s;
        var note;
        var t;
        if (first[id] && tick[id]) {
          note = tickNotes[id];
        } else {
          note = otherNotes[id];
        }
        t = schedules[id];
        s = soundType[id][stype[id]];
        var func;
        var len;
        switch(value) {
          case '1':
            c.innerHTML = c.innerHTML + "w";
            func = function(time) {s.triggerAttackRelease(note, "1n")};
            len = "1n";
            break;
          case '2':
            c.innerHTML = c.innerHTML + "h";
            func = function(time) {s.triggerAttackRelease(note, "2n")};
            len = "2n";
            break;
          case '3':
            c.innerHTML = c.innerHTML + "q";
            func = function(time) {s.triggerAttackRelease(note, "4n")};
            len = "4n";
            break;
          case '4':
            c.innerHTML = c.innerHTML + "e";
            func = function(time) {s.triggerAttackRelease(note, "8n")};
            len = "8n";
            break;
          case '5':
            c.innerHTML = c.innerHTML + "s";
            func = function(time) {s.triggerAttackRelease(note, "16t")};
            len = "16t";
            break;
          case '6':
            c.innerHTML = c.innerHTML + "j";
            func = function(time) {s.triggerAttackRelease(note, "3n");};
            len = "3n";
            break;
          case '7':
            c.innerHTML = c.innerHTML + "i";
            func = function(time) {s.triggerAttackRelease(note, "6n");};
            len = "6n";
            break;
          case '8':
            c.innerHTML = c.innerHTML + "W";
            func = function(time) {};
            len = "1n";
            if (first[id])
                silence[id] = true;
            break;
          case '9':
            c.innerHTML = c.innerHTML + "H";
            func = function(time) {};
            len = "2n";
            if (first[id])
                silence[id] = true;
            break;
          case '10':
            c.innerHTML = c.innerHTML + "Q";
            func = function(time) {};
            len = "4n";
            if (first[id])
                silence[id] = true;
            break;
          case '11':
            c.innerHTML = c.innerHTML + "E";
            func = function(time) {};
            len = "8n";
            if (first[id])
                silence[id] = true;
            break;
          case '12':
            c.innerHTML = c.innerHTML + "S";
            func = function(time) {};
            len = "16n";
            if (first[id])
                silence[id] = true;
            break;
          case '13':
            c.innerHTML = c.innerHTML + "J";
            func = function(time) {};
            len = "3n";
            if (first[id])
                silence[id] = true;
            break;
          case '14':
            c.innerHTML = c.innerHTML + "I";
            func = function(time) {};
            len = "6n";
            if (first[id])
                silence[id] = true;
            break;
        }
        var e = t.schedule(func, len);
        if (first[id]) {
          first[id] = false;
          firstEvents[id] = [e, len];
        } else {
          restEvents[id].push([e, len]);
        }
      }

      schedules[0].bpm.value = bpm;
      schedules[1].bpm.value = bpm;
      
      function setBpm() {
        bpm = document.getElementById("bpm").value;
        schedules[0].bpm.value = bpm;
        schedules[1].bpm.value = bpm;
      }
      
      function changeState() {
        state = !state;
        if (state) {
          schedules[0].start();
          schedules[1].start();
          document.getElementById("start").innerHTML = "Stop";
        } else {
          schedules[0].stop();
          schedules[1].stop();
          document.getElementById("start").innerHTML = "Start";
          notesIt = 0;
        }
      }
      
      function deleteAll() {
        schedules[0].stop();
        schedules[1].stop();
        state = false;
        schedules[0].clearAll();
        schedules[1].clearAll();
        first = [true, true];
        silence = [false, false];
        document.getElementById("start").innerHTML = "Start";
        document.getElementById("content0").innerHTML = "";
        document.getElementById("content1").innerHTML = "";
        restEvents = [[], []];
      }
      
      function addVoice() {
        document.getElementById("addVoiceB").style = "display: none";
        document.getElementById("secondVoiceDiv").style = "";
      }
      
      function showOptions(id) {
        if(optionsShown[id]) {
            optionsShown[id] = false;
            document.getElementById("Options" + id.toString()).style = "display: none";
        } else {
            document.getElementById("Options" + id.toString()).style = "";
            optionsShown[id] = true;
        }
      }
      
      function removeLast(id) {
        var inner = document.getElementById("content" + id.toString()).innerHTML;
        var note = inner.slice(-1);
        inner = inner.slice(0, -1);
        if (inner.trim() === "") {
          first[id] = true;
          silence[id] = false;
        }
        schedules[id].clear();
        document.getElementById("content" + id.toString()).innerHTML = inner;
      }
      
      function changeTick(id) {
        tick[id] = !tick[id];
        changeFirstEvent(id);
      }
      
      function changeFirstEvent(id) {
        var s;
        s = soundType[id][stype[id]];
        var n;
        if (tick[id]) {
          n = tickNotes[id];
        } else {
          n = otherNotes[id];
        }
        if (firstEvents[id] != null && !silence[id]) {
          firstEvents[id][0].callback = function(time) {s.triggerAttackRelease(n, firstEvents[id][1]);};
        }
      }
      
      function changeRestEvent(id) {
        var s;
        s = soundType[id][stype[id]];
        var n = otherNotes[id];
        for (var i = 0; i < restEvents[id].length; i++) {
          var e = restEvents[id][i];
          e[0].callback = function(time) {s.triggerAttackRelease(n, e[1]);};
        }
      }
      
      function changeOtherNote(id) {
        var note = document.getElementById("otherTickNote" + id.toString()).value;
        var r = /^[a-gA-G]\d$/;
        if (r.test(note)) {
          otherNotes[id] = note;
          changeRestEvent(id);
          changeFirstEvent(id);
        }
      }
      
      function changeTickNote(id) {
        var note = document.getElementById("firstTickNote" + id.toString()).value;
        var r = /^[a-gA-G]\d$/;
        if (r.test(note)) {
          tickNotes[id] = note;
          changeFirstEvent(id);
        }
      }
      
      function changeSound(id) {
          var sound = document.getElementById("soundType" + id.toString());
          var pos = sound.options[sound.selectedIndex].value;
          stype[id] = parseInt(pos);
          changeFirstEvent(id);
          changeRestEvent(id);
      }