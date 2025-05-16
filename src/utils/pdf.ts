import { jsPDF } from 'jspdf';
import { Message } from '../types';

export const exportToPDF = (messages: Message[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Add title
  doc.setFontSize(16);
  doc.text('Chat Conversation Export', margin, yPosition);
  yPosition += lineHeight * 2;

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Add messages
  doc.setFontSize(12);
  messages.forEach((message) => {
    if (message.type === 'text') {
      const sender = message.sender.charAt(0).toUpperCase() + message.sender.slice(1);
      const timestamp = new Date(message.timestamp).toLocaleTimeString();
      const header = `${sender} (${timestamp}):`;
      
      // Add sender info
      doc.setFont('helvetica', 'bold');
      doc.text(header, margin, yPosition);
      yPosition += lineHeight;

      // Add message content
      doc.setFont('helvetica', 'normal');
      const textLines = doc.splitTextToSize(message.content, pageWidth - margin * 2);
      textLines.forEach((line: string) => {
        if (yPosition > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      yPosition += lineHeight; // Add space between messages
    }
  });

  // Save the PDF
  doc.save('chat-conversation.pdf');
};