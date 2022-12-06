chrome.runtime.sendMessage({ doIt: "colorExtIcon" });

let studentDetails = new Map();
let studentsNameSet = new Set();
let ui_buttons;
let totalClassDuration = 0;
let goingToStop = 0;
let isAttendanceWorking = false;
let buttonClickInd = 0;
let startTime;
// let flag = false;
let flag = true;
let meetingDuration;

async function start() {
  startTime = new Date();
  startAttendanceTracker = setInterval(attendanceTracker, 1000);
}

// to get the meeting name/title
const getMeetingName = () => {
  const elm = document.querySelector("[data-meeting-title]");
  if (elm && elm.dataset.meetingTitle) {
    return elm.dataset.meetingTitle;
  }
  return document.title;
};

let stop = (STOP = () => {
  clearInterval(startAttendanceTracker);
  let meetingCode = window.location.pathname.substring(1);
  let date = new Date();
  let dd = date.getDate();
  let mm = date.toLocaleString("default", { month: "short" });
  let yyyy = date.getFullYear();
  date = dd + "-" + mm + "-" + yyyy;
  let sortedtstudentsNameSet = [];
  let studentsAttendedDuration = [];
  //   let studentsJoiningTime = [];
  let mapKeys = studentDetails.keys();
  for (i = 0; i < studentDetails.size; i++) {
    let studentName = mapKeys.next().value;
    sortedtstudentsNameSet.push(studentName);
  }
  sortedtstudentsNameSet.sort();
  for (studentName of sortedtstudentsNameSet) {
    let data = studentDetails.get(studentName);
    studentsAttendedDuration.push(data[0].toString());
    // studentsJoiningTime.push(data[1]);
  }
  const end_time = new Date();
  var record = {
    attendee_names: JSON.stringify(sortedtstudentsNameSet),
    attendedDurationInSec: JSON.stringify(studentsAttendedDuration),
    meet_code: meetingCode,
    meeting_title: getMeetingName().replace("Meet - ", ""),
    meeting_time: startTime.toISOString(),
  };

  console.log(record, "Attendance Record");

  setTimeout(() => {
    const api = "http://localhost:5000/attendance"; // endpoint where this data will go

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })
      .then((response) => response.json())
      .then((string) => {
        console.log(`Title of our response :  ${string.title}`);
        window.open(addon.extension.getURL("interface.html"));
        // runtime.openOptionsPage()
      })
      .catch((error) => {
        console.log(error);
      });
  }, 2000);
  record.meet_duration = meetingDuration;

  let newRecord;
  const oldRecord = chrome.storage.sync.get(
    "Meraki_Attendance_Record",
    (data) => {
      const oldData = data.Meraki_Attendance_Record;

      if (!oldData) {
        const setData = chrome.storage.sync.set({
          Meraki_Attendance_Record: [record],
        });
      } else {
        oldData.push(record);
        chrome.storage.sync.set({
          Meraki_Attendance_Record: oldData,
        });
      }
    }
  );
});

