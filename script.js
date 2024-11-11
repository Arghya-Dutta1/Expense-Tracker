const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

let budget = 0;
let totalExpenses = 0;
let totalIncome = 0;

const WARNING_THRESHOLD = 0.8; // 80% of the budget
const EXCEEDED_THRESHOLD = 1.0; // 100% of the budget

function setBudget() {
  const budgetInput = document.getElementById("budget-input").value;
  budget = parseFloat(budgetInput) || 0;
  document.getElementById("budget-input").value="";
  updateDashboard();
  initializeChart();
}

function addIncome() {
    const incomeInput = parseFloat(document.getElementById("income-input").value) || 0;
    const category = document.getElementById("income-category").value;
    const description = document.getElementById("income-description").value || "No description";
  
    if (incomeInput > 0) {
      totalIncome += incomeInput;
      budget += incomeInput; // Increase the budget by income amount
      document.getElementById("income-input").value = ""; // Clear input field
      document.getElementById("income-description").value = ""; // Clear description field
  
      // Add income to list with category and description
      const incomeList = document.getElementById("income-list");
      const listItem = document.createElement("li");
      listItem.className = "income-item"; // Apply income item styles
  
      listItem.innerHTML = `
        <span class="income-category">Category: ${category} | Income: $${incomeInput.toFixed(2)} - ${description}</span>
        <button class="delete-income-btn" onclick="deleteIncome(this, ${incomeInput})">Delete</button>
      `;
      incomeList.appendChild(listItem);

      //dashboard
      const incomeList1 = document.getElementById("income-list-1");
      const listItem1 = document.createElement("li");
      listItem1.className = "income-item"; // Apply income item styles
  
      listItem1.innerHTML = `
        <span class="income-category">Category: ${category} | Income: $${incomeInput.toFixed(2)} - ${description}</span>
        <button class="delete-income-btn" onclick="deleteIncome(this, ${incomeInput})">Delete</button>
      `;
      incomeList1.appendChild(listItem1);
  
      // Update dashboard and chart
      updateDashboard();
      updateChart(); // Update chart after adding income
    }
  }
  

function deleteIncome(button, incomeAmount) {
  totalIncome -= incomeAmount;
  budget -= incomeAmount; // Decrease budget by deleted income amount

  const incomeItem = button.parentNode;
  incomeItem.remove(); // Remove income item from list

  updateDashboard();
  updateChart(); // Update chart after deleting income
}

function addExpense() {
  const expenseCategory = document.getElementById('expense-category').value;
  const expenseDesc = document.getElementById("expense-desc").value;
  const expenseAmount =
    parseFloat(document.getElementById("expense-amount").value) || 0;

  if (expenseDesc && expenseAmount > 0) {
    totalExpenses += expenseAmount;

    // Add expense to list
    const expenseList = document.getElementById("expense-list");
    const listItem = document.createElement("li");
    listItem.className = "expense-item"; // Apply the new styles here

    listItem.innerHTML = `
      <span>${expenseDesc} (${expenseCategory}): <span class="expense-category">$${expenseAmount.toFixed(2)}</span></span>
      <button class="delete-btn" onclick="deleteExpense(this, ${expenseAmount})">Delete</button>
    `;
    expenseList.appendChild(listItem);

    //dashboard
    const expenseList1 = document.getElementById("expense-list-1");
    const listItem1 = document.createElement("li");
    listItem1.className = "expense-item"; // Apply the new styles here

    listItem1.innerHTML = `
      <span>${expenseDesc} (${expenseCategory}): <span class="expense-category">$${expenseAmount.toFixed(2)}</span></span>
      <button class="delete-btn" onclick="deleteExpense(this, ${expenseAmount})">Delete</button>
    `;
    expenseList1.appendChild(listItem1);

    // Clear input fields
    document.getElementById("expense-desc").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById('expense-category').value = 'Other';

    updateDashboard();
    updateChart(); // Update chart after adding the expense
  }
}

function deleteExpense(button, expenseAmount) {
  // Remove the expense amount from the total expenses
  totalExpenses -= expenseAmount;

  // Remove the list item from the DOM
  const listItem = button.parentNode;
  listItem.remove();

  // Update the dashboard and chart after deletion
  updateDashboard();
  updateChart();
}

function updateDashboard() {
  const remainingBudget = budget - totalExpenses;
  document.getElementById(
    "remaining-budget"
  ).textContent = `$${remainingBudget.toFixed(2)}`;
  document.getElementById("total-income").textContent = `$${totalIncome.toFixed(
    2
  )}`;
  document.getElementById(
    "total-expenses"
  ).textContent = `$${totalExpenses.toFixed(2)}`;

  // Check for budget alerts
  checkBudgetAlert(remainingBudget);
}

function checkBudgetAlert(remainingBudget) {
  const expenseRatio = totalExpenses / budget;

  // Check if expenses are near or over the budget
  if (expenseRatio >= EXCEEDED_THRESHOLD) {
    showAlert("Budget Exceeded", "You have exceeded your budget! Consider reducing expenses.");
  } else if (expenseRatio >= WARNING_THRESHOLD) {
    showAlert("Warning: Budget Approaching Limit", "You are approaching your budget limit. Spend cautiously.");
  } else {
    clearAlert();
  }
}

// Function to show an alert message on the UI
function showAlert(title, message) {
  const alertBox = document.getElementById("alert-box");
  alertBox.innerHTML = `
    <div class="bg-red-600 text-white p-4 rounded-lg shadow-lg mt-4">
      <strong>${title}</strong><br>${message}
    </div>
  `;
}

