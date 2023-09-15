function calculateNextDeparture(scheduleData) {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Convert current time to a numeric representation (e.g., 0028 for 12:28 AM)
    const currentTimeNumeric = currentHours * 100 + currentMinutes;

    let nextDepartureTime = Infinity; // Initialize with a large value
    let nextArrivalTime = '';

    for (let i = 0; i < scheduleData.length; i++) {
        const [departureTime, arrivalTime] = scheduleData[i].map(time => {
            // Convert departure and arrival times to numeric representation
            const [hours, minutes] = time.split(':');
            return parseInt(hours) * 100 + parseInt(minutes);
        });

        // Check if the departure time is greater than the current time and earlier than the previously found next departure
        if (departureTime > currentTimeNumeric && departureTime < nextDepartureTime) {
            nextDepartureTime = departureTime;
            nextArrivalTime = arrivalTime;
        }
    }

    // Format the next departure and arrival times as HH:MM AM/PM
    const formatTime = (timeNumeric) => {
        const hours = Math.floor(timeNumeric / 100);
        const minutes = timeNumeric % 100;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    };

    // Display the next departure and arrival times
    document.getElementById('result').textContent = `Next Departure: ${formatTime(nextDepartureTime)} | Arrival: ${formatTime(nextArrivalTime)}`;

    // Create the table rows for all times
    const tableBody = document.getElementById('schedule-table-body');
    tableBody.innerHTML = '';

    for (let i = 0; i < scheduleData.length; i++) {
        const [departureTime, arrivalTime] = scheduleData[i];
        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `<td>${departureTime}</td><td>${arrivalTime}</td>`;
        tableBody.appendChild(rowElement);
    }
}

fetch('bus_schedule.csv')
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
