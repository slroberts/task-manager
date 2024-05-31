import {
  PrismaClient,
  Permission,
  PriorityLevel,
  Status,
  Color,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if users already exist
    const existingUser1 = await prisma.user.findUnique({
      where: { email: 'user1@example.com' },
    });
    const existingUser2 = await prisma.user.findUnique({
      where: { email: 'user2@example.com' },
    });

    // Create Users if they don't exist
    const user1 =
      existingUser1 ??
      (await prisma.user.create({
        data: {
          email: 'user1@example.com',
          password: 'password1',
        },
      }));

    const user2 =
      existingUser2 ??
      (await prisma.user.create({
        data: {
          email: 'user2@example.com',
          password: 'password2',
        },
      }));

    // Create Project
    const project1 = await prisma.project.create({
      data: {
        title: 'Project 1',
        description: 'Description for project 1',
        createdBy: {
          connect: { id: user1.id },
        },
        dueDates: new Date('2024-12-31'),
        attachments: 'attachment1',
      },
    });

    // Add Members to Project
    await prisma.project.update({
      where: { id: project1.id },
      data: {
        members: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
      },
    });

    // Create CollaboratedProject
    const collaboratedProject1 = await prisma.collaboratedProject.create({
      data: {
        user: {
          connect: { id: user2.id },
        },
        project: {
          connect: { id: project1.id },
        },
        permissions: Permission.ADMIN,
      },
    });

    // Create Team
    const team1 = await prisma.team.create({
      data: {
        name: 'Team 1',
        members: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
      },
    });

    // Create Task
    const task1 = await prisma.task.create({
      data: {
        title: 'Task 1',
        description: 'Description for task 1',
        dueDate: new Date('2024-06-30'),
        priorityLevel: PriorityLevel.HIGH,
        status: Status.IN_PROGRESS,
        attachments: 'attachment1',
        assignedUsers: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
        project: {
          connect: { id: project1.id },
        },
        teams: {
          connect: { id: team1.id },
        },
      },
    });

    // Create Subtask
    const subtask1 = await prisma.subtask.create({
      data: {
        title: 'Subtask 1',
        description: 'Description for subtask 1',
        dueDate: new Date('2024-06-15'),
        status: 'In Progress',
        task: {
          connect: { id: task1.id },
        },
      },
    });

    // Create Category
    const category1 = await prisma.category.create({
      data: {
        name: 'Category 1',
      },
    });

    // Add Task to Category
    await prisma.task.update({
      where: { id: task1.id },
      data: {
        categories: {
          connect: { id: category1.id },
        },
      },
    });

    // Create Label
    const label1 = await prisma.label.create({
      data: {
        name: 'Label 1',
        color: Color.BLUE,
        tasks: {
          connect: { id: task1.id },
        },
        projects: {
          connect: { id: project1.id },
        },
      },
    });

    // Create Comment
    const comment1 = await prisma.comment.create({
      data: {
        text: 'This is a comment.',
        user: {
          connect: { id: user1.id },
        },
        task: {
          connect: { id: task1.id },
        },
        timestamp: new Date(),
      },
    });

    console.log({
      user1,
      user2,
      project1,
      collaboratedProject1,
      team1,
      task1,
      subtask1,
      category1,
      label1,
      comment1,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
