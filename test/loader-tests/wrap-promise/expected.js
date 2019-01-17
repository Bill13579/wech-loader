(new Promise((resolve, reject) => { chrome.tabs.move(TAB_ID,  {
    windowId: WINDOW_ID, 
    index: MOVE_INDEX
}, (...a) => { if (chrome.runtime.lastError) { reject(chrome.runtime.lastError.message); } else { resolve(...a); } }); }));
