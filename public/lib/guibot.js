/*!
*  guibot 0.0.1 2018-03-04
*  A pure Javascript framework to create conversational UIs
*  git: git+https://github.com/Naimikan/guibot.git
*/
(function (Deventor) {
'use strict';
window.GuiBot = (function () {
  // Unsupported promises
  if (!(typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1)) {
    throw new Error('Sorry, your browser doesn\'t support Promises.');
  }

  if (typeof Deventor === 'undefined') {
    throw new Error('Deventor is not included.');
  }

  var GUIBOT_SETTINGS = {
    EVENT_PREFIX: 'GuiBot:',
    TYPES: {
      BOT: 'bot',
      HUMAN: 'human'
    }
  };

  var Utils = {
    generateGUID: function () {
      function partGUID () {
        return Math.floor((1 + Math.random() + ((navigator.hardwareConcurrency || Math.random()) * window.innerHeight * window.innerWidth) + (new Date().getTime())) * 0x10000).toString(16).substring(1);
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
    isBoolean: function (variable) {
      return variable === true || variable === false || variable.toString() === '[object Boolean]';
    }
  };

  function GuiBot (settings) {
    Deventor.call(this);

    settings = settings || {};

    var self = this;

    var _messages = [];
    var _id = Utils.generateGUID();
    var _name = settings.name ? settings.name : 'guibot-' + _id;
    var _rootContainer = settings.elementId ? document.getElementById(settings.elementId) : document.body;
    var _bot = {
      icon: settings.botIcon || GuiBot.GUIBOT_DEFAULTS.BOT.ICON,
      name: settings.botName || GuiBot.GUIBOT_DEFAULTS.BOT.NAME,
      color: settings.botNameColor || GuiBot.GUIBOT_DEFAULTS.BOT.NAME_COLOR
    };
    var _human = {
      icon: settings.humanIcon || GuiBot.GUIBOT_DEFAULTS.HUMAN.ICON,
      name: settings.humanName || GuiBot.GUIBOT_DEFAULTS.HUMAN.NAME,
      color: settings.humanNameColor || GuiBot.GUIBOT_DEFAULTS.HUMAN.NAME_COLOR
    };

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
    _guibotInput.className = _guibotInput.getAttribute('id');

    _guibotInput.addEventListener('keydown', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();

        self.human({
          message: event.target.innerHTML,
          delay: 150
        });

        _guibotInput.innerHTML = '';
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

    var _addMessageIcon = function (messageId, messageContainer, who, user) {
      user = user || (who === GUIBOT_SETTINGS.TYPES.BOT ? _bot : _human);

      var guibotMessageIconContainer = document.createElement('div');
      guibotMessageIconContainer.className = 'guibot-message-icon-container';

      var guibotMessageIcon = document.createElement('img');
      guibotMessageIcon.className = 'guibot-message-icon ' + who;
      guibotMessageIcon.src = user.icon;

      guibotMessageIconContainer.appendChild(guibotMessageIcon);
      messageContainer.appendChild(guibotMessageIconContainer);
    };

    var _addMessageName = function (messageId, messageContainer, who, user) {
      user = user || (who === GUIBOT_SETTINGS.TYPES.BOT ? _bot : _human);

      var messageUsername = document.createElement('div');
      messageUsername.className = 'guibot-message-username ' +  who;
      messageUsername.innerHTML = user.name;
      messageUsername.style.color = user.color;

      messageContainer.appendChild(messageUsername);
    };

    var _say = function (who, options) {
      options = options || {};

      return new Promise(function (resolve, reject) {
        _toggleEditInputBox(false);

        Utils.wait(options.delay).then(function () {
          options.message = options.message || '';

          _resolveMessage(options.message).then(function (message) {
            var now = options.ts ? new Date(options.ts) : new Date();
            var messageId = 'guibot-message-' + now.getTime();

            var guibotMessageContainer = document.createElement('div');
            guibotMessageContainer.className = 'guibot-message-container';
            guibotMessageContainer.setAttribute('data-message-type', who);
            guibotMessageContainer.setAttribute('id', messageId);

            if (who === GUIBOT_SETTINGS.TYPES.BOT) _addMessageIcon(messageId, guibotMessageContainer, who, options.user);

            var guibotMessage = document.createElement('div');
            guibotMessage.className = 'guibot-message ' + who;

            _addMessageName(messageId, guibotMessage, who, options.user);
            _addMessageText(messageId, guibotMessage, message);
            _addMessageTime(messageId, guibotMessage, now);

            guibotMessageContainer.appendChild(guibotMessage);

            if (who === GUIBOT_SETTINGS.TYPES.HUMAN) _addMessageIcon(messageId, guibotMessageContainer, who, options.user);

            _guibotChatContainer.appendChild(guibotMessageContainer);

            Utils.scrollToDownByContainer(_guibotChatContainer);

            var messageObject = {
              element: guibotMessageContainer,
              id: messageId,
              ts: now.getTime(),
              type: who,
              message: message
            };

            if (options.user) messageObject.user = options.user;

            _messages.push(messageObject);

            self.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_SAID, messageObject);

            _toggleEditInputBox(true);
            resolve();
          });
        });
      });
    };

    /* Public methods */
    this.bot = function (options) {
      return new Promise(function (resolve, reject) {
        _say(GUIBOT_SETTINGS.TYPES.BOT, options).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          reject(error);
        });
      });
    };

    this.human = function (options) {
      return new Promise(function (resolve, reject) {
        _say(GUIBOT_SETTINGS.TYPES.HUMAN, options).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          reject(error);
        });
      });
    };

    this.getBotName = function () {
      return _bot.name;
    };

    this.setBotName = function (newBotName) {
      var oldBotName = _bot.name;
      _bot.name = newBotName;

      var botUsernameElements = _rootContainer.getElementsByClassName('guibot-message-username ' + GUIBOT_SETTINGS.TYPES.BOT);
      var botUsernameElementsArray = Array.prototype.slice.call(botUsernameElements);

      botUsernameElementsArray.map(function (eachBotUsername) {
        eachBotUsername.innerHTML = _bot.name;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.BOT_NAME_CHANGED, oldBotName, _bot.name);
    };
  }

  GuiBot.prototype = Object.create(Deventor.prototype);
  GuiBot.prototype.constructor = GuiBot;

  GuiBot.TYPES = GUIBOT_SETTINGS.TYPES;
  Object.freeze(GuiBot.TYPES);

  GuiBot.VERSION = {
    full: '0.0.1',
    major: 0,
    minor: 0,
    patch: 1
  };

  Object.freeze(GuiBot.VERSION);

  GuiBot.GUIBOT_DEFAULTS = {
    BOT: {
      ICON: 'https://www.shareicon.net/download/2017/04/14/883959_science.svg',
      NAME: 'Mr. Robot',
      NAME_COLOR: ''
    },
    HUMAN: {
      ICON: 'https://www.shareicon.net/download/2016/01/19/705714_people.svg',
      NAME: 'Me',
      NAME_COLOR: ''
    }
  };

  GuiBot.GUIBOT_EVENTS = {
    MESSAGE_SAID: GUIBOT_SETTINGS.EVENT_PREFIX + 'messageSaid',
    MESSAGE_UPDATED: GUIBOT_SETTINGS.EVENT_PREFIX + 'messageUpdated',
    MESSAGE_REMOVED: GUIBOT_SETTINGS.EVENT_PREFIX + 'messageRemoved',
    MESSAGE_OPTION_CLICKED: GUIBOT_SETTINGS.EVENT_PREFIX + 'messageOptionClicked',
    NAME_CHANGED: GUIBOT_SETTINGS.EVENT_PREFIX + 'nameChanged',
    BOT_ICON_CHANGED: GUIBOT_SETTINGS.EVENT_PREFIX + 'botIconChanged',
    BOT_NAME_CHANGED: GUIBOT_SETTINGS.EVENT_PREFIX + 'botNameChanged',
    HUMAN_ICON_CHANGED: GUIBOT_SETTINGS.EVENT_PREFIX + 'humanIconChanged',
    HUMAN_NAME_CHANGED: GUIBOT_SETTINGS.EVENT_PREFIX + 'humanNameChanged'
  };

  Object.freeze(GuiBot.GUIBOT_EVENTS);

  return GuiBot;
})();

}(window.Deventor));