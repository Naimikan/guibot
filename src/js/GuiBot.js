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
        full: '0.2.1',
        major: 0,
        minor: 2,
        patch: 1
      };
    },
    get EVENTS () {
      return Events;
    }
  };
})(Events, Utils, Color, User, Message, Chat, Deventor);
