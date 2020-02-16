window.onload = function() {
  chrome.storage.sync.get(['paths', 'hosts', 'regexes'], function({ paths, hosts, regexes }) {
    if (Array.isArray(paths)) {
      paths.forEach(writePathOnScreen);
    }
    if (Array.isArray(hosts)) {
      hosts.forEach(writeHostOnScreen);
    }
    if (Array.isArray(regexes)) {
      regexes.forEach(writeRegexOnScreen);
    }
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', deleteItem);
    });
  });
};

document.querySelector('#newPathForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nameElement = document.getElementById('newPathName');
  const name = nameElement.value;
  const idElement = document.getElementById('newPathId');
  const id = idElement.value;
  if (name.length && id.length) {
    nameElement.value = '';
    idElement.value = '';
    const newPath = { name, id };
    chrome.storage.sync.get(['paths'], function({ paths }) {
      const newPaths = Array.isArray(paths) ? [...paths, newPath] : [newPath];
      chrome.storage.sync.set({ paths: newPaths }, () => {
        writePathOnScreen({ name, id });
      });
    });
  }
});

writePathOnScreen = function({ name, id }) {
  const section = document.getElementById('paths');
  const index = section.childElementCount + 1;
  const prefix = index <= 9 ? index + ': ' : '-: ';
  const text = document.createTextNode(`${prefix}${id} (${name}) `);
  const pTag = document.createElement('P');
  pTag.appendChild(text);
  pTag.appendChild(createDeleteButton());
  pTag.setAttribute('class', 'path');
  pTag.addEventListener('click', deleteItem);
  section.appendChild(pTag);
};

document.querySelector('#newHostForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nameElement = document.getElementById('newHostName');
  const name = nameElement.value;
  const idElement = document.getElementById('newHostId');
  const id = idElement.value;
  if (name.length && id.length) {
    nameElement.value = '';
    idElement.value = '';
    const newHost = { name, id };
    chrome.storage.sync.get(['hosts'], function({ hosts }) {
      const newHosts = Array.isArray(hosts) ? [...hosts, newHost] : [newHost];
      chrome.storage.sync.set({ hosts: newHosts }, () => {
        writeHostOnScreen({ name, id });
      });
    });
  }
});

writeHostOnScreen = function({ name, id }) {
  const section = document.getElementById('hosts');
  const index = section.childElementCount + 1;
  const prefix = index <= 26 ? String.fromCharCode(index + 96) + ': ' : '-: ';
  const text = document.createTextNode(`${prefix}${id} (${name}) `);
  const pTag = document.createElement('P');
  pTag.appendChild(text);
  pTag.appendChild(createDeleteButton());
  pTag.setAttribute('class', 'host');
  pTag.addEventListener('click', deleteItem);
  section.appendChild(pTag);
};

document.querySelector('#newRegexForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nameElement = document.getElementById('newRegexName');
  const name = nameElement.value;
  const idElement = document.getElementById('newRegexId');
  const id = idElement.value;
  if (name.length && id.length) {
    nameElement.value = '';
    idElement.value = '';
    const newRegex = { name, id };
    chrome.storage.sync.get(['regexes'], function({ regexes }) {
      const newRegexes = Array.isArray(regexes) ? [...regexes, newRegex] : [newRegex];
      chrome.storage.sync.set({ regexes: newRegexes }, () => {
        writeRegexOnScreen({ name, id });
      });
    });
  }
});

writeRegexOnScreen = function({ name, id }) {
  const section = document.getElementById('regexes');
  const text = document.createTextNode(`/${id}/, /${name}/ `);
  const pTag = document.createElement('P');
  pTag.appendChild(text);
  pTag.appendChild(createDeleteButton());
  pTag.setAttribute('class', 'regex');
  pTag.addEventListener('click', deleteItem);
  section.appendChild(pTag);
};

createDeleteButton = function() {
  const deleteButton = document.createElement('BUTTON');
  const deleteText = document.createTextNode(`x`);
  deleteButton.appendChild(deleteText);
  deleteButton.setAttribute('class', 'delete');
  return deleteButton;
};

deleteItem = function(e) {
  const section = e.target.parentElement.parentElement;
  const index = [...section.children].indexOf(e.target.parentElement);
  const itemType = section.id;
  chrome.storage.sync.get([`${itemType}`], result => {
    result[itemType].splice(index, 1);
    chrome.storage.sync.set(result, () => {
      location.reload();
    });
  });
};

// Functions for rearranging paths and hosts

// Functions for deleting paths and hosts
