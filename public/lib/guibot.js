/*!
*  guibot 0.2.0 2018-03-12
*  A pure Javascript framework to create conversational UIs
*  git: git+https://github.com/Naimikan/guibot.git
*/
(function (Deventor) {
'use strict';
var Events = (function () {
  var EVENT_PREFIX = 'GuiBot:';

  return {
    MESSAGE_SAID: EVENT_PREFIX + 'messageSaid',
    MESSAGE_UPDATED: EVENT_PREFIX + 'messageUpdated',
    MESSAGE_REMOVED: EVENT_PREFIX + 'messageRemoved',
    MESSAGE_OPTION_CLICKED: EVENT_PREFIX + 'messageOptionClicked',

    NAME_CHANGED: EVENT_PREFIX + 'nameChanged',

    USER_ADDED: EVENT_PREFIX + 'userAdded',
    USER_UPDATED: EVENT_PREFIX + 'userUpdated',
    USER_REMOVED: EVENT_PREFIX + 'userRemoved',
    USER_NAME_CHANGED: EVENT_PREFIX + 'userNameChanged',
    USER_ICON_CHANGED: EVENT_PREFIX + 'userIconChanged'
  };
})();

var Utils = (function () {
  return {
    generateGUID: function () {
      function partGUID () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }

      return partGUID() + partGUID() + '-' + partGUID() + '-' + partGUID() + '-' + partGUID() + '-' + partGUID() + partGUID() + partGUID();
    },
    addClass: function (element, classToAdd) {
      element.className += ' ' + classToAdd;
    },
    removeClass: function (element, classToRemove) {
      element.className = element.className.replace(' ' + classToRemove, '');
      element.className.trim();
    },
    scrollToDownByContainer: function (container) {
      container.scrollTop = container.scrollHeight;
    },
    wait: function (delay) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve();
        }, delay || 0);
      });
    },
    isDefinedAndNotNull: function (value) {
      return typeof value !== 'undefined' && value !== null;
    },
    isInteger: function (variable) {
      return (typeof variable === 'number' && isFinite(variable) && Math.floor(variable) === variable);
    },
    isFloat:function (variable) {
      return (typeof variable === 'number' && isFinite(variable) && Math.floor(variable) !== variable);
    },
    isValidNumber: function (variable) {
      return (typeof variable === 'number' && isFinite(variable));
    },
    isBoolean: function (variable) {
      return variable === true || variable === false || (typeof variable === 'object' && variable !== null) || variable.toString() === '[object Boolean]';
    },
    isString: function (variable) {
      return Object.prototype.toString.call(variable) === '[object String]';
    }
  };
})();

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

