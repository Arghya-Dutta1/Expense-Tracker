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
  document.getElementById("budget-input").value = "";
  updateDashboard();
  initializeChart();
  initializeBarChart();
  initializeLineChart();
}

function addIncome() {
  const incomeInput =
    parseFloat(document.getElementById("income-input").value) || 0;
  const category = document.getElementById("income-category").value;
  const description =
    document.getElementById("income-description").value || "No description";

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
        <span class="income-category">${category} | $${incomeInput.toFixed(
      2
    )} | ${description}</span>
        <button class="delete-income-btn" onclick="deleteIncome(this, ${incomeInput})">Delete</button>
      `;
    incomeList.appendChild(listItem);

    //dashboard
    const incomeList1 = document.getElementById("income-list-1");
    const listItem1 = document.createElement("li");
    listItem1.className = "income-item"; // Apply income item styles

    listItem1.innerHTML = `
        <span class="income-category">Income: $${incomeInput.toFixed(
          2
        )} - ${description} (${category})</span>
      `;
    incomeList1.appendChild(listItem1);

    // Update dashboard and chart
    updateDashboard();
    updateBarChart();
    updateLineChart();
    updateChart(); // Update chart after adding income
  }
}

function deleteIncome(button, incomeAmount) {
  totalIncome -= incomeAmount;
  budget -= incomeAmount; // Decrease budget by deleted income amount

  const incomeItem = button.parentNode;
  incomeItem.remove(); // Remove income item from list

  updateDashboard();
  updateBarChart();
  updateLineChart();
  updateChart(); // Update chart after deleting income
}

function addExpense() {
  const expenseCategory = document.getElementById("expense-category").value;
  const expenseDesc =
    document.getElementById("expense-desc").value || "No description";
  const expenseAmount =
    parseFloat(document.getElementById("expense-amount").value) || 0;

  if (expenseDesc && expenseAmount > 0) {
    totalExpenses += expenseAmount;

    // Add expense to list
    const expenseList = document.getElementById("expense-list");
    const listItem = document.createElement("li");
    listItem.className = "expense-item"; // Apply the new styles here

    listItem.innerHTML = `
      <span class="expense-category">${expenseCategory} | $${expenseAmount.toFixed(
      2
    )} | ${expenseDesc}</span>
      <button class="delete-btn" onclick="deleteExpense(this, ${expenseAmount})">Delete</button>
    `;
    expenseList.appendChild(listItem);

    //dashboard
    const expenseList1 = document.getElementById("expense-list-1");
    const listItem1 = document.createElement("li");
    listItem1.className = "expense-item"; // Apply the new styles here

    listItem1.innerHTML = `
      <span class="expense-category">Expense: $${expenseAmount.toFixed(
        2
      )} - ${expenseDesc} (${expenseCategory})</span>
    `;
    expenseList1.appendChild(listItem1);

    // Clear input fields
    document.getElementById("expense-desc").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-category").value = "Other";

    updateDashboard();
    updateBarChart();
    updateLineChart();
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
  updateBarChart();
  updateLineChart();
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
    showAlert(
      "Budget Exceeded",
      "You have exceeded your budget! Consider reducing expenses."
    );
  } else if (expenseRatio >= WARNING_THRESHOLD) {
    showAlert(
      "Warning: Budget Approaching Limit",
      "You are approaching your budget limit. Spend cautiously."
    );
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
          data: [
            budget - totalExpenses - totalIncome,
            totalExpenses,
            totalIncome,
          ],
          backgroundColor: ["#89CFF0", "#ED7C63", "#63EDAA"], // Yellow, green and red colors
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
  budgetChart.data.datasets[0].data = [
    budget - totalExpenses - totalIncome,
    totalExpenses,
    totalIncome,
  ];
  budgetChart.update();
}

let budgetBarChart;

function initializeBarChart() {
  const ctx = document.getElementById("budgetBarChart").getContext("2d");

  budgetBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Budget", "Total Expenses", "Total Income"],
      datasets: [
        {
          label: "Budget Analysis",
          data: [budget - totalExpenses, totalExpenses, totalIncome],
          backgroundColor: ["#89CFF0", "#ED7C63", "#63EDAA"], // Yellow for remaining budget, red for expenses, green for income
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: budget, // Set y-axis max to the initial budget value
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `$${tooltipItem.raw.toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

function updateBarChart() {
  if (!budgetBarChart) return;

  // Update the data in the bar chart with new values
  budgetBarChart.data.datasets[0].data = [
    budget - totalExpenses, // Total budget
    totalExpenses, // Total expenses
    totalIncome, // Total income
  ];

  // Update y-axis maximum to be close to the budget value for scaling
  budgetBarChart.options.scales.y.suggestedMax = budget;

  budgetBarChart.update(); // Refresh the chart with updated values
}

function initializeLineChart() {
  const ctx = document
    .getElementById("incomeExpenseLineChart")
    .getContext("2d");

  // Initialize an empty chart
  incomeExpenseLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Income",
          data: [],
          borderColor: "green",
          backgroundColor: "#63EDAA",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Expense",
          data: [],
          borderColor: "red",
          backgroundColor: "#ED7C63",
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Item Number",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

function updateLineChart() {
  const incomeItems = document.querySelectorAll("#income-list .income-item");
  const expenseItems = document.querySelectorAll("#expense-list .expense-item");

  const incomeData = [];
  const expenseData = [];
  const labels = [];

  incomeItems.forEach((item, index) => {
    const amount = parseFloat(
      item
        .querySelector(".income-category")
        .innerText.split(" | ")[1]
        .replace("$", "")
        .trim()
    );
    incomeData.push(amount);
    labels.push(`Record ${index + 1}`);
  });

  expenseItems.forEach((item, index) => {
    const amount = parseFloat(
      item
        .querySelector(".expense-category")
        .innerText.split(" | ")[1]
        .replace("$", "")
        .trim()
    );
    expenseData.push(amount);
    // labels.push(`Expense ${index + 1}`);
  });

  // Update the existing chart data and labels
  incomeExpenseLineChart.data.labels = labels;
  incomeExpenseLineChart.data.datasets[0].data = incomeData;
  incomeExpenseLineChart.data.datasets[1].data = expenseData;
  incomeExpenseLineChart.update();
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Capture the dashboard area using html2canvas
  const dashboardElement = document.getElementById("dashboard");

  // Convert the dashboard element to canvas
  const canvas = await html2canvas(dashboardElement, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Set dark background color
  doc.setFillColor(0, 0, 0); // Dark gray background (RGB)
  doc.rect(
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height,
    "F"
  ); // Full page rectangle

  // Set white font color for all text
  doc.setTextColor(255, 255, 255); // White color

  // Title and basic information
  doc.setFont("helvetica", "bold");

  // Watermark
  doc.setFontSize(70);
  doc.setFont("helvetica", "bold");
  doc.setGState(new doc.GState({ opacity: 0.2 })); // Set opacity

  // Position watermark in the center and rotate
  doc.text("EXPENSE\nTRACKER", 35, 150, { angle: 45 });

  // Restore default settings
  doc.setGState(new doc.GState({ opacity: 1 }));
  doc.setFontSize(12); // Reset font size after watermark

  // Add title and basic info
  doc.setFontSize(15);
  doc.text(
    "<---------------------------------Expense Tracker Report----------------------------->",
    10,
    10
  );
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);
  doc.setFontSize(12);
  doc.text("Financial Overview:", 10, 40);

  // Display total income, expenses, and budget
  doc.setFontSize(10);
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 10, 50);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 10, 60);
  doc.text(`Remaining Budget: $${(budget - totalExpenses).toFixed(2)}`, 10, 70);

  // Insert dashboard snapshot image into the PDF
  const imgWidth = 100; // Set the width of the image
  const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
  doc.addImage(imgData, "PNG", 100, 15, imgWidth, imgHeight);

  // Move yOffset to place text below the image
  let yOffset = 80 + 10;

  // Add income entries
  doc.setFontSize(12);
  doc.text("Income Entries:", 10, yOffset);
  yOffset += 10;
  document
    .querySelectorAll("#income-list .income-item")
    .forEach((item, index) => {
      const text = item.innerText.replace("Delete", "").trim();
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${text}`, 10, yOffset);
      yOffset += 10;
    });

  // Add expense entries
  doc.setFontSize(12);
  doc.text("Expense Entries:", 10, yOffset + 10);
  yOffset += 20;
  document
    .querySelectorAll("#expense-list .expense-item")
    .forEach((item, index) => {
      const text = item.innerText.replace("Delete", "").trim();
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${text}`, 10, yOffset);
      yOffset += 10;
    });

  // Add a random financial quote at the end
  doc.setFontSize(12);
  doc.text("Financial Quote:", 100, 110);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  doc.setFontSize(10);
  doc.text(randomQuote, 100, 120, { maxWidth: 90 });

  yOffset += 10;

  doc.text(
    "<--------------------------------------------------Thank You for using our Expense Tracker---------------------------------------------->",
    10,
    yOffset + 20
  );

  // Download the generated PDF
  doc.save("expense_report.pdf");
}

function downloadCSV() {
  // Define the CSV header
  let csvContent = "Data Type,Category,Amount,Description\n";

  // Add Income entries to CSV
  const incomeItems = document.querySelectorAll("#income-list .income-item");
  incomeItems.forEach((item) => {
    const textContent = item.querySelector(".income-category").innerText;
    const [category, amount, description] = textContent.split(" | ");
    csvContent += `Income,${category.trim()},${amount
      .replace("$", "")
      .trim()},${description.trim()}\n`;
  });

  // Add Expense entries to CSV
  const expenseItems = document.querySelectorAll("#expense-list .expense-item");
  expenseItems.forEach((item) => {
    const textContent = item.querySelector(".expense-category").innerText;
    const [category, amount, description] = textContent.split(" | ");
    csvContent += `Expense,${category.trim()},${amount
      .replace("$", "")
      .trim()},${description.trim()}\n`;
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
  "Time is more valuable than money. You can get more money, but you cannot get more time.\n\n - Jim Rohn",
];

function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").innerText = quotes[randomIndex];
}
