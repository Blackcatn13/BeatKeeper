function ContinuedScheduler() {
    
    this._processTick = function(tickTime) {
        if (this._clock.ticks === this._loopEnd) {
            this._clock.ticks = this._loopStart;
        }
        
        var ticks = this._clock.ticks;
        this._continuedEvents.forEachOverlap(ticks, function(event) {
           if ((ticks - event.time) % (event.duration + 1) == 0) {
               event.callback(tickTime);
           }
        });
    };
    
    this.schedule = function(callback, duration) {
        var time = 0;
        if (this._lastEvent != null)
            time = this._lastEvent.time + this._lastEvent.duration + 1;
        Tone.Transport.bpm = this.bpm;
        var event = {
            "time" : time,
            "duration" : Tone.Transport.toTicks(duration) - 1,
            "callback" : callback
        };
        this._lastEvent = event;
        this._continuedEvents.addEvent(event);
        this._loopEnd = event.time + event.duration;
        return event;
    };
    
    this.clear = function() {
        if (this._lastEvent != null) {
            var lastItem = this._continuedEvents.getEvent(this._loopEnd - this._lastEvent.duration - 1);
            this._continuedEvents.removeEvent(this._lastEvent);
            if (lastItem != null) {
                this._loopEnd = lastItem.time + lastItem.duration;
                this._lastEvent = lastItem;
            } else {
                this._lastEvent = null;
            }
        }
    };
    
    this.clearAll = function() {
        this._lastEvent = null;
        this._continuedEvents.dispose();
    };
    
    this.start = function() {
        var time = Tone.Transport.toSeconds(undefined);
        this._clock.start(time, 0);
        return this;
    };
    
    this.stop = function() {
        var time = Tone.Transport.toSeconds(undefined);
        this._clock.stop(time);
        return this;
    };
    
    this._fromUnits = function(bpm){
		return 1 / (60 / bpm / this._ppq);
	};
	
	this._toUnits = function(freq){
		return (freq / this._ppq) * 60;
	};
    
    this._loopEnd = 0;
    this._loopStart = 0;
    this._clock = new Tone.Clock({"callback" : this._processTick.bind(this),
        "frequency" : 0,
    });
    this._ppq = "48";
    this.bpm = this._clock.frequency;
    this.bpm._toUnits = this._toUnits.bind(this);
    this.bpm._fromUnits = this._fromUnits.bind(this);
    this.bpm.units = Tone.Type.BPM;
    this.bpm.value = 120;
    this._timeSignature = "4";
    this._lastEvent = null;
    this._continuedEvents = new Tone.IntervalTimeline();
}
