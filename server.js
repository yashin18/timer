<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timer Control</title>
    <style>
        .timer { font-size: 2em; font-weight: bold; }
        .big-button { font-size: 1.5em; padding: 10px 20px; background-color: blue; color: white; border: none; cursor: pointer; }
    </style>
    <script>
        const ws = new WebSocket("wss://countdown-ws.onrender.com");

        let timer1Running = false;
        let timer1Paused = false;
        let timer2Running = false;

        ws.onopen = () => console.log("Connected to WebSocket server.");
        ws.onerror = (err) => console.error("WebSocket Error:", err);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.timer === 1) {
                document.getElementById("displayTimer1").textContent = formatTime(data.time);
            } else if (data.timer === 2) {
                document.getElementById("displayTimer2").textContent = formatTime(data.time);
            }
        };

        function formatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return "0:00";
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            return `${min}:${sec < 10 ? "0" : ""}${sec}`;
        }

        function startPauseTimer1() {
            if (!timer1Running) {
                let time = parseInt(document.getElementById("timer1Input").value) * 60 || 0;
                ws.send(JSON.stringify({ action: "start", timer: 1, time }));
                document.getElementById("startPauseTimer1").textContent = "Pause";
                timer1Running = true;
                timer1Paused = false;
            } else if (!timer1Paused) {
                ws.send(JSON.stringify({ action: "pause", timer: 1 }));
                document.getElementById("startPauseTimer1").textContent = "Start";
                timer1Paused = true;
            } else {
                ws.send(JSON.stringify({ action: "resume", timer: 1 }));
                document.getElementById("startPauseTimer1").textContent = "Pause";
                timer1Paused = false;
            }
        }

        function startStopTimer2() {
            if (!timer2Running) {
                let time = parseInt(document.getElementById("timer2Input").value) || 0;
                ws.send(JSON.stringify({ action: "start", timer: 2, time }));
                document.getElementById("startStopTimer2").textContent = "Stop";
                timer2Running = true;
            } else {
                ws.send(JSON.stringify({ action: "stop", timer: 2 }));
                document.getElementById("startStopTimer2").textContent = "Start";
                timer2Running = false;
            }
        }
    </script>
</head>
<body>
    <h2>Timer 1 (Minutes)</h2>
    <input type="number" id="timer1Input" placeholder="Enter minutes">
    <button id="startPauseTimer1" onclick="startPauseTimer1()">Start</button>
    <div class="timer" id="displayTimer1">0:00</div>

    <h2>Timer 2 (Seconds)</h2>
    <input type="number" id="timer2Input" placeholder="Enter seconds">
    <button id="startStopTimer2" class="big-button" onclick="startStopTimer2()">Start</button>
    <div class="timer" id="displayTimer2">0:00</div>
</body>
</html>
