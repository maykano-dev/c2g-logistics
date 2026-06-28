const fs = require('fs');
const file = 'apps/main/app/finance/(protected)/actions.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace "Today's Revenue" with "Monthly Revenue" logic
code = code.replace(
  `const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const twentyFourHoursAgoISO = twentyFourHoursAgo.toISOString();`,
  `const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const startOfMonthISO = startOfMonth.toISOString();`
);

code = code.replace(/twentyFourHoursAgoISO/g, 'startOfMonthISO');
code = code.replace(/todaysRevenue/g, 'monthlyRevenue');
code = code.replace(/todaysExpenses/g, 'monthlyExpenses');
code = code.replace(/todaysProfit/g, 'monthlyProfit');

fs.writeFileSync(file, code);
