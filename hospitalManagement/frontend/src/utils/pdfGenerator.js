import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF prescription layout
 * @param {Object} prescriptionData - The data object containing prescription details
 * @param {Object} patient - The patient details
 * @param {Object} doctor - The doctor details
 */
export const generatePrescriptionPDF = (prescriptionData, patient, doctor) => {
  // Create a new PDF document (Portrait, millimeters, A4 size)
  const doc = new jsPDF('p', 'mm', 'a4');

  // Add Clinic/Header text
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185); // A nice blue color
  doc.text('MediCare SaaS - Official Prescription', 14, 22);
  
  // Add line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 28, 196, 28);

  // Doctor Details (Left side)
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dr. ${doctor?.name || 'Doctor Name'}`, 14, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`${doctor?.specialization || 'Specialization'}`, 14, 46);

  // Patient Details (Right side)
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${patient?.name || 'Patient Name'}`, 120, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date(prescriptionData?.createdAt || Date.now()).toLocaleDateString()}`, 120, 46);

  // Diagnosis Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnosis:', 14, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Split long diagnosis text into multiple lines if needed
  const splitDiagnosis = doc.splitTextToSize(prescriptionData?.diagnosis || 'N/A', 180);
  doc.text(splitDiagnosis, 14, 68);

  // Medicines Table Setup
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Medicines Prescribed:', 14, 90);

  const tableColumn = ["Medicine Name", "Dosage", "Duration"];
  const tableRows = [];

  // Map the medicines to the format jspdf-autotable expects
  if (prescriptionData?.medicines && prescriptionData.medicines.length > 0) {
    prescriptionData.medicines.forEach(med => {
      const medData = [
        med.name,
        med.dosage,
        med.duration
      ];
      tableRows.push(medData);
    });
  }

  // Generate the table
  doc.autoTable({
    startY: 96,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Notes Section (drawn below the table dynamically)
  const finalY = doc.lastAutoTable.finalY || 120;
  
  if (prescriptionData?.notes) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Notes:', 14, finalY + 15);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(prescriptionData.notes, 180);
    doc.text(splitNotes, 14, finalY + 23);
  }

  // Footer / Signature line
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setDrawColor(0, 0, 0);
  doc.line(140, pageHeight - 30, 190, pageHeight - 30);
  doc.setFontSize(10);
  doc.text('Doctor Signature', 150, pageHeight - 24);

  // Save the PDF
  doc.save(`Prescription_${patient?.name || 'Patient'}_${Date.now()}.pdf`);
};