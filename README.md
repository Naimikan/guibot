<p align="right">
  <a href="https://www.npmjs.com/package/guibot">
    <img src="https://img.shields.io/npm/v/guibot.svg" alt="version" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/guibot.svg" alt="license" />
  </a>
</p>

<h1 align="center">guibot | <a href="https://github.com/Naimikan/guibot/blob/master/API.md">API</a></h1>

<h5 align="center">A pure Javascript framework to create conversational UIs</h5>

<h2 align="center">Resources</h2>
<ul>
  <li>
    <a href="https://github.com/Naimikan/guibot/blob/master/API.md">API Reference</a>
  </li>

  <li>
    <a href="https://github.com/Naimikan/guibot/releases">Release Notes</a>
  </li>
</ul>

<h2 align="center">Compatibility</h2>

<table>
  <thead>
    <tr align="center>">
      <th></th>
      <th>Version</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Chrome</td>
      <td>33+</td>
    </tr>
    <tr>
      <td>Chrome for Android</td>
      <td>59+</td>
    </tr>
    <tr>
      <td>Firefox</td>
      <td>29+</td>
    </tr>
    <tr>
      <td>Firefox for Android</td>
      <td>54+</td>
    </tr>
    <tr>
      <td>Opera</td>
      <td>20+</td>
    </tr>
    <tr>
      <td>Opera Mobile</td>
      <td>37+</td>
    </tr>
    <tr>
      <td>Opera Mini</td>
      <td><b>No</b></td>
    </tr>
    <tr>
      <td>Safari</td>
      <td>7.1+</td>
    </tr>
    <tr>
      <td>iOS Safari</td>
      <td>8+</td>
    </tr>
    <tr>
      <td>Internet Explorer</td>
      <td><b>No</b></td>
    </tr>
    <tr>
      <td>IE Edge</td>
      <td>13+</td>
    </tr>
    <tr>
      <td>IE Mobile</td>
      <td><b>No</b></td>
    </tr>
    <tr>
      <td>Android Browser</td>
      <td>4.4.4+</td>
    </tr>
    <tr>
      <td>Blackberry Browser</td>
      <td><b>No</b></td>
    </tr>
    <tr>
      <td>UC Browser for Android</td>
      <td>11.4+</td>
    </tr>
    <tr>
      <td>Samsung Internet</td>
      <td>4+</td>
    </tr>
    <tr>
      <td>QQ Browser</td>
      <td>1.2+</td>
    </tr>
    <tr>
      <td>Baidu Browser</td>
      <td>7.12</td>
    </tr>
  </tbody>
</table>

<h2 align="center">Get Started</h2>

Include the files in your `index.html`:
```html
<link rel="stylesheet" href="guibot.css" />

<script src="guibot.min.js"></script>
```

<h2 align="center">Usage</h2>

```javascript
var myChat = new guibot.Chat({
  name: 'myChat',
  users: [
    {
      name: 'Robot'
    }, {
      name: 'Me',
      isLocal: true
    }
  ]
});

myChat.say({
  message: 'Hi! I\'m a message from local user',
  userId: myChat.getLocalUser().id
});
```

<h2 align="center">Developing</h2>

Install dependencies, build the source files and preview

```shell
git clone https://github.com/Naimikan/guibot.git
npm install
grunt && grunt preview
```
