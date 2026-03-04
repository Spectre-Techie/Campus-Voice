import "dotenv/config";
import { PrismaClient, FeedbackCategory, FeedbackStatus, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────

function trackingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "CV-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

// ─── Seed Data ──────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding CampusVoice database...\n");

  // ── 1. Admins ──────────────────────────
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const superAdmin = await prisma.admin.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      password_hash: passwordHash,
      display_name: "Super Administrator",
      role: AdminRole.super_admin,
      department: null,
      is_active: true,
    },
  });

  const acadAdmin = await prisma.admin.upsert({
    where: { username: "acad_admin" },
    update: {},
    create: {
      username: "acad_admin",
      password_hash: passwordHash,
      display_name: "Dr. Adeyemi (Academics)",
      role: AdminRole.department_admin,
      department: "Academics",
      is_active: true,
    },
  });

  const facilitiesAdmin = await prisma.admin.upsert({
    where: { username: "facilities_admin" },
    update: {},
    create: {
      username: "facilities_admin",
      password_hash: passwordHash,
      display_name: "Engr. Okoro (Facilities)",
      role: AdminRole.department_admin,
      department: "Facilities",
      is_active: true,
    },
  });

  const viewer = await prisma.admin.upsert({
    where: { username: "viewer" },
    update: {},
    create: {
      username: "viewer",
      password_hash: passwordHash,
      display_name: "Staff Viewer",
      role: AdminRole.viewer,
      department: null,
      is_active: true,
    },
  });

  console.log(`✅ 4 admins created (password: Admin@123)`);

  // ── 2. Feedback submissions ────────────
  const feedbackData: Array<{
    category: FeedbackCategory;
    title: string;
    description: string;
    status: FeedbackStatus;
    upvotes: number;
    daysOld: number;
    department: string | null;
  }> = [
    {
      category: "Academics",
      title: "Lecturers not uploading course materials",
      description:
        "Multiple lecturers in the Computer Science department are not uploading course materials to the LMS. Students have been complaining since the beginning of the semester. This affects revision and exam preparation.",
      status: "submitted",
      upvotes: 45,
      daysOld: 3,
      department: "Academics",
    },
    {
      category: "Facilities",
      title: "Broken air conditioning in Block C lecture halls",
      description:
        "The AC units in Block C (rooms C101, C102, C103) have been non-functional for over 2 weeks. With temperatures reaching 35°C, lectures are becoming unbearable. Students are falling ill.",
      status: "under_review",
      upvotes: 78,
      daysOld: 14,
      department: "Facilities",
    },
    {
      category: "Security",
      title: "No security lighting on the path to hostel",
      description:
        "The walkway from the library to Hall 3 hostel has zero street lights. Multiple students have reported feeling unsafe walking back after evening study. There was an incident last week.",
      status: "in_progress",
      upvotes: 120,
      daysOld: 21,
      department: "Security",
    },
    {
      category: "Welfare",
      title: "Cafeteria food quality has dropped significantly",
      description:
        "The main cafeteria's food quality has been declining for weeks. Students are finding insects in food, rice is often undercooked, and portions have been reduced. The health center has seen more stomach complaints.",
      status: "resolved",
      upvotes: 92,
      daysOld: 30,
      department: "Welfare",
    },
    {
      category: "IT_Services",
      title: "Campus WiFi constantly dropping connections",
      description:
        "The campus WiFi network disconnects every 10-15 minutes. Students can't attend online classes or submit assignments. The IT help desk says they're aware but no fix has been communicated.",
      status: "under_review",
      upvotes: 156,
      daysOld: 7,
      department: "IT Services",
    },
    {
      category: "Facilities",
      title: "Water shortage in female hostel for 5 days",
      description:
        "Hall 5 (female hostel) has had no running water for 5 consecutive days. Students are buying water for basic needs. The plumbing team visited once but nothing was fixed.",
      status: "in_progress",
      upvotes: 88,
      daysOld: 5,
      department: "Facilities",
    },
    {
      category: "Academics",
      title: "Exam timetable clashes for 300-level students",
      description:
        "The released exam timetable shows CHM 301 and PHY 305 scheduled at the same time on March 15. Over 200 students take both courses. The department has not acknowledged the clash.",
      status: "submitted",
      upvotes: 67,
      daysOld: 2,
      department: "Academics",
    },
    {
      category: "Security",
      title: "Unauthorized vehicles on campus after hours",
      description:
        "Unregistered vehicles have been seen driving through campus after 10 PM. The security checkpoint at the main gate is unmanned at night. This poses a safety risk to students in hostels.",
      status: "submitted",
      upvotes: 34,
      daysOld: 4,
      department: "Security",
    },
    {
      category: "Welfare",
      title: "Scholarship disbursement delayed by 3 months",
      description:
        "Students who were awarded the merit scholarship in November still haven't received payments. The bursary office keeps giving different dates. Students who depend on this fund are struggling.",
      status: "under_review",
      upvotes: 55,
      daysOld: 10,
      department: "Welfare",
    },
    {
      category: "Others",
      title: "Student union election results not published",
      description:
        "The SUG elections were held 2 weeks ago but the results have not been officially published. Rumors and tensions are building. The DSLA should intervene and ensure transparency.",
      status: "submitted",
      upvotes: 41,
      daysOld: 14,
      department: null,
    },
    {
      category: "Facilities",
      title: "Laboratory equipment outdated and insufficient",
      description:
        "The Chemistry lab still uses equipment from 2005. Microscopes are broken, reagents expired, and there aren't enough kits for all students. Practicals are mostly theoretical demonstrations.",
      status: "submitted",
      upvotes: 29,
      daysOld: 8,
      department: "Facilities",
    },
    {
      category: "IT_Services",
      title: "Student portal crashes during course registration",
      description:
        "The student portal becomes completely unresponsive during peak registration hours. Students are missing course registration deadlines because the system times out. Needs urgent capacity upgrade.",
      status: "closed",
      upvotes: 110,
      daysOld: 45,
      department: "IT Services",
    },
    {
      category: "Welfare",
      title: "Health center runs out of basic medication",
      description:
        "The campus health center frequently runs out of basic medications like paracetamol and antibiotics. Students with minor ailments are being referred to expensive hospitals off-campus.",
      status: "in_progress",
      upvotes: 73,
      daysOld: 18,
      department: "Welfare",
    },
    {
      category: "Academics",
      title: "No qualified lecturers for CSC 401 and CSC 403",
      description:
        "Two core 400-level CS courses have been assigned to lecturers from unrelated departments. Students are not learning anything meaningful. The HOD should recruit or reassign properly.",
      status: "submitted",
      upvotes: 38,
      daysOld: 6,
      department: "Academics",
    },
    {
      category: "Facilities",
      title: "Library closes too early for exam preparation",
      description:
        "The library closes at 6 PM, which is too early for students preparing for exams. Many students have nowhere else to study quietly. Extending hours to at least 10 PM would help thousands.",
      status: "resolved",
      upvotes: 85,
      daysOld: 35,
      department: "Facilities",
    },
    {
      category: "Security",
      title: "CCTV cameras in parking lot not working",
      description:
        "Several cars have been broken into in the staff/student parking lot. The CCTV cameras appear to be dummies or non-functional. Vehicle owners deserve security for their property.",
      status: "under_review",
      upvotes: 47,
      daysOld: 12,
      department: "Security",
    },
    {
      category: "Others",
      title: "Convocation ceremony keeps getting postponed",
      description:
        "The 2025 convocation has been postponed 3 times now. Graduates need their certificates for job applications and further studies. The management owes us an explanation.",
      status: "submitted",
      upvotes: 63,
      daysOld: 20,
      department: null,
    },
    {
      category: "Welfare",
      title: "No mental health support on campus",
      description:
        "There is no counselor or mental health professional available for students. With academic pressure and personal challenges, many students are struggling silently. We need a wellness center.",
      status: "submitted",
      upvotes: 96,
      daysOld: 9,
      department: "Welfare",
    },
    {
      category: "Facilities",
      title: "Lecture hall projectors are all broken",
      description:
        "Projectors in Main Auditorium, Block A rooms 201-204, and Block B room 105 are not working. Lecturers who prepare slides have to revert to chalkboard. It slows down lectures.",
      status: "submitted",
      upvotes: 22,
      daysOld: 11,
      department: "Facilities",
    },
    {
      category: "IT_Services",
      title: "Email service for students is unreliable",
      description:
        "The @student.university.edu email service goes down multiple times a week. Students miss important correspondence from lecturers and the admin. We need a reliable email provider.",
      status: "submitted",
      upvotes: 31,
      daysOld: 16,
      department: "IT Services",
    },
  ];

  // Category weights for priority scoring
  const WEIGHTS: Record<string, number> = {
    Security: 10,
    Welfare: 8,
    Facilities: 6,
    Academics: 5,
    IT_Services: 4,
    Others: 2,
  };

  const createdFeedback = [];

  for (const fb of feedbackData) {
    const weight = WEIGHTS[fb.category] ?? 2;
    const age = fb.daysOld;
    const priorityScore = fb.upvotes * 0.4 + weight * 5 + Math.min(age, 30) * 0.3;

    const feedback = await prisma.feedback.create({
      data: {
        tracking_id: trackingId(),
        category: fb.category,
        title: fb.title,
        description: fb.description,
        status: fb.status,
        upvote_count: fb.upvotes,
        assigned_department: fb.department,
        priority_score: Math.round(priorityScore * 100) / 100,
        resolved_at: fb.status === "resolved" ? daysAgo(fb.daysOld - 5) : null,
        created_at: daysAgo(fb.daysOld),
      },
    });

    // Create initial status history entry
    await prisma.statusHistory.create({
      data: {
        feedback_id: feedback.id,
        old_status: null,
        new_status: "submitted",
        comment: "Feedback submitted anonymously",
        changed_by: null,
        changed_at: daysAgo(fb.daysOld),
      },
    });

    // For non-submitted statuses, add status transitions
    if (fb.status !== "submitted") {
      await prisma.statusHistory.create({
        data: {
          feedback_id: feedback.id,
          old_status: "submitted",
          new_status: "under_review",
          comment: "Assigned for review",
          changed_by: superAdmin.id,
          changed_at: daysAgo(fb.daysOld - 1),
        },
      });
    }

    if (fb.status === "in_progress" || fb.status === "resolved" || fb.status === "closed") {
      await prisma.statusHistory.create({
        data: {
          feedback_id: feedback.id,
          old_status: "under_review",
          new_status: "in_progress",
          comment: "Team is actively working on this",
          changed_by: superAdmin.id,
          changed_at: daysAgo(fb.daysOld - 2),
        },
      });
    }

    if (fb.status === "resolved") {
      await prisma.statusHistory.create({
        data: {
          feedback_id: feedback.id,
          old_status: "in_progress",
          new_status: "resolved",
          comment: "Issue has been resolved",
          changed_by: superAdmin.id,
          changed_at: daysAgo(fb.daysOld - 5),
        },
      });
    }

    if (fb.status === "closed") {
      await prisma.statusHistory.create({
        data: {
          feedback_id: feedback.id,
          old_status: "in_progress",
          new_status: "closed",
          comment: "Closed after resolution and monitoring",
          changed_by: superAdmin.id,
          changed_at: daysAgo(fb.daysOld - 7),
        },
      });
    }

    createdFeedback.push(feedback);
  }

  console.log(`✅ ${createdFeedback.length} feedback submissions created`);

  // ── 3. Admin responses on some feedback ─────
  const responsePairs = [
    {
      feedbackIdx: 1, // Broken AC
      admin: facilitiesAdmin,
      text: "We have inspected Block C and identified 3 faulty compressor units. Replacement parts have been ordered and are expected to arrive within 5 working days. Temporary fans will be placed in the affected rooms by tomorrow.",
      statusTo: "under_review" as FeedbackStatus,
    },
    {
      feedbackIdx: 2, // Security lighting
      admin: superAdmin,
      text: "The Works department has been instructed to install 12 solar-powered LED lights along the library-to-hostel pathway. Installation will commence this week. In the interim, security patrol has been increased on this route.",
      statusTo: "in_progress" as FeedbackStatus,
    },
    {
      feedbackIdx: 3, // Cafeteria
      admin: superAdmin,
      text: "Following an emergency inspection, the cafeteria management has been issued a warning. New hygiene protocols are now in place, and an independent food safety audit has been scheduled. Portions and quality have been restored as of yesterday.",
      statusTo: "resolved" as FeedbackStatus,
    },
    {
      feedbackIdx: 4, // WiFi
      admin: acadAdmin,
      text: "The ICT team has upgraded the main access points in the academic area. A new bandwidth allocation plan is being rolled out this week. Please report if the issue persists after Wednesday.",
      statusTo: null,
    },
    {
      feedbackIdx: 5, // Water shortage
      admin: facilitiesAdmin,
      text: "Emergency water tanks have been deployed to Hall 5. The underground pipe leak has been located and repair work is ongoing. Full water supply should be restored within 48 hours.",
      statusTo: "in_progress" as FeedbackStatus,
    },
    {
      feedbackIdx: 12, // Health center
      admin: superAdmin,
      text: "An emergency procurement of essential medications has been approved. The health center will be restocked by Friday. We are also reviewing the supply chain to prevent future shortages.",
      statusTo: "in_progress" as FeedbackStatus,
    },
    {
      feedbackIdx: 14, // Library hours
      admin: facilitiesAdmin,
      text: "Effective immediately, the library hours have been extended to 10 PM on weekdays during exam periods. Two additional security personnel will be stationed at the library entrance for evening sessions.",
      statusTo: "resolved" as FeedbackStatus,
    },
  ];

  for (const resp of responsePairs) {
    await prisma.adminResponse.create({
      data: {
        feedback_id: createdFeedback[resp.feedbackIdx].id,
        admin_id: resp.admin.id,
        response_text: resp.text,
        status_changed_to: resp.statusTo,
      },
    });
  }

  console.log(`✅ ${responsePairs.length} admin responses created`);

  // ── 4. Audit logs ──────────────────────
  await prisma.auditLog.createMany({
    data: [
      {
        admin_id: superAdmin.id,
        action: "login",
        entity: null,
        entity_id: null,
        metadata: { ip: "192.168.1.100", userAgent: "Mozilla/5.0" },
      },
      {
        admin_id: superAdmin.id,
        action: "status_change",
        entity: "feedback",
        entity_id: createdFeedback[2].id,
        metadata: { from: "under_review", to: "in_progress" },
      },
      {
        admin_id: facilitiesAdmin.id,
        action: "respond",
        entity: "feedback",
        entity_id: createdFeedback[1].id,
        metadata: { response_preview: "We have inspected Block C..." },
      },
    ],
  });

  console.log(`✅ 3 audit log entries created`);

  // ── Summary ────────────────────────────
  const counts = await Promise.all([
    prisma.feedback.count(),
    prisma.admin.count(),
    prisma.adminResponse.count(),
    prisma.statusHistory.count(),
    prisma.auditLog.count(),
  ]);

  console.log(`
┌─────────────────────────────────────┐
│     🌱 Seed Complete                │
├─────────────────────────────────────┤
│  Feedback      : ${String(counts[0]).padStart(3)}               │
│  Admins        : ${String(counts[1]).padStart(3)}               │
│  Responses     : ${String(counts[2]).padStart(3)}               │
│  Status History: ${String(counts[3]).padStart(3)}               │
│  Audit Logs    : ${String(counts[4]).padStart(3)}               │
└─────────────────────────────────────┘
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
