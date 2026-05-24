import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed forum categories
  const categories = [
    {
      name: "General Discussion",
      slug: "general",
      description: "Chat about anything WordPress, freelancing, or community related.",
      color: "#171717",
      sortOrder: 1,
    },
    {
      name: "WordPress Development",
      slug: "wordpress-dev",
      description: "Themes, plugins, blocks, and core development.",
      color: "#21759B",
      sortOrder: 2,
    },
    {
      name: "Freelancing Tips",
      slug: "freelancing-tips",
      description: "Pricing, client management, contracts, and growing your business.",
      color: "#7B3F00",
      sortOrder: 3,
    },
    {
      name: "Show & Tell",
      slug: "show-and-tell",
      description: "Share your projects, get feedback, and inspire others.",
      color: "#8B5CF6",
      sortOrder: 4,
    },
    {
      name: "Job Board Talk",
      slug: "job-board-talk",
      description: "Discuss listings, proposals, and the job marketplace.",
      color: "#059669",
      sortOrder: 5,
    },
    {
      name: "Feedback & Suggestions",
      slug: "feedback",
      description: "Help us make wrkdsk better. Feature requests and bug reports.",
      color: "#DC2626",
      sortOrder: 6,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log("✅ Forum categories seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