var User = (function (Utils, Events, Color, Deventor) {
  function User (options) {
    Deventor.call(this);

    var _id = options.id || Utils.generateGUID();
    var _isLocal = options.isLocal || false;
    var _icon = options.icon || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0BAMAAAA5+MK5AAAAG1BMVEX09PTh4eHl5eXo6Ojy8vLq6urs7Ozw8PDu7u5TsDcvAAAH+0lEQVR42uzVMWpCQRQF0FeEJO37IZ+0cQdqoaWNYq9Y6w5EFKxduYtwBmbwnB1cLpcbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC86uO+m0+aND9co6btLNs1LFdRze0/m/Z7jkrW2bqfStk32b5xFRV8TbMDi6jgkT0YjlHcZ/ZhjOJO2Yn9u5aeOb5t6ZmF1/6d/fiLoi7Zj+EcJXXx6U927uCpaSCK4/gTQtvjvnaLXjt2Zj2CMJZj7TgOV8QRj6AOXgv4BxDHQf9sqTOdZ4Cy2d1s+G2a7xUOhE/eJoFNl+2s5yJX+UI345TqT9dzfa94jc/AH1bvNl7XUa902Dc5rQZUWRecWPN1XeWYT9fzhqbSm5qseNXcQ+w1/5+miure+csfZFfM0vMoj20fCbPsKMbDW6d4kwjajKXtGIf+glDrxTj0rcIUodZlaRjj0DXBFvvQFaGWjSIf+phgW98TvlVvZ71Vb2e9VW9nvVVvZ71Vb2e9VW9nvVVvZ/2xDeM3539+UPkSU9e0osPjES96+XlKJWuGevZVvmXwjcqVmLoqs3X4hErVBPXurt/+5LTUteV/Pg7/nmqC+k++V/+aSpSWuir5XshwStaSV5dBL7RP9tJS13S3S+83cFJX74744QxZS0tdWdBdNignrr5AB2Gve9ZnvLKBbZFPXH03ZAtXWuqKCnVCtqqmrZ4H7ddMS70469kuM8oZX7N6hxnnjK931mdBb2IkrX4WtkM5LXVd/EWHvImRtHqHGWjYa531jaA3MZJWv+DbYK7stc76ETPOOlebutzAw9zU1DnrGVtTtLqU1XtsybaHPC11Xby2AV3dalXfZGtD8uw3nrpyO/QB+dXrz6HVN9han/zKeQKnrkl6Fu3Qe8z9ObL6W7Y39URnNmjqyvEFZ1905sEcWP0i1sdG5LzIgKlrxxPeG30x7bjqMZY5QWeeYKkrt4vbwA99yQ6rHumWJudlBkpdx76RFfTFIo+qvhXl8SVnySCpK8eHVj90mXZQ9S5b017o0gRIvXAsI7a144ku046pHuPPkjkXMzjqqvhz2pr7osu0Y6rP2FLfF10yMOq6+AVL2/7owg6p3mVLY290yaCoK3JZ504D0IUdUd36xD71R5cMiLomh2HfDkIXdkR1y96CcQi6NMFQVy4fwncdhi7sgOqPn/HDMHTJQKhrKr9xbj8UXe7kAdXp0vKx1SHokkFQV+WtTDi6/BYB1VcvdP3rYHTJAKjr0p8s/KoKdGEHVKcvEdEl8/Tq6r7XKOakCzugOl1Zrkch6JJ5cnVN98rO/J/ZBN3ODqgu7zdKE6oMXdjhZv22zoiLHVB16MIOqE70vuh+MK0OXTJ4s76o94GF54QqRRd2RHWi7GYJ/+YXUZXokgGc9X9lh+fHe5++vyOqGl3YIdUDyrlsBnHWpRjowt4s9ZzLZzBnPSa6sDdJPWeXTINmXdBLsjdHPWe3TGNmXdBLszdFPWfXTENmXdAd2JuhnrN7phGzLuhO7E1Qz9kn04BZF3RH9vTVc/bLJD/rgu7Mnrr6X/buGLVhIIjCsIuwqScEnBvkGkqTe2wTUuoKvnkgEH7sqNAuHmv27bwDCImPHzUSC3oz++Ctg97BPrY66B3sQ7cOehf7yOqgd7EP3DronezjqoPeyR659cUFHfa46uXdBR32uK1XW13QYY+qXszOLuiwR229mtnqgc7WmOrFDPa7orO3mK1XXO6OTu0R1YsZ7A7oXJ49xWi9kqMDOrXHUy+4eKBTe7zWKy4u6NQeTb0YObqgwx6t9Xrl4oDOlljqoMN+X3S2xmoddG7OCd1itQ467F7otoRqHXTYPdDjtQ467G7otkRqHXSDHXRhddBh30BXbP0/Ou920BXVQWewgy7YejXGVtBl1UFnsIMu2DroG7WDbnrqoDPYL8bkWgf9dusfuqg66Az2izG51kHfYL9GF1MHncF+g67VOugbe7HfaaoXa5hW69X2T0u9DV2q9X3oiupt6FKtt6ErqbeiC7W+F11PvRVdqPVWdB31dnSZ1vejq6m3o8u03o6uot6DLtJ6C7qWeg+6SOs96BrqfegSrbehK6n3oUu03oeuoN6LLtB6K7qOei+6QOu96OOrH47+2NZDoT9WPRT6Rutxzmnd3vDqH3b4lsDntN4s1YdvPdijz6uerc+onq3PqJ6tz6ierc+onq3PqJ6tz6ierc+onq3PqJ6tz6ierc+onq3PqJ6tz6ierc+onq3PqO7feqyvKtaD1D+/jt73cvh/bhGGusU+FaB5x5+6/3qKulTP1lM9W0/1bD3Vs/VUz9ZTPVtP9Wz9FHVP3urnU9Q9ezx6MfbDzh2rRBADYRz/wOO8diLGrUV7dQstF0GwVPABFmwsFzmOK4978rurUi+bwIT8f0+QMElmhsBEeVVklWtLwiCn3ktsfWOW/Min1bclXYlbZGErj1b/Zsld1rSR9B69mBXJQ89WmSfN5Gs67hKjFvH1uTbPoFyurC43msvXJOwFYtbOoCoPUqvv3Ji1SKxJ1mJ7YzXpdNZmUfMlNXriwyQ1euI7nbX5xo+6aLGqiVKrYR+lRsMeld/RahAOyu+6itz+qhLWFTQxcVARH+bd7aRCds7j/jipmM/e/Apvg0ra//b3LvV/kwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACc2oNDAgAAAABB/197wggAAAAwCf/UoxkfDe2dAAAAAElFTkSuQmCC';
    var _color = options.color ? new Color(options.color) : new Color();
    var _messages = [];
    var _name = options.name || _id;
    var _extra = {};

    for (var attr in options) {
      if (options.hasOwnProperty(attr)) {
        if (attr !== 'name' && attr !== 'color' && attr !== 'isLocal' && attr !== 'icon') {
          _extra[attr] = options[attr];
        }
      }
    }

    Object.defineProperty(this, 'id', {
      get: function () { return _id; }
    });

    Object.defineProperty(this, 'name', {
      get: function () { return _name; },
      set: function (newName) {
        var oldUser = this.toJSON();
        _name = newName;

        _messages.map(function (eachMessage) {
          var messageContainer = [].find.call(eachMessage.element.children, function (child) {
            return [].indexOf.call(child.classList, 'guibot-message') !== -1;
          });

          var messageToUpdate = [].find.call(messageContainer.children, function (child) {
            return [].indexOf.call(child.classList, 'guibot-message-username') !== -1;
          });

          messageToUpdate.innerHTML = _name;
        });

        this.emit(Events.USER_NAME_CHANGED, oldUser, this.toJSON());
      }
    });

    Object.defineProperty(this, 'isLocal', {
      get: function () { return _isLocal; }
    });

    Object.defineProperty(this, 'extra', {
      get: function () { return _extra; }
    });

    Object.defineProperty(this, 'icon', {
      get: function () { return _icon; },
      set: function (newIcon) {
        var oldUser = this.toJSON();
        _icon = newIcon;

        this.emit(Events.USER_ICON_CHANGED, oldUser, this.toJSON());
      }
    });

    Object.defineProperty(this, 'color', {
      get: function () { return _color; }
    });

    this.getMessages = function () {
      return _messages;
    };

    this.getMessageById = function (messageId) {
      return _messages.find(function (eachMessage) {
        return messageId === eachMessage.id;
      });
    };

    this.addMessage = function (message) {
      _messages.push(message);
    };

    this.toJSON = function () {
      var object = {
        id: _id,
        name: _name,
        isLocal: _isLocal,
        extra: _extra,
        icon: _icon,
        color: _color.toJSON(),
        messages: _messages.map(function (each) {
          return each.toJSON();
        })
      };

      Object.freeze(object);

      return object;
    };
  }

  User.prototype = Object.create(Deventor.prototype);
  User.prototype.constructor = User;

  return User;
})(Utils, Events, Color, Deventor);

