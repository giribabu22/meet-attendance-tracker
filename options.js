const data = chrome.storage.sync.get("Meraki_Attendance_Record", (data) => {
  const records = data.Meraki_Attendance_Record;
  console.log(records, "4567890");
  // const tbody = document.querySelector("tbody");

  const eleRoot = document.querySelector("tbody");
  records.forEach(element => {

    const eleTr = document.createElement("tr");
    eleTr.setAttribute('id', 'row-place');
    eleRoot.appendChild(eleTr);

    var eleTd = document.createElement("td");
    eleTd.textContent = `${element.meeting_title}`;
    eleTr.appendChild(eleTd)

    var eleTd = document.createElement("td");
    eleTd.textContent = `${element.attendee_names}`;
    eleTr.appendChild(eleTd)

    var eleTd = document.createElement("td");
    eleTd.textContent = `${JSON.parse(element.attendee_names).length}`;
    eleTr.appendChild(eleTd)

    var eleTd = document.createElement("td");
    eleTd.textContent = `${element.meeting_time.split("T")[1].split(".")[0]}`;
    eleTr.appendChild(eleTd)

    var eleTd = document.createElement("td");
    eleTd.textContent = `${element.meet_duration}`;
    eleTr.appendChild(eleTd)

    var eleTd = document.createElement("td");

    var link = document.createElement('a');
    link.setAttribute('href', `/popup.html?${ JSON.parse(element.attendee_names)}?${JSON.parse(element.attendedDurationInSec)}`);
    link.textContent = `View Details`;

    eleTd.appendChild(link)
    eleTr.appendChild(eleTd);

    var eleTd = document.createElement("td");
    var eleImg = document.createElement("img")
    eleImg.setAttribute('src','images/remove.svg')
    eleTd.appendChild(eleImg)
    eleTr.appendChild(eleTd)
  });
});

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

// document.getElementById("myBtn").addEventListener("click", myFunction);


// function mouseOver() {
//   document.getElementById("demo").style.color = "red";
// }

// function mouseOut() {
//   document.getElementById("demo").style.color = "black";
// }