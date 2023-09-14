// Function to format time as AM/PM
function formatAMPM(time) {
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours);
    const ampm = parsedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = parsedHours % 12 === 0 ? '12' : (parsedHours % 12).toString();
    return `${formattedHours}:${minutes} ${ampm}`;
}

// Function to calculate the next departure time
function calculateNextDeparture(scheduleData) {
    // Get the current time
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Convert current time to a string in HH:MM format
    const currentTimeString = `${currentHours}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

    // Find the next departure time and its corresponding arrival time
    let nextDeparture = "No more departures today";
    let nextArrival = "";

    for (let i = 0; i < scheduleData.length; i++) {
        const row = scheduleData[i];
        const departureTime = row[0]; // Departure time is the first column
        const arrivalTime = row[1];   // Arrival time is the second column

        if (departureTime > currentTimeString) {
            nextDeparture = formatAMPM(departureTime);
            nextArrival = formatAMPM(arrivalTime);
            break;
        }
    }

    // Display the result
    document.getElementById('result').textContent = `Next Departure: ${nextDeparture} | Arrival: ${nextArrival}`;

    // Create the table rows for all times
    const tableBody = document.querySelector('#schedule-table-body');
    tableBody.innerHTML = '';

    for (let i = 0; i < scheduleData.length; i++) {
        const row = scheduleData[i];
        const departureTime = formatAMPM(row[0]);
        const arrivalTime = formatAMPM(row[1]);

        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `<td>${departureTime}</td><td>${arrivalTime}</td>`;
        tableBody.appendChild(rowElement);
    }
}

// Fetch and parse the CSV file
fetch('bus_schedule.csv')
    .then(response => response.text())
    .then(csvData => {
        // Parse the CSV data
        const rows = csvData.split('\n');
        const scheduleData = [];

        for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
            const columns = rows[i].split(',');
            scheduleData.push(columns);
        }

        // Call the function to calculate and format the next departure and arrival times
        calculateNextDeparture(scheduleData);
    })
    .catch(error => console.error('Error:', error));
