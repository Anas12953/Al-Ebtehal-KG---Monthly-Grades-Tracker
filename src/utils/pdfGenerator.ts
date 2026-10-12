import { jsPDF } from 'jspdf';
import { StudentRecord, AdvisorFeedback, Language } from '../types';

export function generateStudentPdfReport(
  student: StudentRecord,
  advisor: AdvisorFeedback | null,
  lang: Language = 'ar'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isAr = lang === 'ar';
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Masked Emirates ID for privacy protection
  const maskedId = student.emiratesId.replace(/^(\d{3})-\d{4}-\d{7}-(\d)/, '$1-****-*******-$2');

  // Background header band
  doc.setFillColor(29, 52, 72); // Navy #1D3448
  doc.rect(0, 0, pageWidth, 28, 'F');

  // School Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Al Ebtehal Kindergarten | Academic Year 2026-2027', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Early Childhood Student Performance Report', pageWidth / 2, 20, { align: 'center' });

  y = 36;

  // Student Identity Box
  doc.setFillColor(245, 247, 248);
  doc.rect(14, y, pageWidth - 28, 26, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 26, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Student: ${student.nameAr}`, 20, y + 8);
  doc.text(`Class: ${student.fullClass} (${student.gradeLevel})`, 20, y + 16);
  doc.text(`ID: ${maskedId}`, 20, y + 22);

  doc.text(`Attendance: ${student.attendanceStatus}`, pageWidth - 20, y + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 20, y + 16, { align: 'right' });
  doc.text(`Principal: Ms. Khadeeja Al Shehhi`, pageWidth - 20, y + 22, { align: 'right' });

  y += 34;

  // Grade Counts Summary Cards
  const counts = { EX: 0, M: 0, D: 0, E: 0 };
  student.standards.forEach(s => counts[s.grade]++);

  const cardWidth = (pageWidth - 28 - 9) / 4;
  const gradeSummary = [
    { label: 'Exceeding (EX)', count: counts.EX, color: [22, 163, 74] },
    { label: 'Mastery (M)', count: counts.M, color: [37, 99, 235] },
    { label: 'Developing (D)', count: counts.D, color: [217, 119, 6] },
    { label: 'Emerging (E)', count: counts.E, color: [220, 38, 38] },
  ];

  gradeSummary.forEach((item, idx) => {
    const x = 14 + idx * (cardWidth + 3);
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.rect(x, y, cardWidth, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${item.count}`, x + cardWidth / 2, y + 6, { align: 'center' });
    doc.setFontSize(7.5);
    doc.text(item.label, x + cardWidth / 2, y + 11, { align: 'center' });
  });

  y += 22;

  // Standards Table Section Header
  doc.setTextColor(29, 52, 72);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Curriculum Assessment Standards (13 Assessed Outcomes)', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('#', 18, y + 5.5);
  doc.text('Domain / Subject', 26, y + 5.5);
  doc.text('Standard Description', 70, y + 5.5);
  doc.text('Grade', pageWidth - 22, y + 5.5, { align: 'center' });
  y += 8;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  student.standards.forEach((std, index) => {
    const rowHeight = 7.5;
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, rowHeight, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.text(`${index + 1}`, 18, y + 5);
    doc.text(std.domainEn, 26, y + 5);

    // Truncate standard text if needed for line fit
    const stdText = std.nameEn.length > 55 ? std.nameEn.substring(0, 52) + '...' : std.nameEn;
    doc.text(stdText, 70, y + 5);

    // Grade badge
    let gradeColor: [number, number, number] = [37, 99, 235];
    if (std.grade === 'EX') gradeColor = [22, 163, 74];
    if (std.grade === 'D') gradeColor = [217, 119, 6];
    if (std.grade === 'E') gradeColor = [220, 38, 38];

    doc.setFillColor(gradeColor[0], gradeColor[1], gradeColor[2]);
    doc.circle(pageWidth - 22, y + 4, 3.2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(std.grade, pageWidth - 22, y + 5.2, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    y += rowHeight;
  });

  y += 6;

  // Teacher Notes Box
  doc.setFillColor(254, 252, 232); // Light yellow
  doc.rect(14, y, pageWidth - 28, 16, 'F');
  doc.setDrawColor(254, 240, 138);
  doc.rect(14, y, pageWidth - 28, 16, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(133, 77, 14);
  doc.text("Official Teacher's Note (Classroom Observation):", 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(113, 63, 18);
  // Split note if too long
  const noteLines = doc.splitTextToSize(student.teacherNotes, pageWidth - 36);
  doc.text(noteLines.slice(0, 2), 18, y + 10);

  y += 20;

  // AI Educational Advisor Section (if available)
  if (advisor && y < 240) {
    doc.setFillColor(240, 253, 250); // Mint
    doc.rect(14, y, pageWidth - 28, 22, 'F');
    doc.setDrawColor(204, 251, 241);
    doc.rect(14, y, pageWidth - 28, 22, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136);
    doc.text('AI Learning Advisor Summary & Home Guidance (Authorized AI Insight):', 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 118, 110);
    const recText = advisor.recommendations.map(r => `• ${r}`).join('  ');
    const recLines = doc.splitTextToSize(recText, pageWidth - 36);
    doc.text(recLines.slice(0, 3), 18, y + 10);
    y += 26;
  }

  // Footer Signatures
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Al Ebtehal Kindergarten · UAE Ministry of Education · Khadeeja Al Shehhi (Principal)', pageWidth / 2, 285, { align: 'center' });

  // Save the PDF
  const filename = `Al_Ebtehal_Report_${student.fullClass}_${student.emiratesId.replace(/\D/g, '').slice(-4)}.pdf`;
  doc.save(filename);
}
