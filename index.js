document.addEventListener('DOMContentLoaded', () => {
  const reservationForm = document.getElementById('reservation-form');
  const viewHistoryBtn = document.getElementById('view-history-btn');
  const reservationHistory = document.getElementById('reservation-history');
  const historyTableBody = document.getElementById('history-table-body');
  const locationFilter = document.getElementById('location-filter');

  let allTickets = []; 


  reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ticket = {
          name: document.getElementById('name').value,
          seat: document.getElementById('seat').value,
          date: document.getElementById('date').value,
          from: document.getElementById('from').value,
          to: document.getElementById('to').value,
          status: 'Booked' 
      };

      fetch('http://localhost:3000/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticket)
      })
      .then(response => response.json())
      .then(data => {
          alert('Ticket reservation successful!');
          reservationForm.reset();
          if (reservationHistory.style.display === 'block') fetchTickets();
      })
      .catch(error => console.error('Error creating ticket:', error));
  });


  viewHistoryBtn.addEventListener('click', () => {
      if (reservationHistory.style.display === 'none' || reservationHistory.style.display === '') {
          fetchTickets();
          reservationHistory.style.display = 'block';
          viewHistoryBtn.textContent = 'Hide History';
      } else {
          reservationHistory.style.display = 'none';
          viewHistoryBtn.textContent = 'View History';
      }
  });

  
  locationFilter.addEventListener('change', () => {
      const selectedDestination = locationFilter.value;

      renderTickets(selectedDestination ? allTickets.filter(ticket => ticket.to === selectedDestination) : allTickets);
  });

  
  function fetchTickets() {
      fetch('http://localhost:3000/tickets')
          .then(response => response.json())
          .then(tickets => {
              allTickets = tickets;
              renderTickets(tickets);
          })
          .catch(error => console.error('Error fetching tickets:', error));
  }

  
  function renderTickets(tickets) {
      historyTableBody.innerHTML = '';
      tickets.forEach(ticket => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${ticket.id}</td>
              <td>${ticket.name}</td>
              <td>${ticket.seat}</td>
              <td>${ticket.date}</td>
              <td>${ticket.from}</td>
              <td>${ticket.to}</td>
              <td>${ticket.status}</td>
              <td>
                  <button class="edit-btn" data-id="${ticket.id}">Edit</button>
                  <button class="cancel-btn" data-id="${ticket.id}">Cancel</button>
              </td>
          `;
          historyTableBody.appendChild(row);
      });

      // Add event listeners for edit and cancel buttons
      document.querySelectorAll('.edit-btn').forEach(button => {
          button.addEventListener('click', (e) => {
              const id = e.target.getAttribute('data-id');
              editTicket(id);
          });
      });

      document.querySelectorAll('.cancel-btn').forEach(button => {
          button.addEventListener('click', (e) => {
              const id = e.target.getAttribute('data-id');
              cancelTicket(id);
          });
      });
  }

  // Edit ticket (PATCH)
  function editTicket(id) {
      const ticket = allTickets.find(t => t.id == id);
      const newName = prompt('Enter new name:', ticket.name);
      if (newName) {
          fetch(`http://localhost:3000/tickets/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newName })
          })
          .then(() => {
              alert('Ticket updated!');
              fetchTickets();
          })
          .catch(error => console.error('Error updating ticket:', error));
      }
  }

  // Cancel ticket (DELETE)
  function cancelTicket(id) {
      fetch(`http://localhost:3000/tickets/${id}`, {
          method: 'DELETE'
      })
      .then(() => {
          alert('Ticket cancelled!');
          fetchTickets();
      })
      .catch(error => console.error('Error cancelling ticket:', error));
  }
});