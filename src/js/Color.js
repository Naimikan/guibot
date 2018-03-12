var Color = (function (Utils) {
  function Color (/* red, green, blue | red, green, blue, alpha | rgbaArray | hexString | colorJson */) {
    var _rgba = [];

    var _validateAlpha = function (alpha) {
      var tempAlpha = 1;

      if (Utils.isDefinedAndNotNull(alpha)) {
        if (Utils.isValidNumber(alpha) && (alpha >= 0 && alpha <= 1)) tempAlpha = alpha;
        else if (Utils.isString(alpha)) {
          if (alpha.indexOf('%') !== -1) {
            alpha = alpha.replace('%', '');

            if (alpha.length > 0) {
              var tmp = +alpha;

              if (tmp === alpha && Utils.isInteger(tmp) && (tmp >= 0 && tmp <= 1)) tempAlpha = tmp/100;
            }
          } else {
            tempAlpha = +alpha;
          }
        }
      }

      return tempAlpha;
    };

    var _randomConstructor = function () {
      return [Math.random() * 256, Math.random() * 256, Math.random() * 256, 1].map(function (each) {
        return Math.round(each);
      });
    };

    var _rgbConstructor = function (red, green, blue) {
      if (Utils.isInteger(red) && Utils.isInteger(green) && Utils.isInteger(blue)) return [red, green, blue, 1];
      else throw new Error('Invalid input type');
    };

    var _rgbaConstructor = function (red, green, blue, alpha) {
      if (Utils.isInteger(red) && Utils.isInteger(green) && Utils.isInteger(blue)) return [red, green, blue, _validateAlpha(alpha)];
    };

    var _rgbaArrayConstructor = function (rgbaArray) {
      if (rgbaArray.length >= 3) {
        var red = rgbaArray[0], green = rgbaArray[1], blue = rgbaArray[2];

        if (Utils.isInteger(red) && Utils.isInteger(green) && Utils.isInteger(blue)) {
          return [red, green, blue, _validateAlpha(rgbaArray[3])];
        }
      }
    };

    var _hexadecimalConstructor = function (hexadecimal) {
      var transformedColor = Color.hexadecimalToRGB(hexadecimal);

      if (Utils.isDefinedAndNotNull(transformedColor)) return transformedColor;
      else throw new Error('Invalid hexadecimal color');
    };

    var _objectConstructor = function (objectColor) {
      if ((objectColor.hasOwnProperty('r') || objectColor.hasOwnProperty('red')) && (objectColor.hasOwnProperty('g') || objectColor.hasOwnProperty('green')) && (objectColor.hasOwnProperty('b') || objectColor.hasOwnProperty('blue'))) {
        var red = objectColor.r || objectColor.red;
        var green = objectColor.g || objectColor.green;
        var blue = objectColor.b || objectColor.blue;
        var alpha = 1;

        if (Utils.isInteger(red) && Utils.isInteger(green) && Utils.isInteger(blue)) {
          if (objectColor.hasOwnProperty('a') || objectColor.hasOwnProperty('alpha')) {
            alpha = objectColor.a || objectColor.alpha;
          }

          return [red, green, blue, _validateAlpha(alpha)];
        }
      }
    };

    var _miscConstructor = function (argument) {
      var argumentType = Object.prototype.toString.call(argument);

      if (argumentType === '[object Array]') _rgba = _rgbaArrayConstructor(argument);
      else if (argumentType === '[object String]') _rgba = _hexadecimalConstructor(argument);
      else if (argumentType === '[object Object]') _rgba = _objectConstructor(argument);
      else throw new Error('Invalid constructor parameters');
    };

    if (arguments.length === 0) _rgba = _randomConstructor();
    else if (arguments.length === 3) _rgba = _rgbConstructor(arguments[0], arguments[1], arguments[2]);
    else if (arguments.length === 4) _rgba = _rgbaConstructor(arguments[0], arguments[1], arguments[2], arguments[3]);
    else if (arguments.length === 1) _rgba = _miscConstructor(arguments[0]);
    else throw new Error('Invalid constructor parameters');

    this.toArray = function () {
      return _rgba;
    };

    this.toJSON = function () {
      return {
        r: _rgba[0],
        g: _rgba[1],
        b: _rgba[2],
        a: _rgba[3]
      };
    };

    this.toRGBA = function () {
      return 'rgba(' + _rgba.join(',') + ')';
    };

    this.toRGB = function () {
      return 'rgb(' + _rgba[0] + ', ' + _rgba[1] + ', ' + _rgba[2] + ')';
    };

    this.toHexadecimal = function () {
      return '#' + ((1 << 24) + (_rgba[0] << 16) + (_rgba[1] << 8) + _rgba[2]).toString(16).slice(1);
    };

    Object.defineProperty(this, 'red', {
      get: function () { return _rgba[0]; },
      set: function (newRed) { _rgba[0] = +newRed; }
    });

    Object.defineProperty(this, 'green', {
      get: function () { return _rgba[1]; },
      set: function (newGreen) { _rgba[1] = +newGreen; }
    });

    Object.defineProperty(this, 'blue', {
      get: function () { return _rgba[2]; },
      set: function (newBlue) { _rgba[2] = +newBlue; }
    });

    Object.defineProperty(this, 'alpha', {
      get: function () { return _rgba[3]; },
      set: function (newAlpha) { _rgba[3] = _validateAlpha(newAlpha); }
    });
  }

  Color.prototype.constructor = Color;

  Color.isValid = function (color) {
    return color instanceof Color;
  };

  // Static method (via http://stackoverflow.com/a/5624139)
  Color.hexadecimalToRGB = function (hexadecimalColor) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexadecimalColor = hexadecimalColor.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexadecimalColor);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1] : undefined;
  };

  return Color;
})(Utils);
