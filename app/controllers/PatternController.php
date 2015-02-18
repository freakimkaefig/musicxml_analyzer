<?php
require 'SoundSequenzController.php';

class PatternController extends BaseController {

	$tonika = array("C" => 0,
						"D" => 2,
						"E" => 4,
						"F" => 5,
						"G" => 7,
						"A" => 9,
						"B" => 11);

	public function getCreatePattern() {
		return View::make('createPattern');

		// TESTING
		// $pattern = '[{"name":"c","accidential":"none","duration":"1/1","rythSpecial":"None","octave":"2"}]';
		// return Redirect::route('patternSearch', array('pattern' => $pattern));
	}

	public function postPatternSearch() {
		// if (Input::has('pattern')) {
		// 	
		// 	$pattern = Input::get('pattern');
		// } elseif (Chache::has('pattern')) {
		// 	
		// } else {
		// 	return Redirect::route('pattern');
		// }
		
		$pattern = Input::get('pattern');
		$type = Input::get('type');

		switch ($type) {
			case 0:
				// Type == Tonfolge
				$ssConntroller = new SoundSequenzController();
				$results = $ssConntroller->search($pattern);
				break;
			case 1:
				$rConntroller = new RhythmController();
				$results = array();
				break;
			case 2:
				$rConntroller = new MelodyController();
				$results = array();
				break;
		}

		Cache::put('pattern', $pattern, 60*24);
		Cache::put('results', $results, 60*24);

		return Redirect::route('searchResults')
			->with('pattern', $pattern)
			->with('results', $results);
	}

	public static function getInterval($n){
		$tonika = array("C" => 0,"D" => 2,"E" => 4,"F" => 5,"G" => 7,"A" => 9,"B" => 11);
		$note = $n;
		// $note = str_replace("[", "", $n);
		// $note = str_replace("]", "", $note);
		// $note = str_replace("\\", "", $note);
		// var_dump($note);
		$obj_arr = (array)$note;
		if(!isset($obj_arr["rest"])){


			$noteStep = $note->pitch->step;
			$noteAlter = $note->pitch->alter;
			$noteOctave = $note->pitch->octave;

			if($noteStep && $noteOctave){
				$noteValue = $tonika[(string)$noteStep];
				if($noteAlter == 1 || $noteAlter == -1){
					$noteValue = (int)$noteValue + (int)$noteAlter;
				}
				$noteValue = (int)$noteOctave * 12 + (int)$noteValue;
			}
			if($noteValue){
				return $noteValue;
			}else{
				return 0;
			}
		}

	}

}
