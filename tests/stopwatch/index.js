let milliesecond = 0;
let intervalId;



function display(ml) {
    let hours = Math.floor(ml / (1000 * 60 * 60));
    let minutes = Math.floor((ml / (1000 * 60)) % 60);
    let seconds = Math.floor((ml / 1000) % 60);
    let milliseconds = ml % 1000;
    document.getElementById("time").textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}

const start = function() {
    intervalId = setInterval(() => {
        milliesecond += 10;
        display(milliesecond);
    }, 10);
};


const re = () => {document.getElementById("time").textContent = "00:00:00:00";
    milliesecond = 0;
};

const stop = function() {
    clearInterval(intervalId);
};

