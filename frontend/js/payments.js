// Payments page functions
window.addEventListener('DOMContentLoaded', async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  loadPayments();

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await processPayment();
    });
  }
});

async function loadPayments() {
  try {
    // Load payment summary
    const summary = await apiCall('/payments/summary');
    if (summary) {
      document.getElementById('totalPaid').textContent = '₦' + (summary.total_paid || 0).toFixed(2);
      document.getElementById('totalPending').textContent = '₦' + (summary.total_pending || 0).toFixed(2);
      document.getElementById('totalTransactions').textContent = summary.total_transactions || 0;
    }

    // Load payment history
    const payments = await apiCall('/payments');
    const tbody = document.getElementById('paymentsBody');
    const noPayments = document.getElementById('noPayments');

    if (payments.length === 0) {
      noPayments.style.display = 'block';
      document.getElementById('paymentsTable').style.display = 'none';
    } else {
      noPayments.style.display = 'none';
      document.getElementById('paymentsTable').style.display = 'table';
      tbody.innerHTML = payments.map(payment => `
        <tr>
          <td>${new Date(payment.created_at).toLocaleDateString()}</td>
          <td>${payment.description}</td>
          <td>₦${payment.amount.toFixed(2)}</td>
          <td>${payment.payment_method || '--'}</td>
          <td><span class="badge ${payment.status === 'completed' ? 'badge-success' : 'badge-warning'}">${payment.status}</span></td>
          <td>${payment.reference_no || '--'}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load payments:', error);
  }
}

async function processPayment() {
  const errorEl = document.getElementById('paymentError');
  const successEl = document.getElementById('paymentSuccess');
  errorEl.classList.remove('show');
  successEl.classList.remove('show');

  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (amount <= 0) {
    errorEl.textContent = 'Please enter a valid amount';
    errorEl.classList.add('show');
    return;
  }

  try {
    await apiCall('/payments', 'POST', { amount, description, payment_method: paymentMethod });
    successEl.textContent = 'Payment initiated successfully! Please complete payment at the bursar office.';
    successEl.classList.add('show');
    document.getElementById('paymentForm').reset();
    setTimeout(() => loadPayments(), 1000);
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.add('show');
  }
}
