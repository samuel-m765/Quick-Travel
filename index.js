const apiUrl = "http://localhost:3000/tickets";

// DOM Elements
const ticketForm = document.getElementById("ticket-form");
const historyBtn = document.getElementById("view-history-btn");
const ticketHistoryDiv = document.getElementById("ticket-history");
const historyTableBody = document.getElementById("history-table-body");

// Function to fetch ticket history and display it
function fetchTicketHistory() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      historyTableBody.innerHTML = ""; // Clear existing data
      data.forEach(ticket => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${ticket.ticketId}</td>
          <td>${ticket.name}</td>
          <td>${ticket.seat}</td>
          <td>${ticket.date}</td>
          <td>${ticket.from}</td>
          <td>${ticket.to}</td>
          <td>
            <button onclick="deleteTicket('${ticket.ticketId}')">Delete</button>
            <button onclick="openUpdateTicketForm('${ticket.ticketId}')">Update</button>
          </td>
        `;
        historyTableBody.appendChild(row);
      });
    })
    .catch(err => console.error("Error fetching ticket history:", err));
}

// Function to submit a new ticket
ticketForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get input values
  const name = document.getElementById("name").value;
  const seat = document.getElementById("seat").value;
  const date = document.getElementById("date").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  // Create ticket object
  const newTicket = { name, seat, date, from, to };

  // Send POST request to create a new ticket
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTicket),
  })
    .then(response => response.json())
    .then(data => {
      alert("Ticket booked successfully!");
      ticketForm.reset(); // Reset the form
      fetchTicketHistory(); // Refresh ticket history
    })
    .catch(err => console.error("Error booking ticket:", err));
});

// Event listener for the "View History" button
historyBtn.addEventListener("click", function () {
  ticketHistoryDiv.style.display = "block"; // Show ticket history
  fetchTicketHistory(); // Fetch and display ticket history
});

// Function to delete a ticket
function deleteTicket(ticketId) {
  if (confirm("Are you sure you want to delete this ticket?")) {
    fetch(`${apiUrl}/${ticketId}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Ticket deleted successfully!");
        fetchTicketHistory(); // Refresh ticket history
      })
      .catch(err => console.error("Error deleting ticket:", err));
  }
}

// Function to open the update form and pre-fill the fields with ticket data
function openUpdateTicketForm(ticketId) {
  fetch(`${apiUrl}/${ticketId}`)
    .then(response => response.json())
    .then(ticket => {
      // Prefill the form with the ticket details
      document.getElementById("name").value = ticket.name;
      document.getElementById("seat").value = ticket.seat;
      document.getElementById("date").value = ticket.date;
      document.getElementById("from").value = ticket.from;
      document.getElementById("to").value = ticket.to;

      // Change the form action to update mode by adding an event listener for submit
      ticketForm.onsubmit = function (e) {
        e.preventDefault();

        // Get updated values
        const updatedTicket = {
          name: document.getElementById("name").value,
          seat: document.getElementById("seat").value,
          date: document.getElementById("date").value,
          from: document.getElementById("from").value,
          to: document.getElementById("to").value,
        };

        // Send PATCH request to update the ticket
        fetch(`${apiUrl}/${ticketId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTicket),
        })
          .then(response => response.json())
          .then(() => {
            alert("Ticket updated successfully!");
            ticketForm.reset(); // Reset the form
            fetchTicketHistory(); // Refresh ticket history
          })
          .catch(err => console.error("Error updating ticket:", err));
      };
    })
    .catch(err => console.error("Error fetching ticket data for update:", err));
}