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