function attendanceTracker() {
  let currentlyPresentStudents = document.getElementsByClassName("zWGUib");
  if (currentlyPresentStudents.length > 0) {
    studentsNameSet.clear();
    let numberOfjoinedStudents = -1;
    try {
      numberOfjoinedStudents = Number(
        document.getElementsByClassName("uGOf1d")[1].innerHTML
      );
      numberOfjoinedStudents =
        Number.isInteger(numberOfjoinedStudents) &&
        numberOfjoinedStudents > 0 &&
        numberOfjoinedStudents != -1
          ? numberOfjoinedStudents
          : currentlyPresentStudents.length;
    } catch (e) {
      numberOfjoinedStudents = currentlyPresentStudents.length;
    }
    for (i = 0; i < numberOfjoinedStudents; i++) {
      try {
        studentsNameSet.add(
          currentlyPresentStudents[i].innerHTML.toUpperCase()
        );
      } catch (exception) {}
    }
    for (studentName of studentsNameSet) {
      if (studentDetails.has(studentName)) {
        let data = studentDetails.get(studentName);
        data[0] += 1;
        studentDetails.set(studentName, data);
      } else {
        let joiningTime = new Date().toLocaleTimeString();
        let currStatus = 1;
        let data = [];
        data.push(currStatus);
        data.push(joiningTime);
        studentDetails.set(studentName, data);
      }
    }
    if (studentsNameSet.size - 1 == -1) {
      goingToStop += 1;
    } else {
      meetingDuration = toTimeFormat(totalClassDuration);
      newButton.innerHTML = toTimeFormat(totalClassDuration);
      totalClassDuration += 1;
      goingToStop = 0;
    }
    if (goingToStop == 2) {
      isAttendanceWorking = false;
      newButton.innerHTML = "Track Attendance";
      newButton.style.border = "2px solid #C5221F";
      goingToStop = 0;
      stop();
    }
  } else {
    try {
      ui_buttons[buttonClickInd % ui_buttons.length].click();
      buttonClickInd += 1;
      goingToStop = 0;
    } catch (error) {
      goingToStop += 1;
      if (goingToStop == 2) {
        isAttendanceWorking = false;
        newButton.innerHTML = "Track Attendance";
        newButton.style.border = "2px solid #C5221F";
        goingToStop = 0;
        stop();
      }
    }
  }
}

async function merakiClassChecker(url) {
  const API_URL = "https://dev-api.navgurukul.org/classes";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxNjU1IiwiZW1haWwiOiJtYWhlbmRyYTIxQG5hdmd1cnVrdWwub3JnIiwiaWF0IjoxNjY5Nzg5MjQ4LCJleHAiOjE3MDEzNDY4NDh9.skpbASGKogaOAsngnD1P1tUHx8F0wLGC6uR2YLPXK5g";

  const data = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "version-code": 99,
    },
  });
  const parsed_data = await data.json();
  for (let ind = 0; ind < parsed_data.length; ind++) {
    if (parsed_data[ind].meet_link === url) {
      flag = true;
      break;
    }
  }
  return flag;
}

let meet_url = window.location.href;
const checked_url = merakiClassChecker(meet_url);
checked_url.then((result) => {
  if (result) {
    setInterval(insertButton, 1000);
  }
});

// Adding button to meet ui
let newButton = document.createElement("button");
newButton.id = "newButton";
newButton.className = "Jyj1Td CkXZgc";
newButton.type = "button";
newButton.innerHTML = "Record";
newButton.style.border = "none";
newButton.style.backgroundColor = "#ea4335";
newButton.style.color = "white";
newButton.style.height = "2.6rem";
newButton.style.width = "4.2rem";
newButton.style.borderRadius = "30px";

function insertButton() {
  try {
    ui_buttons = document.getElementsByClassName("VfPpkd-kBDsod NtU4hc");
    // ui_buttons[1].click();
    document.getElementsByClassName("Tmb7Fd")[0].appendChild(newButton);
    if (!isAttendanceWorking) {
      isAttendanceWorking = true;
      newButton.style.backgroundColor = "#00796b";
      StartTime = new Date().toLocaleTimeString();
      studentDetails.clear();
      studentsNameSet.clear();
      totalClassDuration = 0;
      start();
    }

    document
      .getElementsByClassName("Gt6sbf QQrMi")
      .addEventListener("click", function () {
        if (isAttendanceWorking) {
          stop();
        }
      });
    clearInterval(tryInsertingButton);
  } catch (error) {}
}

function toTimeFormat(time) {
  hh = Math.floor(time / 3600);
  time = time - hh * 3600;
  mm = Math.floor(time / 60);
  time = time - mm * 60;
  ss = time;
  if (hh == 0) return mm + " : " + ss;
  else return hh + " : " + mm + " : " + ss;
}
