function chtime() {
    const timeNow = new Date();
    let hour = timeNow.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const min = String(timeNow.getMinutes()).padStart(2, '0');
    const second = String(timeNow.getSeconds()).padStart(2, '0');
    const formattedTime = `${hour}:${min}:${second} ${ampm}`;
    document.getElementById("time").innerText = formattedTime;
}

chtime();
setInterval(chtime, 1000);