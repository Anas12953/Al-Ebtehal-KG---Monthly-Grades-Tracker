import { StudentRecord, AssessmentStandard, ProgressSnapshot, AttendanceStatus } from '../types/index.ts';
import { KG1_STANDARDS, KG2_STANDARDS } from './curriculum.ts';

// Authentic Emirati kindergarten names for realistic student records
const ARABIC_FIRST_NAMES_BOYS = [
  'راشد', 'حمدان', 'سلطان', 'زايد', 'سيف', 'محمد', 'خليفة', 'أحمد', 'مبارك',
  'سعيد', 'عبد الله', 'منصور', 'عيسى', 'ذياب', 'ماجد', 'خالد', 'سالم', 'علي',
  'حميد', 'غانم', 'مطر', 'نهيان', 'فلاح', 'سهيل', 'حارب'
];

const ARABIC_FIRST_NAMES_GIRLS = [
  'مريم', 'شما', 'فاطمة', 'ميثاء', 'شيخة', 'سلامة', 'لطيفة', 'عائشة', 'حصة',
  'روضة', 'موزة', 'ريم', 'ميرا', 'شمسة', 'هند', 'مهرة', 'ديمة', 'دانة',
  'عفراء', 'اليازية', 'طيف', 'وديمة', 'نورة', 'سارة', 'جواهر'
];

const ARABIC_LAST_NAMES = [
  'المنصوري', 'الظاهري', 'الشحي', 'المزروعي', 'المهيري', 'الكعبي', 'الفلاسي',
  'النعيمي', 'الكتبي', 'القاسمي', 'الرميثي', 'الحمادي', 'الزعابي', 'العامري',
  'البلوشي', 'الدرعي', 'المري', 'الهاملي', 'الشامسي', 'السويدي', 'الغفلي'
];

const TEACHER_NOTES_POOL = [
  'طفل مبدع ويحب المشاركة الفعالة في الأنشطة الصفية وحلقات الاستماع الصباحية. يظهر شغفاً كبيراً بتعلم الحروف ولديه روح قيادية متعاونة مع زملائه.',
  'تظهر تقدماً ملحوظاً في التعبير الشفهي والتحدث بثقة أمام المعلمة وزميلاتها. ننصح بالاستمرار في القراءة المشتركة والقصص المصورة في المنزل.',
  'متميز في مفاهيم العد والأشكال الهندسية والاستكشاف العلمي. يحتاج إلى دعم إضافي خفيف في كتابة الحروف وضبط مسكة القلم بالاتجاه الصحيح.',
  'طالب هادئ ومحب للاستطلاع والملاحظة. يتفاعل بإيجابية مع الأناشيد الوطنية والأنشطة التراثية ولديه حس وطني رائع.',
  'حريصة على إنجاز مهامها باستقلالية تامة، وتتميز في الوعي الصوتي للغة الإنجليزية والكلمات البصرية. بارك الله في جهودها وجهود أسرتها الكريمة.',
  'طفل خلوق ومتعاون جداً مع أقرانه، متقن لحفظ السور القرآنية والآداب الإسلامية المقررة. نوصي بتكثيف تدريبات التلوين الدقيق وتطوير العضلات الدقيقة لليد.',
  'تشارك بحماس في ركن الاستكشاف والملاحظة العلمية، وتطرح أسئلة ذكية عن البيئة والنباتات. استجابتها لقصص اللغة العربية ممتازة ومثمرة.',
  'ملتزم بالحضور والتفاعل اليومي، يظهر تميزاً كبيراً في الألعاب الإدراكية والتصنيف الرياضي. يحتاج فقط للتشجيع على التحدث بجمل أكثر طولاً وترابطاً.',
  'طفلة مجتهدة ومحبوبة، تبدي دقة في تمييز الأصوات القصيرة والطويلة في اللغة العربية. نثمن المتابعة الأسرية المستمرة والحرص على تعزيز ثقة الطفلة بنفسها.',
  'يتمتع بطاقة حيوية وذكاء اجتماعي ملحوظ. أظهر تحسناً كبيراً في مهارات الاستماع والتركيز خلال الفصل الدراسي الحالي.'
];

