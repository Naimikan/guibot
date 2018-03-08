window.GuiBot = (function (Events, Utils, User, Message, Deventor) {
  // Unsupported promises
  if (!(typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1)) {
    throw new Error('Sorry, your browser doesn\'t support Promises.');
  }

  if (typeof Deventor === 'undefined') {
    throw new Error('Deventor is not included.');
  }

  function GuiBot (settings) {
    Deventor.call(this);

    settings = settings || {};

    var self = this;

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

              messageInstance.on(GuiBot.GUIBOT_EVENTS.MESSAGE_UPDATED, function (oldValue, newValue) {
                self.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_UPDATED, oldValue, newValue);
              });

              user.addMessage(messageInstance);

              _messages.push(messageInstance);

              _guibotChatContainer.appendChild(messageInstance.element);

              Utils.scrollToDownByContainer(_guibotChatContainer);

              self.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_SAID, messageInstance);

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
      var userToAdd = new User(user);
      _users.push(userToAdd);

      this.emit(GuiBot.GUIBOT_EVENTS.USER_ADDED, userToAdd);

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

      this.emit(GuiBot.GUIBOT_EVENTS.USER_REMOVED, userToRemove);
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
      message.message = newMessage;

      // var oldMessage = JSON.parse(JSON.stringify(message));
      //
      // message.message = newMessage;
      //
      // var messageContainer = [].find.call(message.element.children, function (child) {
      //   return [].indexOf.call(child.classList, 'guibot-message') !== -1;
      // });
      //
      // var messageToUpdate = [].find.call(messageContainer.children, function (child) {
      //   return child.className === 'guibot-message-text';
      // });
      //
      // messageToUpdate.innerHTML = newMessage;
      //
      // this.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_UPDATED, oldMessage, message);
    };

    this.removeMessageById = function (messageId) {
      var messageToRemove = this.getMessageById(messageId);
      messageToRemove.element.remove();

      _messages = _messages.filter(function (eachMessage) {
        return messageId !== eachMessage.id;
      });

      this.emit(GuiBot.GUIBOT_EVENTS.MESSAGE_REMOVED, messageToRemove);
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
  }

  GuiBot.prototype = Object.create(Deventor.prototype);
  GuiBot.prototype.constructor = GuiBot;

  GuiBot.VERSION = {
    full: '0.1.0',
    major: 0,
    minor: 1,
    patch: 0
  };

  Object.freeze(GuiBot.VERSION);

  GuiBot.GUIBOT_DEFAULTS = {
    INPUT_PLACEHOLDER: 'Write a message here'
  };

  GuiBot.GUIBOT_EVENTS = Events;

  Object.freeze(GuiBot.GUIBOT_EVENTS);

  return GuiBot;
})(Events, Utils, User, Message, Deventor);
