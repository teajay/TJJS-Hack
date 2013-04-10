
function isFraction(fraction) {
	var split = fraction.split('/');
	var numerator = parseInt(split[0], 10);
	var denominator = parseInt(split[1], 10);
	
	if(isNaN(numerator) || isNan(denominator)) {
		return false;
	}
	
	if(denominator == 0) {
		return false;
	}
	return true;
}

function isFloat(float) {
	return !isNaN(parseFloat(float));
}

function isInt(intValue) {
	return !isNaN(parseInt(intValue));
}

function isNumber(number) {
	return (isFloat(number) || isInt(number) || isFraction(number));
}