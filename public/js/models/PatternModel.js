/** @constructor */
MusicXMLAnalyzer.PatternModel = function(){

	var that = {},
	noteElements = [],
	noteElements4VexFlow = [],

	curMode = 2,
	curName = "c",
	curAccidential = "none",
	curDuration = "quarter",
	curRythSpec = "none",
	curOctave = "4",
	VEXFLOW_REST_SIGN = "r",
	first = true,

	tripletCurrentAmount = 0,
	tripletEndPositions = [],
	tupletArray = [],
	beamArray = [],

	tripletEnterMode = false;
	noteElementAccidential = 0,
	isDot = false,
	beamVal = false,

	/**
	 * Init method of PatternModel
	 */
	init = function() {

	},

	/**
	 * Calls method to set the current Mode active
	 *
	 * @param {number}    mode    the current mode as number 0 (sound sequence), number 1 (rhythm) and number 2 (melody)
	 *
	 */
	setCurrentMode = function(mode) {
		if (curMode != mode) {
			emptyNoteArrays();
			$(that).trigger('clearCanvas');
		}

		curMode = mode;

		switch(curMode) {
			case 0:
				setDefaultValsForSoundSequenceMode();
				break;
			case 1:
				setDefaultValsForRhythmMode();
				break;
			case 2:
				setDefaultValsForMelodyMode();
				break;
		}
		//update view
		$(that).trigger('changeViewToCurrentMode', curMode);

	},

	/**
	 * This method empties the notes arrays and sets the val first to true.
	 */
	emptyNoteArrays = function() {
		noteElements = [];
		noteElements4VexFlow = [];
		first = true;
	}

	/**
	 * Returns the current mode
	 *
	 * @return {number}    The current mode
	 *
	 */
	getCurrentMode = function() {
		return curMode;
	},

	/**
	 * Sets the current note name
	 *
	 * @param {string}    noteName    the current note name
	 *
	 */
	setCurrentNoteName = function(noteName) {
		if(getCurrentMode() === 1 && noteName !== 'break'){

			curOctave = 4;
			curName = 'b';
		}else{

			curName = noteName;
		}
	},

	/**
	 * Returns the current note name
	 *
	 * @return {string}    The current note name
	 *
	 */
	getCurrentNoteName = function() {
		return curName;
	},

	/**
	 * Sets the current accidential
	 *
	 * @param {string}    accidential    the current accidential
	 *
	 */
	setCurrentAccidential = function(accidential) {
		curAccidential = accidential;
	},

	/**
	 * Returns the current accidential
	 *
	 * @return {string}    The current accidential
	 *
	 */
	getCurrentAccidential = function() {
		return curAccidential;
	},

	/**
	 * Sets the current note duration
	 *
	 * @param {string}    noteDuration    the current note duration
	 *
	 */
	setCurrentNoteDuration = function(noteDuration) {
		curDuration = noteDuration;
	},

	/**
	 * Returns the current note duration
	 *
	 * @return {string}    The current note duration
	 *
	 */
	getCurrentNoteDuration = function() {
		return curDuration;
	},

	/**
	 * Sets the current rhythmic special
	 *
	 * @param {string}    rythSpec    the current rhythmic special
	 *
	 */
	setCurrentNoteRythSpecial = function(rythSpec) {
		curRythSpec = rythSpec;
	},

	/**
	 * Returns the current rhythmic special which can be a dot or triplet
	 *
	 * @return {string}    The current rhythmic special
	 *
	 */
	getCurrentNoteRythSpecial = function() {
		return curRythSpec;
	},

	/**
	 * Sets the current octave
	 *
	 * @param {string}    octave    the current octave
	 *
	 */
	setCurrentOctave = function(octave) {
		curOctave = octave;
	},

	/**
	 * Returns the current octave
	 *
	 * @return {string}    The current octave
	 *
	 */
	getCurrentOctave = function() {
		return curOctave;
	},

	/**
	 * This method sets vals for accidentials, dots and beams for noteElements-Array
	 *
	 */
	setValuesForNoteElement = function() {

		//accidential
		if (curAccidential == "#") {
			noteElementAccidential = 1;
		} else if (curAccidential == "b") {
			noteElementAccidential = -1;
		} else {
			noteElementAccidential = 0;
		}

		//dot
		if(curRythSpec == "dotted") {
			isDot = true;
		} else {
			isDot = false;
		}

		//beam
		if(curRythSpec == "triplet") {
				tripletCurrentAmount++;
		}

		//triplet
		switch(tripletCurrentAmount) {
		    case 1:
		        beamVal = "begin";
		        break;
	        case 2:
		        beamVal = "continue";
		        break;
		    case 3:
		        beamVal = "end";
		        break;
		    default:
		        beamVal = false;
		}
	},

	/**
	 * This method adds notes and breaks to the noteElements Array and the noteElements4VexFlow Array
	 *
	 */
	addNoteElement = function() {

		setValuesForNoteElement();

		if (curMode == 2) {
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push(
					{
					type: curMode,
						notes:
						[
							{
								type: "note",
								pitch: {
									step: curName.toUpperCase(),
									alter: noteElementAccidential,
									type: curDuration,
									octave: curOctave,
									dot: isDot,
									beam: beamVal
								}
							}
						]
					});
				} else {
					//break
					noteElements.push(
					{
						type: curMode,
						notes:
						[
							{
							type: "rest",
							dot: isDot,
							duration: curDuration
							}
						]
					});
				}
			} else {
				if (curName != "break") {
					noteElements[0].notes.push(
					{
								type: "note",
								pitch: {
									step: curName.toUpperCase(),
									alter: noteElementAccidential,
									type: curDuration,
									octave: curOctave,
									dot: isDot,
									beam: beamVal
								}
					});
				} else {
					//break
					noteElements[0].notes.push(
					{
						type: "rest",
						dot: isDot,
						duration: curDuration
					});
				}
			}
		} else if (curMode == 1) {
		// rhythm mode
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push(
					{
					type: curMode,
						notes:
						[
							{
								type: "note",
								pitch: {
									type: curDuration,
									dot: isDot,
									beam: beamVal
								}
							}
						]
					});
				} else {
					//break
					noteElements.push(
					{
						type: curMode,
						notes:
						[
							{
								type: "rest",
								dot: isDot,
								duration: curDuration
							}
						]
					});
				}
			} else {
				if (curName != "break") {
					noteElements[0].notes.push(
					{

						type: "note",
						pitch: {
							type: curDuration,
							dot: isDot,
							beam: beamVal
						}

					});
				} else {
					//break
					noteElements[0].notes.push(
					{
						type: "rest",
						dot: isDot,
						duration: curDuration
					});
				}
			}
		} else if (curMode == 0) {
			if(first){
				first = false;
				if (curName != "break") {
					noteElements.push(
					{
					type: curMode,
						notes:
						[
							{
								type: "note",
								pitch: {
									step: curName.toUpperCase(),
									alter: noteElementAccidential,
									octave: curOctave
								}
							}
						]
					});
				}
			} else {
				if (curName != "break") {
					noteElements[0].notes.push(
					{
						type: "note",
						pitch: {
							step: curName.toUpperCase(),
							alter: noteElementAccidential,
							octave: curOctave
						}
					});
				}
			}
		}

		//check if break or normal note or note with accidential
		//then adapt values for vexflow an put them into an array
		var note;
		if(getCurrentMode() === 1 && curName !== 'break'){
			curName = 'b';
		}
		var keyContent = getKeyContent4Vexflow(curName);
		var durationContent = getDuration4Vexflow(curDuration);

		//check if break or normal note or note with accidential
		//then adapt values for vexflow an put them into an array
		if (curName == "break") {
			note = new Vex.Flow.StaveNote({ keys: ["b/4"],
	    						duration: durationContent + VEXFLOW_REST_SIGN,
	    						auto_stem: true });
		} else {
			var keys = keyContent + "/" + curOctave;
			if (getCurrentMode() == 1) {
				if (durationContent === "w" || durationContent === "h" || durationContent === "wd" || durationContent === "hd") {
					keys += '/d0';
				} else {
					keys += '/d2';
				}
			}
			note = new Vex.Flow.StaveNote({ keys: [keys],
	    						duration: durationContent,
	    						auto_stem: true });
		}

		if (curAccidential == "#" || curAccidential == "b") {
			note.addAccidental(0, new Vex.Flow.Accidental(curAccidential));
		}

		if (curRythSpec == "dotted") {
			note.addDotToAll();
		}

		noteElements4VexFlow.push(note);

		//check if triplet
		if (curRythSpec == "triplet") {
				if (tripletCurrentAmount == 3) {
					$(that).trigger('endTripletEnterMode');
					tripletEnterMode = false;
					tripletCurrentAmount = 0;
					//store all end positions of the triplets
					tripletEndPositions.push(noteElements4VexFlow.length);
					//create tuplet and beam and push it into corresponding array
					var tuplet = new Vex.Flow.Tuplet(noteElements4VexFlow.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
					var beam = new Vex.Flow.Tuplet(noteElements4VexFlow.slice(noteElements4VexFlow.length-3, noteElements4VexFlow.length))
					tupletArray.push(tuplet);
					beamArray.push(beam);
				} else if (tripletCurrentAmount == 1) {
					 tripletEnterMode = true;
					 $(that).trigger('startTripletEnterMode');
				}
		}

		if(noteElements.length == 0) {
			first = true;
			noteElements = [];
		}

		$(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);

	},

	/**
	 * Returns the length of the noteElements Array
	 *
	 * @return {number}    length of noteElements Array
	 */
	getPatternLength = function(){
		if(noteElements.length > 0){
			return noteElements[0].notes.length;
		} else {
			return 0;
		}
	}

	/**
	 * Sets the default values when you change to sound sequence mode
	 */
	setDefaultValsForSoundSequenceMode = function() {
		curName = "c";
		curOctave = "4";
		curAccidential = "none";

		tripletCurrentAmount = 0;
		tripletEndPositions = [],
		tupletArray = [],
		beamArray = [],
		beamVal = false;
		isDot = false;

		$(that).trigger('changeSelectedNoteName', curName);
		$(that).trigger('changeSelectedOctave', curOctave);
		$(that).trigger('changeSelectedAccidential', curAccidential);
	},

	/**
	 * Sets the default values when you change to rhythm mode
	 */
	setDefaultValsForRhythmMode = function() {
		curDuration = "quarter";
		curRythSpec = "none";
		curOctave = "5";

		tripletCurrentAmount = 0;
		tripletEndPositions = [],
		tupletArray = [],
		beamArray = [],
		beamVal = false;
		isDot = false;

		$(that).trigger('changeSelectedDuration', curDuration);
		$(that).trigger('changeSelectedSpecRyth', curRythSpec);
	},

	/**
	 * Sets the default values when you change to melody mode
	 */
	setDefaultValsForMelodyMode = function() {
		curMode = 2;
		curName = "c";
		curOctave = "4";
		curAccidential = "none";
		curDuration = "quarter";
		curRythSpec = "none";

		tripletCurrentAmount = 0;
		tripletEndPositions = [],
		tupletArray = [],
		beamArray = [],
		beamVal = false;
		isDot = false;

		$(that).trigger('changeSelectedNoteName', curName);
		$(that).trigger('changeSelectedOctave', curOctave);
		$(that).trigger('changeSelectedAccidential', curAccidential);
		$(that).trigger('changeSelectedDuration', curDuration);
		$(that).trigger('changeSelectedSpecRyth', curRythSpec);
	},

	/**
	 * Returns an Array with triplet end positions
	 *
	 * @return {Array.<number>}    Array with trilet end positions
	 */
	getTripletEndPositions = function() {
		return tripletEndPositions;
	},

	/**
	 * Returns an Array with tuplet end positions
	 *
	 * @return {Array.<number>}    Array with tuplet end positions
	 */
	getTupletArray = function() {
		return tupletArray;
	},

	/**
	 * Returns an Array with beam end positions
	 *
	 * @return {Array.<number>}    Array with beam end positions
	 */
	getBeamArray = function() {
		return beamArray;
	},

	/**
	 * Returns the content of a vexflow key
	 *
	 * @return {string}    content of vexflow key
	 */
	getKeyContent4Vexflow = function(noteName) {
		var keyContent = noteName;
		switch (curAccidential) {
			case "#":
				keyContent += "#";
				break;
			case "b":
				keyContent += "b";
				break;
			default:
				//...
		}
		return keyContent;
	},

	/**
	 * Returns the duration label which is used by vexflow
	 *
	 * @return {string}    duration for vexflow
	 */
	getDuration4Vexflow = function(duration) {
		var duration4Vexflow = null;

			if ( duration == "whole") {
				duration4Vexflow = "w";
			} else if ( duration == "half") {
				duration4Vexflow = "h";
			} else if ( duration == "quarter") {
				duration4Vexflow = "q";
			} else if ( duration == "eighth") {
				duration4Vexflow = "8";
			} else if ( duration == "16th") {
				duration4Vexflow = "16";
			} else if ( duration == "32nd") {
				duration4Vexflow = "32";
			} else if ( duration == "64th") {
				duration4Vexflow = "64";
			}

			if (curRythSpec == "dotted") {
				duration4Vexflow += "d";
			}

		return duration4Vexflow;
	},

	/**
	 * This method gets called when your click on the canvas to add a note element. The paramter note looks like "c/4". It updates the model values curName and curOctave and calls addNoteElement.
	 *
	 * @param {string}    note name in vexflow style like "c/4"
	 *
	 */
	addNoteElementByCanvasClick = function(note) {
		//split string at "/" to get noteName and ovtave
		//and saves it into array noteContainer
		var noteContainer = note.split("/");

		//current vals are being updated after note adding with click
		curName = noteContainer[0];
		curOctave = noteContainer[1];

		// updates selected btns for note name and view in pattern view
		$(that).trigger('changeSelectedNoteName', [curName]);
		$(that).trigger('changeSelectedOctave', [curOctave]);

		addNoteElement();
	},

	/**
	 * Removes last added note element from noteElementsArray and vexflowArray.
	 *
	 */
	removeLastNoteElement = function() {
		if(noteElements.length == 0) {
	    	first = true;
	    	noteElements = [];
	    }else if(noteElements[0].notes.length != 0) {
			//check if element you want to delete is triplet
			//and check if there are triplets before
		    if(noteElements[0].notes[noteElements4VexFlow.length-1].pitch && noteElements[0].notes[noteElements4VexFlow.length-1].pitch.beam != false) {
		    	noteElements[0].notes.pop();
		    	noteElements[0].notes.pop();
		    	noteElements[0].notes.pop();
		    	noteElements4VexFlow.pop();
		    	noteElements4VexFlow.pop();
		    	noteElements4VexFlow.pop();
		    	beamArray.pop();
				tupletArray.pop();
		    } else {
		    	noteElements[0].notes.pop();
		    	noteElements4VexFlow.pop();
		    }
		}

	    $(that).trigger('patternChange', [noteElements]);
		// send vexflow note elements to controller and then back to view
		$(that).trigger('updateNotationView', [getAllVexFlowNoteElements()]);
	},

	/**
	 * Returns an array with Note Elements
	 *
	 * @return {Array<Notes>}    array of Note Elements
	 */
	getAllNoteElements = function() {
		return noteElements;
	},

	/**
	 * Returns an array wtih vexflow notes elements
	 *
	 * @return {Array<vexflowNotes>}    array of vexflowNotes
	 */
	getAllVexFlowNoteElements = function() {
		return noteElements4VexFlow;
	};

	that.init = init;
	that.getKeyContent4Vexflow = getKeyContent4Vexflow;
	that.getCurrentNoteName = getCurrentNoteName;
	that.getCurrentAccidential = getCurrentAccidential;
	that.getCurrentNoteDuration = getCurrentNoteDuration;
	that.getCurrentNoteRythSpecial = getCurrentNoteRythSpecial;
	that.getCurrentOctave = getCurrentOctave;
	that.setCurrentMode = setCurrentMode;
	that.setCurrentNoteName = setCurrentNoteName;
	that.setCurrentAccidential = setCurrentAccidential;
	that.setCurrentNoteDuration = setCurrentNoteDuration;
	that.setCurrentNoteRythSpecial = setCurrentNoteRythSpecial;
	that.setCurrentOctave = setCurrentOctave;
	that.addNoteElement = addNoteElement;
	that.addNoteElementByCanvasClick = addNoteElementByCanvasClick;
	that.removeLastNoteElement = removeLastNoteElement;
	that.getCurrentMode = getCurrentMode;
	that.getAllNoteElements = getAllNoteElements;
	that.getAllVexFlowNoteElements = getAllVexFlowNoteElements;
	that.getDuration4Vexflow = getDuration4Vexflow;
	that.getTupletArray = getTupletArray;
	that.getBeamArray = getBeamArray;
	that.getPatternLength = getPatternLength;

	return that;
}
