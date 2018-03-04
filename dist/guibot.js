/*!
*  guibot 0.0.2 2018-03-04
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
    _guibotInput.setAttribute('data-placeholder', GuiBot.GUIBOT_DEFAULTS.INPUT_PLACEHOLDER);
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

        self.human({
          message: event.target.textContent,
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
      user = user || (who === GuiBot.TYPES.BOT ? _bot : _human);

      var guibotMessageIconContainer = document.createElement('div');
      guibotMessageIconContainer.className = 'guibot-message-icon-container';

      var guibotMessageIcon = document.createElement('img');
      guibotMessageIcon.className = 'guibot-message-icon ' + who;
      guibotMessageIcon.src = user.icon;

      guibotMessageIconContainer.appendChild(guibotMessageIcon);
      messageContainer.appendChild(guibotMessageIconContainer);
    };

    var _addMessageName = function (messageId, messageContainer, who, user) {
      user = user || (who === GuiBot.TYPES.BOT ? _bot : _human);

      var messageUsername = document.createElement('div');
      messageUsername.className = 'guibot-message-username ' + who;
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

            if (who === GuiBot.TYPES.BOT) _addMessageIcon(messageId, guibotMessageContainer, who, options.user);

            var guibotMessage = document.createElement('div');
            guibotMessage.className = 'guibot-message ' + who;

            _addMessageName(messageId, guibotMessage, who, options.user);
            _addMessageText(messageId, guibotMessage, message);
            _addMessageTime(messageId, guibotMessage, now);

            guibotMessageContainer.appendChild(guibotMessage);

            if (who === GuiBot.TYPES.HUMAN) _addMessageIcon(messageId, guibotMessageContainer, who, options.user);

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
        _say(GuiBot.TYPES.BOT, options).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          reject(error);
        });
      });
    };

    this.human = function (options) {
      return new Promise(function (resolve, reject) {
        _say(GuiBot.TYPES.HUMAN, options).then(function (result) {
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

      var botUsernameElements = _rootContainer.getElementsByClassName('guibot-message-username ' + GuiBot.TYPES.BOT);
      var botUsernameElementsArray = Array.prototype.slice.call(botUsernameElements);

      botUsernameElementsArray.map(function (eachBotUsername) {
        eachBotUsername.innerHTML = _bot.name;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.BOT_NAME_CHANGED, oldBotName, _bot.name);
    };

    this.getHumanName = function () {
      return _human.name;
    };

    this.setHumanName = function (newHumanName) {
      var oldHumanName = _human.name;
      _human.name = newHumanName;

      var humanUsernameElements = _rootContainer.getElementsByClassName('guibot-message-username ' + GuiBot.TYPES.HUMAN);
      var humanUsernameElementsArray = Array.prototype.slice.call(humanUsernameElements);

      humanUsernameElementsArray.map(function (eachHumanUsername) {
        eachHumanUsername.innerHTML = _human.name;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.HUMAN_NAME_CHANGED, oldHumanName, _human.name);
    };

    this.getBotNameColor = function () {
      return _bot.color;
    };

    this.setBotNameColor = function (newBotNameColor) {
      var oldBotNameColor = _bot.color;
      _bot.color = newBotNameColor;

      var botUsernameElements = _rootContainer.getElementsByClassName('guibot-message-username ' + GuiBot.TYPES.BOT);
      var botUsernameElementsArray = Array.prototype.slice.call(botUsernameElements);

      botUsernameElementsArray.map(function (eachBotUsername) {
        eachBotUsername.style.color = _bot.color;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.BOT_NAME_COLOR_CHANGED, oldBotNameColor, _bot.color);
    };

    this.getHumanNameColor = function () {
      return _human.color;
    };

    this.setHumanNameColor = function (newHumanNameColor) {
      var oldHumanNameColor = _human.color;
      _human.color = newHumanNameColor;

      var humanUsernameElements = _rootContainer.getElementsByClassName('guibot-message-username ' + GuiBot.TYPES.HUMAN);
      var humanUsernameElementsArray = Array.prototype.slice.call(humanUsernameElements);

      humanUsernameElementsArray.map(function (eachHumanUsername) {
        eachHumanUsername.style.color = _human.color;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.HUMAN_NAME_COLOR_CHANGED, oldHumanNameColor, _human.color);
    };

    this.getBotIcon = function () {
      return _bot.icon;
    };

    this.setBotIcon = function (newBotIcon) {
      var oldBotIcon = _bot.icon;
      _bot.icon = newBotIcon;

      var botIconElements = _rootContainer.getElementsByClassName('guibot-message-icon ' + GuiBot.TYPES.BOT);
      var botIconElementsArray = Array.prototype.slice.call(botIconElements);

      botIconElementsArray.map(function (eachBotIcon) {
        eachBotIcon.src = _bot.icon;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.BOT_ICON_CHANGED, oldBotIcon, _bot.icon);
    };

    this.getHumanIcon = function () {
      return _human.icon;
    };

    this.setHumanIcon = function (newHumanIcon) {
      var oldHumanIcon = _human.icon;
      _human.icon = newHumanIcon;

      var humanIconElements = _rootContainer.getElementsByClassName('guibot-message-icon ' + GuiBot.TYPES.HUMAN);
      var humanIconElementsArray = Array.prototype.slice.call(humanIconElements);

      humanIconElementsArray.map(function (eachHumanIcon) {
        eachHumanIcon.src = _human.icon;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.HUMAN_ICON_CHANGED, oldHumanIcon, _human.icon);
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

      this.emit(GuiBot.GUIBOT_EVENTS.NAME_CHANGED, oldName, _name);
    };

    this.getMessages = function () {
      return _messages;
    };

    this.setMessages = function (messages) {
      messages.map(function (eachMessage) {
        _say(eachMessage.type, {
          ts: eachMessage.ts,
          message: eachMessage.message,
          user: eachMessage.user
        });
      });
    };

    this.getMessageById = function (messageId) {
      return _messages.find(function (eachMessage) {
        return messageId === eachMessage.id;
      });
    };

    this.updateMessageById = function (messageId, newMessage) {
      var message = this.getMessageById(messageId);
      var oldMessage = JSON.parse(JSON.stringify(message));

      message.message = newMessage;

      var messageContainer = [].find.call(message.element.children, function (child) {
        return [].indexOf.call(child.classList, 'guibot-message') !== -1;
      });

      var messageToUpdate = [].find.call(messageContainer.children, function (child) {
        return child.className === 'guibot-message-text';
      });

      messageToUpdate.innerHTML = newMessage;

      this.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_UPDATED, oldMessage, message);
    };

    this.removeMessageById = function (messageId) {
      var messageToRemove = this.getMessageById(messageId);
      messageToRemove.element.remove();

      _messages = _messages.filter(function (eachMessage) {
        return messageId !== eachMessage.id;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_REMOVED, messageToRemove);
    };

    this.destroy = function () {
      while (_rootContainer.firstChild) _rootContainer.removeChild(_rootContainer.firstChild);

      _id = null;
      _rootContainer = null;
      _messages = [];
      _bot = null;
      _human = null;
    };
  }

  GuiBot.prototype = Object.create(Deventor.prototype);
  GuiBot.prototype.constructor = GuiBot;

  GuiBot.TYPES = {
    BOT: 'bot',
    HUMAN: 'human'
  };
  Object.freeze(GuiBot.TYPES);

  GuiBot.VERSION = {
    full: '0.0.2',
    major: 0,
    minor: 0,
    patch: 2
  };

  Object.freeze(GuiBot.VERSION);

  GuiBot.GUIBOT_DEFAULTS = {
    BOT: {
      ICON: 'https://www.shareicon.net/download/2017/04/14/883959_science.svg',
      NAME: 'Mr. Robot',
      NAME_COLOR: '#D73925'
    },
    HUMAN: {
      ICON: 'https://www.shareicon.net/download/2016/01/19/705714_people.svg',
      NAME: 'Me',
      NAME_COLOR: '#5F7BC0'
    },
    INPUT_PLACEHOLDER: 'Write a message here'
  };

  var EVENT_PREFIX = 'GuiBot:';
  GuiBot.GUIBOT_EVENTS = {
    MESSAGE_SAID: EVENT_PREFIX + 'messageSaid',
    MESSAGE_UPDATED: EVENT_PREFIX + 'messageUpdated',
    MESSAGE_REMOVED: EVENT_PREFIX + 'messageRemoved',
    MESSAGE_OPTION_CLICKED: EVENT_PREFIX + 'messageOptionClicked',
    NAME_CHANGED: EVENT_PREFIX + 'nameChanged',
    BOT_ICON_CHANGED: EVENT_PREFIX + 'botIconChanged',
    BOT_NAME_CHANGED: EVENT_PREFIX + 'botNameChanged',
    BOT_NAME_COLOR_CHANGED: EVENT_PREFIX + 'botNameColorChanged',
    HUMAN_ICON_CHANGED: EVENT_PREFIX + 'humanIconChanged',
    HUMAN_NAME_CHANGED: EVENT_PREFIX + 'humanNameChanged',
    HUMAN_NAME_COLOR_CHANGED: EVENT_PREFIX + 'humanNameColorChanged'
  };

  Object.freeze(GuiBot.GUIBOT_EVENTS);

  return GuiBot;
})();

}(window.Deventor));