var Message = (function (Utils, Events, Deventor) {
  function Message (options) {
    Deventor.call(this);

    var _addMessageTime = function (messageId, messageContainer, now) {
      var hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
      var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
      var time = hours + ':' + minutes;

      var timeMessage = document.createElement('div');
      timeMessage.className = 'guibot-message-time';
      timeMessage.innerHTML = time;

      messageContainer.appendChild(timeMessage);
    };

    var _addMessageText = function (messageId, messageContainer, messageText) {
      var messageTextSpan = document.createElement('span');
      messageTextSpan.className = 'guibot-message-text';
      messageTextSpan.innerHTML = messageText;

      messageContainer.appendChild(messageTextSpan);
    };

    var _addMessageImage = function (messageId, messageContainer, imageUrl) {
      if (imageUrl) {
        var messageAnchor = document.createElement('a');
        messageAnchor.setAttribute('target', '_blank');
        messageAnchor.setAttribute('href', imageUrl);

        var messageImage = document.createElement('img');
        messageImage.className = 'guibot-message-image';
        messageImage.src = imageUrl;

        messageAnchor.appendChild(messageImage);
        messageContainer.appendChild(messageAnchor);
      }
    };

    var _addMessageVideo = function (messageId, messageContainer, videoUrl) {
      if (videoUrl) {
        var messageVideo = document.createElement('iframe');
        messageVideo.className = 'guibot-message-video';
        messageVideo.setAttribute('src', videoUrl);
        messageVideo.setAttribute('frameborder', 0);
        messageVideo.setAttribute('webkitallowfullscreen', '');
        messageVideo.setAttribute('mozallowfullscreen', '');
        messageVideo.setAttribute('allowfullscreen', '');

        messageContainer.appendChild(messageVideo);
      }
    };

    var _addMessageIcon = function (messageId, messageContainer, isLocal, user) {
      var messageIconContainer = document.createElement('div');
      messageIconContainer.className = 'guibot-message-icon-container';

      var messageIcon = document.createElement('img');
      messageIcon.className = 'guibot-message-icon ' + (isLocal ? 'local' : 'remote');
      messageIcon.src = user.icon;

      messageIconContainer.appendChild(messageIcon);
      messageContainer.appendChild(messageIconContainer);
    };

    var _addMessageName = function (messageId, messageContainer, isLocal, user) {
      var messageUsername = document.createElement('div');
      messageUsername.className = 'guibot-message-username ' + (isLocal ? 'local' : 'remote');
      messageUsername.innerHTML = user.name;
      messageUsername.style.color = user.color.toRGBA();

      messageContainer.appendChild(messageUsername);
    };

    var _id = options.id || Utils.generateGUID();
    var _message = options.message;
    var _ts = Utils.isDefinedAndNotNull(options.ts) ? options.ts : new Date().getTime();
    var _userId;
    var _imageUrl;
    var _videoUrl;

    if (!Utils.isDefinedAndNotNull(options.user)) {
      throw new Error('User attribute required');
    } else {
      _userId = options.user.id;
    }

    if (Utils.isDefinedAndNotNull(options.imageUrl)) _imageUrl = options.imageUrl;
    if (Utils.isDefinedAndNotNull(options.videoUrl)) _videoUrl = options.videoUrl;

     var _elementDOM = (function () {
      var messageContainerElement = document.createElement('div');
      messageContainerElement.className = 'guibot-message-container';
      messageContainerElement.setAttribute('data-message-type', (options.user.isLocal ? 'local' : 'remote'));
      messageContainerElement.setAttribute('id', _id);

      if (!options.user.isLocal) _addMessageIcon(_id, messageContainerElement, options.user.isLocal, options.user);

      var messageElement = document.createElement('div');
      messageElement.className = 'guibot-message ' + (options.user.isLocal ? 'local' : 'remote');

      _addMessageName(_id, messageElement, options.user.isLocal, options.user);
      _addMessageImage(_id, messageElement, _imageUrl);
      _addMessageVideo(_id, messageElement, _videoUrl);
      _addMessageText(_id, messageElement, _message);
      _addMessageTime(_id, messageElement, new Date(_ts));

      messageContainerElement.appendChild(messageElement);

      if (options.user.isLocal) _addMessageIcon(_id, messageContainerElement, options.user.isLocal, options.user);

      return messageContainerElement;
    })();

    Object.defineProperty(this, 'id', {
      get: function () { return _id; }
    });

    Object.defineProperty(this, 'message', {
      get: function () { return _message; },
      set: function (newMessage) {
        var oldMessage = this.toJSON();
        _message = newMessage;

        var messageContainer = [].find.call(_elementDOM.children, function (child) {
          return [].indexOf.call(child.classList, 'guibot-message') !== -1;
        });

        var messageToUpdate = [].find.call(messageContainer.children, function (child) {
          return child.className === 'guibot-message-text';
        });

        messageToUpdate.innerHTML = _message;

        this.emit(Events.MESSAGE_UPDATED, oldMessage, this.toJSON());
      }
    });

    Object.defineProperty(this, 'timestamp', {
      get: function () { return _ts; }
    });

    Object.defineProperty(this, 'userId', {
      get: function () { return _userId; }
    });

    Object.defineProperty(this, 'imageUrl', {
      get: function () { return _imageUrl; }
    });

    Object.defineProperty(this, 'videoUrl', {
      get: function () { return _videoUrl; }
    });

    Object.defineProperty(this, 'element', {
      get: function () { return _elementDOM; }
    });

    this.toJSON = function () {
      var object = {
        id: _id,
        message: _message,
        timestamp: _ts,
        userId: _userId,
        imageUrl: _imageUrl,
        videoUrl: _videoUrl,
        element: _elementDOM
      };

      Object.freeze(object);

      return object;
    };
  }

  Message.prototype = Object.create(Deventor.prototype);
  Message.prototype.constructor = Message;

  return Message;
})(Utils, Events, Deventor);