// Function to clear the alert message
function clearAlert() {
  const alertBox = document.getElementById("alert-box");
  alertBox.innerHTML = "";
}

// Initialize and update the Chart
function initializeChart() {
  const ctx = document.getElementById("budgetChart").getContext("2d");
  budgetChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Remaining Budget", "Total Expenses", "Total Income"],
      datasets: [
        {
          data: [budget - totalExpenses - totalIncome, totalExpenses, totalIncome],
          backgroundColor: ["#FBBF24", "#EF4444", "#00FF00"], // Yellow, green and red colors
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function updateChart() {
  if (!budgetChart) return; // Avoid updating if chart isn't initialized

  // Update chart data
  budgetChart.data.datasets[0].data = [budget - totalExpenses - totalIncome, totalExpenses, totalIncome];
  budgetChart.update();
}

function downloadPDF() {
  // Import the jsPDF library
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set title and basic information for the PDF
  doc.setFontSize(15);
  doc.text("<---------------------------------Expense Tracker Summary----------------------------->", 10, 10);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);
  doc.setFontSize(12);
  doc.text("Financial Overview:", 10, 40);

  // Display total income, expenses, and budget
  doc.setFontSize(10);
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 10, 50);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 10, 60);
  doc.text(`Remaining Budget: $${(budget - totalExpenses).toFixed(2)}`, 10, 70);

  // Add a section for income items
  doc.setFontSize(12);
  doc.text("Income Entries:", 10, 90);
  let yOffset = 100;
  document.querySelectorAll("#income-list .income-item").forEach((item, index) => {
    const text = item.innerText.replace("Delete", "").trim();
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${text}`, 10, yOffset);
    yOffset += 10;
  });

  // Add a section for expense items
  doc.setFontSize(12);
  doc.text("Expense Entries:", 10, yOffset + 10);
  yOffset += 20;
  document.querySelectorAll("#expense-list .expense-item").forEach((item, index) => {
    const text = item.innerText.replace("Delete", "").trim();
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${text}`, 10, yOffset);
    yOffset += 10;
  });

  // Add a random financial quote at the end
  doc.setFontSize(12);
  doc.text("Financial Quote:", 10, yOffset + 10);
  yOffset += 20;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  doc.setFontSize(10);
  doc.text(randomQuote, 10, yOffset, { maxWidth: 180 }); // Wrap text to fit within PDF width

  doc.text("<--------------------------------------------------Thank You for using our Expense Tracker---------------------------------------------->", 10, yOffset+20);

  // Download the generated PDF
  doc.save("expense_report.pdf");
}

function downloadCSV() {
  // Define the CSV header
  let csvContent = "Data Type,Category,Amount,Description\n";

  // Add Income entries to CSV
  csvContent += "Income,,,\n"; // Income section header
  document.querySelectorAll("#income-list .income-item").forEach(item => {
    const [categoryPart, amountDesc] = item.innerText.split(" | Income: ");
    const category = categoryPart.replace("Category: ", "").trim();
    const [amountPart, description] = amountDesc.split(" - ");
    const amount = amountPart.replace("$", "").trim();
    csvContent += `Income,${category},${amount},${description.trim()}\n`;
  });

  // Add Expense entries to CSV
  csvContent += "\nExpense,,,\n"; // Expense section header
  document.querySelectorAll("#expense-list .expense-item").forEach(item => {
    const [descCategory, amount] = item.innerText.split(": ");
    const [description, categoryPart] = descCategory.split(" (");
    const category = categoryPart.replace(")", "").trim();
    csvContent += `Expense,${category},${amount.replace("$", "").trim()},${description.trim()}\n`;
  });

  // Add summary (total income, total expenses, remaining budget)
  csvContent += "\nSummary,,,\n"; // Summary section header
  csvContent += `Total Income,,${totalIncome.toFixed(2)},\n`;
  csvContent += `Total Expenses,,${totalExpenses.toFixed(2)},\n`;
  csvContent += `Remaining Budget,,${(budget - totalExpenses).toFixed(2)},\n`;

  // Create a Blob and use it to generate a downloadable link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", "expense_report.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



const quotes = [
    "An investment in knowledge pays the best interest.\n\n - Benjamin Franklin",
    "Do not save what is left after spending, but spend what is left after saving.\n\n - Warren Buffett",
    "The quickest way to double your money is to fold it over and put it back in your pocket.\n\n - Will Rogers",
    "Beware of little expenses; a small leak will sink a great ship.\n\n - Benjamin Franklin",
    "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.\n\n - Ayn Rand",
    "It's not your salary that makes you rich, it's your spending habits.\n\n - Charles A. Jaffe",
    "A penny saved is a penny earned.\n\n - Benjamin Franklin",
    "In investing, what is comfortable is rarely profitable.\n\n - Robert Arnott",
    "The only wealth which you will keep forever is the wealth you have given away.\n\n - Marcus Aurelius",
    "Price is what you pay. Value is what you get.\n\n - Warren Buffett",
    "Financial freedom is available to those who learn about it and work for it.\n\n - Robert Kiyosaki",
    "The best way to predict the future is to create it.\n\n - Peter Drucker",
    "Do not wait to strike till the iron is hot, but make it hot by striking.\n\n - William Butler Yeats",
    "If you live for having it all, what you have is never enough.\n\n - Vicki Robin",
    "It's not about having the money, it's about managing it well.\n\n - T. Harv Eker",
    "Time is more valuable than money. You can get more money, but you cannot get more time.\n\n - Jim Rohn"
  ];  

function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").innerText = quotes[randomIndex];
}