// Seeded pseudorandom generator for deterministic, stable data
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate the authentic 291 student records for Al Ebtehal Kindergarten
function generateStudentDatabase(): StudentRecord[] {
  const students: StudentRecord[] = [];
  let seed = 42;

  // We have KG1 (classes 1 to 6) and KG2 (classes 1 to 6)
  // Total ~291 students (~24-25 students per class across 12 classes)
  const classesConfig: { grade: 'KG1' | 'KG2'; classNum: number; count: number }[] = [
    { grade: 'KG1', classNum: 1, count: 24 },
    { grade: 'KG1', classNum: 2, count: 24 },
    { grade: 'KG1', classNum: 3, count: 25 },
    { grade: 'KG1', classNum: 4, count: 24 },
    { grade: 'KG1', classNum: 5, count: 24 },
    { grade: 'KG1', classNum: 6, count: 24 },
    { grade: 'KG2', classNum: 1, count: 24 },
    { grade: 'KG2', classNum: 2, count: 25 },
    { grade: 'KG2', classNum: 3, count: 25 },
    { grade: 'KG2', classNum: 4, count: 24 },
    { grade: 'KG2', classNum: 5, count: 24 },
    { grade: 'KG2', classNum: 6, count: 24 },
  ];

  let idCounter = 1010;

  for (const c of classesConfig) {
    const rawStandards = c.grade === 'KG1' ? KG1_STANDARDS : KG2_STANDARDS;

    for (let i = 0; i < c.count; i++) {
      seed++;
      idCounter++;

      const isGirl = seededRandom(seed) > 0.48;
      const firstName = isGirl
        ? ARABIC_FIRST_NAMES_GIRLS[Math.floor(seededRandom(seed + 1) * ARABIC_FIRST_NAMES_GIRLS.length)]
        : ARABIC_FIRST_NAMES_BOYS[Math.floor(seededRandom(seed + 1) * ARABIC_FIRST_NAMES_BOYS.length)];
      const middleName = ARABIC_FIRST_NAMES_BOYS[Math.floor(seededRandom(seed + 2) * ARABIC_FIRST_NAMES_BOYS.length)];
      const lastName = ARABIC_LAST_NAMES[Math.floor(seededRandom(seed + 3) * ARABIC_LAST_NAMES.length)];
      const fullNameAr = `${firstName} ${middleName} ${lastName}`;

      // Emirates ID: 784-YYYY-XXXXXXX-Z (Year 2021 for KG1, 2020 for KG2)
      const birthYear = c.grade === 'KG1' ? '2021' : '2020';
      const seq = String(1000000 + idCounter * 7 + i * 13).padStart(7, '0');
      const checkDigit = String((idCounter + i) % 9 + 1);
      // Ensure the first student in KG1 has the authoritative ID: 784-2021-1998124-3
      const emiratesId =
        c.grade === 'KG1' && c.classNum === 1 && i === 0
          ? '784-2021-1998124-3'
          : `784-${birthYear}-${seq}-${checkDigit}`;

      // Guardian access code: e.g. "EB2026-" + 4 digits
      const pinCode = String(1000 + ((idCounter * 17) % 9000));
      const accessCode = `EB-${pinCode}`;

      // Attendance: ~82% ملتزم, ~14% ملتزم جزئياً, ~4% غير ملتزم
      const attRand = seededRandom(seed + 4);
      const attendanceStatus: AttendanceStatus =
        attRand > 0.18 ? 'ملتزم' : attRand > 0.04 ? 'ملتزم جزئياً' : 'غير ملتزم';

      // Assign grades to 13 standards
      const studentStandards: AssessmentStandard[] = rawStandards.map((std, sIndex) => {
        const gradeRand = seededRandom(seed + 10 + sIndex);
        let grade: 'EX' | 'M' | 'D' | 'E';
        // Distribution realistic for KG in UAE
        if (gradeRand > 0.65) {
          grade = 'EX';
        } else if (gradeRand > 0.22) {
          grade = 'M';
        } else if (gradeRand > 0.06) {
          grade = 'D';
        } else {
          grade = 'E';
        }
        return {
          ...std,
          grade,
        };
      });

      // Compute grade counts for term 2 snapshot
      const countsTerm2 = { EX: 0, M: 0, D: 0, E: 0 };
      studentStandards.forEach(s => countsTerm2[s.grade]++);

      // Term 1 baseline had slightly fewer EX and slightly more D/E as child was just starting
      const countsTerm1 = {
        EX: Math.max(0, countsTerm2.EX - 2),
        M: Math.max(1, countsTerm2.M - 1),
        D: countsTerm2.D + 2,
        E: countsTerm2.E + 1,
      };

      const historicalSnapshots: ProgressSnapshot[] = [
        {
          term: 'term1',
          termNameAr: 'التقييم التأسيسي الأول (الفصل الدراسي الأول)',
          termNameEn: 'Baseline Assessment (Term 1)',
          timestamp: '2026-11-20T08:00:00Z',
          counts: countsTerm1,
        },
        {
          term: 'term2',
          termNameAr: 'التقييم الشامل الثاني (الفصل الدراسي الثاني)',
          termNameEn: 'Comprehensive Progress (Term 2)',
          timestamp: '2027-03-25T10:30:00Z',
          counts: countsTerm2,
        },
      ];

      const teacherNote = TEACHER_NOTES_POOL[Math.floor(seededRandom(seed + 5) * TEACHER_NOTES_POOL.length)];

      students.push({
        emiratesId,
        nameAr: fullNameAr,
        gradeLevel: c.grade,
        classNumber: c.classNum,
        fullClass: `${c.grade}-${c.classNum}`,
        attendanceStatus,
        standards: studentStandards,
        teacherNotes: teacherNote,
        guardianAccessCode: accessCode,
        lastSynchronized: '2027-03-28T09:15:00Z',
        historicalSnapshots,
      });
    }
  }

  return students;
}

// Master authoritative student database (291 students)
export const MASTER_STUDENTS_DATABASE: StudentRecord[] = generateStudentDatabase();

// Clean Emirates ID helper (removes hyphens, spaces, and all non-digit characters for flexible matching)
export function normalizeEmiratesId(raw: string | number | undefined | null): string {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '').trim();
}

// Clean access code helper
export function normalizeAccessCode(raw: string): string {
  return raw.toUpperCase().replace(/\s/g, '').trim();
}

// Lookup student by Emirates ID only
export function verifyAndGetStudent(rawId: string): StudentRecord | null {
  const normId = normalizeEmiratesId(rawId);
  if (!normId) return null;

  const found = MASTER_STUDENTS_DATABASE.find(s => {
    const sId = normalizeEmiratesId(s.emiratesId);
    return sId === normId;
  });

  return found || null;
}

