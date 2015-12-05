var evtSource = new EventSource('/events');
var eventList = document.getElementById('events');

evtSource.addEventListener('pullRequest', function(evt) {
  var pullRequest = JSON.parse(evt.data);
  console.debug('pullRequest:', pullRequest);
  addToList(pullRequest)
}, false);

function addToList (pullRequest) {
  eventList.appendChild(createMediaItem(pullRequest));
}

function createMediaItem (pullRequest) {
  var item = document.createElement('li');
  item.className = 'media'

  var left = document.createElement('div');
  left.className = 'media-left';

  var obj = document.createElement('div');
  obj.className = 'media-object';
  obj.appendChild(createPictogram(pullRequest.platform));

  left.appendChild(obj);

  var body = document.createElement('a');
  body.className = 'media-body';
  body.setAttribute('href', toLibrariesUrl(pullRequest));

  var heading = document.createElement('h4');
  heading.className = 'media-heading';
  heading.innerHTML = pullRequest.name;

  var text = document.createElement('p');
  text.innerHTML = pullRequest.platform + ' - ' + pullRequest.name + ' - v' + pullRequest.version;

  body.appendChild(heading);
  body.appendChild(text);

  item.appendChild(left);
  item.appendChild(body);
  return item;
}

function createPictogram (platform) {
  var pictogram = document.createElement('div');
  pictogram.className = 'pictogram pictogram-lg pictogram-' + platform;
  pictogram.setAttribute('title', platform);
  return pictogram;
}

function toLibrariesUrl(pullRequest) {
  return 'http://libraries.io/' + [pullRequest.platform, pullRequest.name].join('/')
}
