window.onload = function() {
  chrome.storage.sync.get(['paths', 'hosts'], function({ paths, hosts }) {
    if (Array.isArray(paths)) {
      paths.forEach(writePathOnScreen);
    }
    if (Array.isArray(hosts)) {
      hosts.forEach(writeHostOnScreen);
    }
    const hostBox = document.getElementById('hostSelect');
    chrome.storage.sync.get(['selectedHost'], function({ selectedHost }) {
      if (selectedHost > hosts.length || selectedHost < 1) selectedHost = 1;
      hostBox.selectedIndex = selectedHost - 1;
    });
    hostBox.addEventListener('change', e => {
      changeHost(e.target.selectedIndex + 1);
    });
  });
};

document.addEventListener('keydown', e => {
  const hostBox = document.getElementById('hostSelect');
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const newHost = e.keyCode - 64;
    hostBox.selectedIndex = newHost - 1;
    changeHost(newHost);
  } else if (e.keyCode >= 49 && e.keyCode <= 57) {
    const pathIndex = e.keyCode - 48;
    launchPath(pathIndex);
  } else if ((e.keyCode = 48)) {
    switchHostOfCurrUrl();
  }
});

function changeHost(newHost) {
  chrome.storage.sync.set({ selectedHost: newHost }, () => {});
}

document.querySelector('#settingsLink').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

launchPath = function(pathIndex) {
  chrome.storage.sync.get(['selectedHost', 'paths', 'hosts'], function({ selectedHost, paths, hosts }) {
    const url = `http://${hosts[selectedHost - 1].name}${paths[pathIndex - 1].name}`;
    window.open(url, 'blank');
  });
};

writePathOnScreen = function({ name, id }) {
  const section = document.getElementById('paths');
  const index = section.childElementCount + 1;
  const prefix = index <= 9 ? index + ': ' : '-: ';
  const text = document.createTextNode(`${prefix}${id}`);
  const bTag = document.createElement('BUTTON');
  bTag.appendChild(text);
  bTag.addEventListener('click', () => {
    launchPath(index);
  });
  section.appendChild(bTag);
};

writeHostOnScreen = function({ name, id }) {
  const section = document.getElementById('hostSelect');
  const index = section.childElementCount + 1;
  const prefix = index <= 26 ? String.fromCharCode(index + 96) + ': ' : '-: ';
  const text = document.createTextNode(`${prefix}${id}`);
  const oTag = document.createElement('OPTION');
  oTag.appendChild(text);
  section.appendChild(oTag);
};