var Chat = (function (Events, Utils, User, Message, Deventor) {
  function Chat (settings) {
    var self = this;

    Deventor.call(this);

    settings = settings || {};

    var _messages = [];
    var _users = [];
    var _id = Utils.generateGUID();
    var _name = settings.name ? settings.name : 'guibot-' + _id;
    var _rootContainer = settings.elementId ? document.getElementById(settings.elementId) : document.body;

    /* Create Main Container */
    var _guibotContainer = document.createElement('div');
    _guibotContainer.setAttribute('id', 'guibot-container');
    _guibotContainer.className = _guibotContainer.getAttribute('id');

    /* Create Chat Container */
    var _guibotChatContainer = document.createElement('div');
    _guibotChatContainer.setAttribute('id', 'guibot-chat-container');
    _guibotChatContainer.className = _guibotChatContainer.getAttribute('id');

    _guibotContainer.appendChild(_guibotChatContainer);

    /* Create Options Container */

    /* Create Action Container */
    var _guibotActionContainer = document.createElement('div');
    _guibotActionContainer.setAttribute('id', 'guibot-action-container');
    _guibotActionContainer.className = _guibotActionContainer.getAttribute('id');

    var _guibotInputContainer = document.createElement('div');
    _guibotInputContainer.setAttribute('id', 'guibot-input-container');
    _guibotInputContainer.className = _guibotInputContainer.getAttribute('id');

    var _guibotInputTextContainer = document.createElement('div');
    _guibotInputTextContainer.setAttribute('id', 'guibot-input-text-container');
    _guibotInputTextContainer.className = _guibotInputTextContainer.getAttribute('id');

    var _guibotInput = document.createElement('div');
    _guibotInput.setAttribute('id', 'guibot-input');
    _guibotInput.setAttribute('dir', 'auto');
    _guibotInput.setAttribute('spellcheck', true);
    _guibotInput.setAttribute('contenteditable', true);
    _guibotInput.setAttribute('data-placeholder', Chat.DEFAULTS.INPUT_PLACEHOLDER);
    _guibotInput.className = _guibotInput.getAttribute('id');

    _guibotInput.addEventListener('input', function (event) {
      if (event.target.textContent.length === 0) {
        while (_guibotInput.firstChild) _guibotInput.removeChild(_guibotInput.firstChild);
      }
    });

    _guibotInput.addEventListener('keypress', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();

        var localUser = self.getLocalUser();

        if (!localUser) {
          localUser = self.addUser({
            isLocal: true
          });
        }

        self.say({
          message: event.target.textContent,
          userId: localUser.id,
          delay: 150
        });

        while (_guibotInput.firstChild) _guibotInput.removeChild(_guibotInput.firstChild);
      }
    });

    _guibotInputTextContainer.appendChild(_guibotInput);
    _guibotInputContainer.appendChild(_guibotInputTextContainer);
    _guibotActionContainer.appendChild(_guibotInputContainer);
    _guibotContainer.appendChild(_guibotActionContainer);

    _rootContainer.appendChild(_guibotContainer);

    /* Private methods */
    var _toggleEditInputBox = function (visible) {
      if (Utils.isBoolean(visible)) {
        _guibotInput.setAttribute('contenteditable', visible);

        if (visible) _guibotInput.focus();
      }
    };

    var _resolveMessage = function (message) {
      return new Promise(function (resolve, reject) {
        if (!!(message.constructor && message.call && message.apply)) {
          // ToDo: Think icon

          message(resolve, reject);
        } else {
          resolve(message);
        }
      });
    };

    var _say = function (options) {
      options = options || {};

      return new Promise(function (resolve, reject) {
        _toggleEditInputBox(false);

        Utils.wait(options.delay).then(function () {
          options.message = options.message || '';

          _resolveMessage(options.message).then(function (message) {
            if (Utils.isDefinedAndNotNull(options.userId)) {
              var user = self.getUserById(options.userId);

              var messageInstance = new Message({
                ts: options.ts,
                message: message,
                user: user,
                imageUrl: options.imageUrl,
                videoUrl: options.videoUrl
              });

              messageInstance.on(Events.MESSAGE_UPDATED, function (oldValue, newValue) {
                self.emit(Events.MESSAGE_UPDATED, oldValue, newValue);
              });

              user.addMessage(messageInstance);

              _messages.push(messageInstance);

              _guibotChatContainer.appendChild(messageInstance.element);

              Utils.scrollToDownByContainer(_guibotChatContainer);

              self.emit(Events.MESSAGE_SAID, messageInstance);

              _toggleEditInputBox(true);
              resolve();
            } else {
              reject(new Error('User ID required'));
            }
          });
        });
      });
    };

    /* Public methods */
    this.say = function (options) {
      return new Promise(function (resolve, reject) {
        _say(options).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          reject(error);
        });
      });
    };

    this.getUsers = function () {
      return _users;
    };

    this.getLocalUser = function () {
      return _users.find(function (eachUser) {
        return eachUser.isLocal;
      });
    };

    this.addUser = function (user) {
      var self = this;
      var userToAdd = new User(user);

      userToAdd.on(Events.USER_NAME_CHANGED, function (oldUser, newUser) {
        self.emit(Events.USER_UPDATED, oldUser, newUser);
      });

      _users.push(userToAdd);

      this.emit(Events.USER_ADDED, userToAdd);

      return userToAdd;
    };

    this.getUserById = function (userId) {
      return _users.find(function (eachUser) {
        return userId === eachUser.id;
      });
    };

    this.updateUserById = function (userId, newUser) {
      // ToDo
    };

    this.removeUserById = function (userId) {
      var userToRemove = this.getUserById(userId);

      _users = _users.filter(function (eachUser) {
        return userId !== eachUser.id;
      });

      this.emit(Events.USER_REMOVED, userToRemove);
    };

    this.removeAllUsers = function () {
      _users.map(function (eachUser) {
        this.removeUserById(eachUser.id);
      });

      _users = [];
    };

    this.getRootContainer = function () {
      return _rootContainer;
    };

    this.getGuiBotId = function () {
      return _id;
    };

    this.getGuiBotName = function () {
      return _name;
    };

    this.setGuiBotName = function (newGuiBotName) {
      var oldName = _name;
      _name = newGuiBotName;

      this.emit(Events.NAME_CHANGED, oldName, _name);
    };

    this.getMessages = function () {
      return _messages;
    };

    // this.setMessages = function (messages) {
    //   messages.map(function (eachMessage) {
    //     _say(eachMessage.type, {
    //       ts: eachMessage.ts,
    //       message: eachMessage.message,
    //       user: eachMessage.user
    //     });
    //   });
    // };

    this.getMessageById = function (messageId) {
      return _messages.find(function (eachMessage) {
        return messageId === eachMessage.id;
      });
    };

    this.updateMessageById = function (messageId, newMessage) {
      var message = this.getMessageById(messageId);
      message.message = newMessage;
    };

    this.removeMessageById = function (messageId) {
      var messageToRemove = this.getMessageById(messageId);
      messageToRemove.element.remove();

      _messages = _messages.filter(function (eachMessage) {
        return messageId !== eachMessage.id;
      });

      this.emit(Events.MESSAGE_REMOVED, messageToRemove);
    };

    this.removeAllMessages = function () {
      _messages.map(function (eachMessage) {
        this.removeMessageById(eachMessage.id);
      });

      _messages = [];
    };

    this.destroy = function () {
      while (_rootContainer.firstChild) _rootContainer.removeChild(_rootContainer.firstChild);

      this.removeAllUsers();
      this.removeAllMessages();

      _id = null;
      _rootContainer = null;
    };

    /* Initialization */
    if (Utils.isDefinedAndNotNull(settings.users) && Array.isArray(settings.users)) {
      settings.users.map(function (eachUser) {
        self.addUser(eachUser);
      });
    }
  }

  Chat.prototype = Object.create(Deventor.prototype);
  Chat.prototype.constructor = Chat;

  Chat.DEFAULTS = {
    INPUT_PLACEHOLDER: 'Write a message here'
  };

  return Chat;
})(Events, Utils, User, Message, Deventor);

window.guibot = (function (Events, Utils, Color, User, Message, Chat, Deventor) {
  // Unsupported promises
  if (!(typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1)) {
    throw new Error('Sorry, your browser doesn\'t support Promises.');
  }

  if (typeof Deventor === 'undefined') {
    throw new Error('Deventor is not included.');
  }

  return {
    Chat: Chat,
    Message: Message,
    User: User,
    Color: Color,

    get VERSION () {
      return {
        full: '0.2.0',
        major: 0,
        minor: 2,
        patch: 0
      };
    },
    get EVENTS () {
      return Events;
    }
  };
})(Events, Utils, Color, User, Message, Chat, Deventor);

}(window.Deventor));