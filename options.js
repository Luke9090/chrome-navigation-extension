window.onload = function() {
  chrome.storage.sync.get(['paths', 'hosts'], function({ paths, hosts }) {
    if (Array.isArray(paths)) {
      paths.forEach(writePathOnScreen);
    }
    if (Array.isArray(hosts)) {
      hosts.forEach(writeHostOnScreen);
    }
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
  const text = document.createTextNode(`${index}: ${id} (${name})`);
  const pTag = document.createElement('P');
  pTag.appendChild(text);
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
  const index = String.fromCharCode(section.childElementCount + 97);
  const text = document.createTextNode(`${index}: ${id} (${name})`);
  const pTag = document.createElement('P');
  pTag.appendChild(text);
  section.appendChild(pTag);
};

// Functions for rearranging paths and hosts

// Functions for deleting paths and hosts
