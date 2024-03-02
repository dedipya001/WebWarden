function CloseTab(duration) {
    alert(`This URL is blocked for ${duration} minutes. This tab will close after you press OK`)
    chrome.runtime.sendMessage({ CloseMe: true })
}

document.getElementById('blockBtn').addEventListener('click', function() {
    const duration = parseInt(document.getElementById('duration').value);
    if (isNaN(duration) || duration <= 0) {
        alert("Please enter a valid duration in minutes.");
        return;
    }

    const currentTime = new Date().getTime();
    const endTime = currentTime + duration * 60 * 1000;

    chrome.storage.local.set({ 'blockedUntil': endTime });

    CloseTab(duration);
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.subject === "startTimer") {
        chrome.storage.local.get('blockedUntil', (data) => {
            if (data.blockedUntil && new Date().getTime() < data.blockedUntil) {
                const duration = Math.ceil((data.blockedUntil - new Date().getTime()) / (60 * 1000));
                CloseTab(duration);
            }
        });
    }
});

function CloseTab() {
    alert("This URL is completely blocked for today. This tab will close after you press OK")
    chrome.runtime.sendMessage({ CloseMe: true })
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.subject === "startTimer") {

        var hour = 0;
        var min = 0;
        var sec = 5;

        var div = document.createElement("div")
        div.innerHTML = `
            <div class="WWtopItem">
                <h1>Stay Productive</h1>
                <div class="WWtopItemMain">
                    <div class="WWInfo">
                        <p>You are currently on :</p>
                        <h4 id="WWurl">${window.location.hostname}</h4>
                    </div>
                </div>
            </div>
    
            <div class="WWbottomItem">
                <div class="WWtimeCont">
                    <p>Time Remaining</p>
                    <div class="WWtime">
                        <div class="WWnumber">
                            <p id="WWhour">${("0" + hour).slice(-2)}</p>
                        </div>
                        <span>:</span>
        
                        <div class="WWnumber">
                            <p id="WWmin">${("0" + min).slice(-2)}</p>
                        </div>
                        <span>:</span>
        
                        <div class="WWnumber">
                            <p id="WWsec">${("0" + sec).slice(-2)}</p>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.prepend(div)

        setInterval(() => {
            if (sec >= 1) {
                sec = sec - 1
                document.getElementById("WWsec").innerText = ("0" + sec).slice(-2)
            }
            else {
                CloseTab()
            }
        }, 1000);

    }
})

chrome.storage.local.get("BlockedUrls", (data) => {
    if (data.BlockedUrls !== undefined) {
        if (data.BlockedUrls.some((e) => e.url === window.location.hostname && e.status === "BLOCKED")) {
            CloseTab()
        }
    }
})
