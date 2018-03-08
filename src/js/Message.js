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
      // messageUsername.style.color = user.color;

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
