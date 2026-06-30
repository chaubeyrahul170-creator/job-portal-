import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model.js';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
import { Application } from './models/application.model.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // clear existing
    await Application.deleteMany();
    await Job.deleteMany();
    await Company.deleteMany();
    await User.deleteMany();

    const hashedPass = await bcrypt.hash('password123', 10);

    const recruiter = await User.create({
      fullName: 'Acme Recruiter',
      email: 'recruiter@acme.com',
      phoneNumber: 1112223333,
      password: hashedPass,
      role: 'recruiter'
    });

    const company = await Company.create({
      name: 'Acme Inc',
      description: 'Demo company for seeding',
      website: 'https://acme.example',
      location: 'Remote',
      logo: '',
      userId: recruiter._id
    });

    const job1 = await Job.create({
      title: 'Frontend Developer',
      description: 'Build and maintain UI components',
      requirements: ['React', 'JavaScript', 'CSS'],
      salary: 70000,
      experienceLevel: 2,
      location: 'Remote',
      jobType: 'Full-time',
      position: 1,
      company: company._id,
      created_by: recruiter._id
    });

    const job2 = await Job.create({
      title: 'Backend Developer',
      description: 'Work on APIs and database',
      requirements: ['Node.js', 'Express', 'MongoDB'],
      salary: 80000,
      experienceLevel: 3,
      location: 'Hybrid',
      jobType: 'Full-time',
      position: 1,
      company: company._id,
      created_by: recruiter._id
    });

    const student = await User.create({
      fullName: 'Test Student',
      email: 'student@example.com',
      phoneNumber: 9998887777,
      password: hashedPass,
      role: 'student',
      profile: {
        bio: 'Looking for frontend roles',
        skills: ['React', 'CSS'],
        resume: '',
        resumeOriginalName: '',
        profilePhoto: ''
      }
    });

    const application = await Application.create({
      job: job1._id,
      applicant: student._id,
      status: 'pending'
    });

    job1.applications.push(application._id);
    await job1.save();

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
