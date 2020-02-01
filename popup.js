window.onload = function() {
  let hostBox = document.getElementById('hostSelect');
  chrome.storage.sync.get(['selectedHost'], function(result) {
    if (result.selectedHost) {
      hostBox.selectedIndex = result.selectedHost;
      changeHost(result.selectedHost);
    }
  });
  hostBox.addEventListener('change', e => {
    console.dir(e);
    changeHost(e.target.selectedIndex);
  });
};

document.addEventListener('keydown', e => {
  let hostBox = document.getElementById('hostSelect');
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    let newHost = e.keyCode - 65;
    hostBox.selectedIndex = newHost;
    changeHost(newHost);
  } else if (e.keyCode >= 49 && e.keyCode <= 57) {
    let pathLinks = document.getElementsByClassName('pathLink');
    let linkIndex = e.keyCode - 49;
    let url = pathLinks[linkIndex].href;
    window.open(url, 'blank');
  }
});

function changeHost(newHost) {
  let hostBox = document.getElementById('hostSelect');
  chrome.storage.sync.set({ selectedHost: newHost }, () => {});
  let newHostName = hostBox.children[newHost].value;
  let pathLinks = document.getElementsByClassName('pathLink');
  for (let i = 0; i < pathLinks.length; i++) {
    let currHref = pathLinks[i].href;
    let currPath = new URL(currHref).pathname;
    pathLinks[i].href = newHostName + currPath;
  }
}
