// Function to navigate to a different page
function navigateTo(page) {
    window.location.href = page;
}

// Function to format time as HH:MM AM/PM
function formatTime(timeNumeric) {
    const hours = Math.floor(timeNumeric / 100);
    const minutes = timeNumeric % 100;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

function calculateNextDeparture(scheduleData) {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeNumeric = currentHours * 100 + currentMinutes;
    let nextDepartureTime = Infinity;
    let nextArrivalTime = '';
    for (let i = 0; i < scheduleData.length; i++) {
        const [departureTime, arrivalTime] = scheduleData[i].map(time => {
            const [hours, minutes] = time.split(':');
            return parseInt(hours) * 100 + parseInt(minutes);
        });
        if (departureTime > currentTimeNumeric && departureTime < nextDepartureTime) {
            nextDepartureTime = departureTime;
            nextArrivalTime = arrivalTime;
        }
    }
    document.getElementById('current-time').textContent = `Current Time: ${formatTime(currentTimeNumeric)}`;
    document.getElementById('result').textContent = `Next Departure: ${formatTime(nextDepartureTime)} | Arrival: ${formatTime(nextArrivalTime)}`;
    const tableBody = document.getElementById('schedule-table-body');
    tableBody.innerHTML = '';
    for (let i = 0; i < scheduleData.length; i++) {
        const [departureTime, arrivalTime] = scheduleData[i];
        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `<td>${departureTime}</td><td>${arrivalTime}</td>`;
        tableBody.appendChild(rowElement);
    }
}

// Determine the route based on the current page URL
const currentPageUrl = window.location.href;
let scheduleCsvFile;

if (currentPageUrl.includes('route1.html')) {
    scheduleCsvFile = 'route1_schedule.csv'; // Change this to the filename for Route 1
} else if (currentPageUrl.includes('route2.html')) {
    scheduleCsvFile = 'route2_schedule.csv'; // Change this to the filename for Route 2
} else if (currentPageUrl.includes('route3.html')) {
    scheduleCsvFile = 'route3_schedule.csv'; // Change this to the filename for Route 3
}else if (currentPageUrl.includes('route4.html')) {
    scheduleCsvFile = 'route4_schedule.csv'; // Change this to the filename for Route 4
}

// Load the appropriate CSV file and calculate next departure
fetch(scheduleCsvFile)
    .then(response => response.text())
    .then(csvData => {
        const rows = csvData.split('\n');
        const scheduleData = [];
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            scheduleData.push(columns);
        }
        calculateNextDeparture(scheduleData);
    })
    .catch(error => console.error('Error:', error));
