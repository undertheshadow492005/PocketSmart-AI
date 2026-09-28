// Currency and share formatting utilities

export function formatINR(amount: number, currency: 'INR' | 'USD' = 'INR', exchangeRate = 86.5): string {
  if (currency === 'USD') {
    const usd = amount / exchangeRate;
    return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function generateWhatsAppLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function printBudgetSummary(title: string, contentHtml: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - PocketSmartAI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
          h1 { color: #0f172a; margin-bottom: 4px; font-size: 24px; }
          .badge { display: inline-block; background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background: #f8fafc; font-weight: 600; }
          .footer { margin-top: 32px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="badge">PocketSmartAI • Naan Mudhalvan Project</div>
        <h1>${title}</h1>
        <p style="color: #64748b; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} via Google Gemini AI</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        ${contentHtml}
        <div class="footer">
          PocketSmartAI: Smart Budget & Recommendation System • Designed for Naan Mudhalvan Skill Development Program.
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
