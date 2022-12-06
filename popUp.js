let arr = window.location.href.split('?')// current url

// This condition make the different for the popUp window and from the  student data view
if (arr.length >= 2){
    
    let names = arr[1].split(',')
    const time = arr[2].split(',')
    console.log(names,time);

    // connecting the element
    let eleRoot = document.getElementById('history') 

    //adding student's in view table Headers
    const eleTr = document.createElement("tr"); 
    eleRoot.appendChild(eleTr);

    var eleTd = document.createElement("th");
    eleTd.textContent = `Total students names`;
    eleTr.appendChild(eleTd)

    var eleTd = document.createElement("th");
    eleTd.textContent = `Class Duration of the students`;
    eleTr.appendChild(eleTd)

    // adding student's in view table Data
    names.forEach(element => {                    
        const eleTr = document.createElement("tr");
        eleRoot.appendChild(eleTr);

        // const eleTr = document.createElement("tr");
        // eleTr.setAttribute('id', 'history');
        // eleRoot.appendChild(eleTr);

        var eleTd = document.createElement("td");
        eleTd.textContent = `${ element.replace('%20',' ')}`;
        eleTr.appendChild(eleTd)

        var eleTd = document.createElement("td");
        eleTd.textContent = `${time[names.indexOf(element)]} Sec`;
        eleTr.appendChild(eleTd)

        // var eleTd = document.createElement("td");
        // eleTd.textContent = `${JSON.parse(element.attendee_names).length}`;
        // eleTr.appendChild(eleTd)

        // var eleTd = document.createElement("td");
        // eleTd.textContent = `${element.meeting_time.split("T")[1].split(".")[0]}`;
        // eleTr.appendChild(eleTd)

        // var eleTd = document.createElement("td");
        // eleTd.textContent = `${element.meet_duration}`;
        // eleTr.appendChild(eleTd)

        // var eleTd = document.createElement("td");

        // var link = document.createElement('a');
        // link.setAttribute('href', `/popup.html?${JSON.parse(element.attendee_names)}?${JSON.parse(element.attendedDurationInSec)}`);
        // link.textContent = `View Details`;

        // eleTd.appendChild(link)
        // eleTr.appendChild(eleTd);

        // var eleTd = document.createElement("td");
        // var eleImg = document.createElement("img")
        // eleImg.setAttribute('src', 'images/remove.svg')
        // eleTd.appendChild(eleImg)
        // eleTr.appendChild(eleTd)
    });
}
