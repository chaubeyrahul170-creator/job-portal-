import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './utils/db.js';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model.js';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
import { Application } from './models/application.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env whether running from root or backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await Application.deleteMany();
    await Job.deleteMany();
    await Company.deleteMany();
    await User.deleteMany();

    const hashedPass = await bcrypt.hash('password123', 10);

    // 1. Create Demo Recruiter
    console.log('Creating demo users...');
    const recruiter = await User.create({
      fullName: 'Rahul Sharma',
      email: 'recruiter@google.com',
      phoneNumber: 9876543210,
      password: hashedPass,
      role: 'recruiter',
      profile: {
        bio: 'Senior Technical Talent Partner at Google',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      }
    });

    // 2. Create Demo Student
    const student = await User.create({
      fullName: 'Aman Verma',
      email: 'student@gmail.com',
      phoneNumber: 9123456780,
      password: hashedPass,
      role: 'student',
      profile: {
        bio: 'Full Stack MERN Developer passionate about scalable web apps',
        skills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Express.js'],
        resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeOriginalName: 'Aman_Verma_Resume.pdf',
        profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
      }
    });

    // 3. Create Real Companies with high-quality logos
    console.log('Creating real companies...');
    const google = await Company.create({
      name: 'Google',
      description: 'Google LLC is an American multinational corporation and technology company focusing on search engine, cloud computing, and AI.',
      website: 'https://about.google',
      location: 'Bangalore, India',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/300px-Google_2015_logo.svg.png',
      userId: recruiter._id
    });

    const microsoft = await Company.create({
      name: 'Microsoft',
      description: 'Microsoft Corporation is a technology giant producing computer software, consumer electronics, and cloud computing solutions.',
      website: 'https://www.microsoft.com',
      location: 'Hyderabad, India',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/300px-Microsoft_logo.svg.png',
      userId: recruiter._id
    });

    const amazon = await Company.create({
      name: 'Amazon',
      description: 'Amazon.com, Inc. is an e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence company.',
      website: 'https://amazon.jobs',
      location: 'Hyderabad, India',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/300px-Amazon_logo.svg.png',
      userId: recruiter._id
    });

    const flipkart = await Company.create({
      name: 'Flipkart',
      description: 'Flipkart is an Indian e-commerce company headquartered in Bangalore, Karnataka, India.',
      website: 'https://www.flipkartcareers.com',
      location: 'Bangalore, India',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
      userId: recruiter._id
    });

    const swiggy = await Company.create({
      name: 'Swiggy',
      description: 'Swiggy is India’s leading on-demand convenience platform with a tech-first logistics and food delivery ecosystem.',
      website: 'https://www.swiggy.com',
      location: 'Bangalore, India',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/300px-Swiggy_logo.svg.png',
      userId: recruiter._id
    });

    // 4. Create Realistic Jobs with correct LPA salary
    console.log('Creating realistic jobs...');
    const job1 = await Job.create({
      title: 'Frontend Developer (React.js)',
      description: 'We are seeking a skilled React.js Developer to join our core product team. You will build user-facing components, optimize web performance, and collaborate with UI/UX designers.',
      requirements: ['React', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs'],
      salary: 16,
      experienceLevel: 2,
      location: 'Bangalore',
      jobType: 'Full-time',
      position: 3,
      company: google._id,
      created_by: recruiter._id
    });

    const job2 = await Job.create({
      title: 'Backend Engineer (Node.js & Microservices)',
      description: 'Join the cloud infrastructure team to build high-scale microservices, design MongoDB schemas, and implement secure RESTful and gRPC APIs.',
      requirements: ['Node.js', 'Express', 'MongoDB', 'Docker', 'System Design'],
      salary: 22,
      experienceLevel: 3,
      location: 'Hyderabad',
      jobType: 'Full-time',
      position: 2,
      company: microsoft._id,
      created_by: recruiter._id
    });

    const job3 = await Job.create({
      title: 'Full Stack Developer (MERN)',
      description: 'Deliver end-to-end features across both client and server side. You will own architecture, database design, and responsive frontend implementation.',
      requirements: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
      salary: 18,
      experienceLevel: 2,
      location: 'Bangalore',
      jobType: 'Full-time',
      position: 4,
      company: flipkart._id,
      created_by: recruiter._id
    });

    const job4 = await Job.create({
      title: 'DevOps & Cloud Engineer',
      description: 'Manage AWS infrastructure, maintain CI/CD pipelines, containerize applications using Docker and Kubernetes, and ensure 99.9% uptime.',
      requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
      salary: 26,
      experienceLevel: 4,
      location: 'Hyderabad',
      jobType: 'Full-time',
      position: 2,
      company: amazon._id,
      created_by: recruiter._id
    });

    const job5 = await Job.create({
      title: 'UI/UX Product Designer',
      description: 'Design intuitive wireframes, mockups, and interaction prototypes for customer-facing mobile and web applications.',
      requirements: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
      salary: 14,
      experienceLevel: 2,
      location: 'Bangalore',
      jobType: 'Full-time',
      position: 2,
      company: swiggy._id,
      created_by: recruiter._id
    });

    const job6 = await Job.create({
      title: 'Data Science & ML Associate',
      description: 'Analyze user behavior data, build recommendation engines, and deploy predictive models using Python, Pandas, and TensorFlow.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Data Analysis'],
      salary: 20,
      experienceLevel: 3,
      location: 'Pune',
      jobType: 'Full-time',
      position: 1,
      company: google._id,
      created_by: recruiter._id
    });

    // 5. Create demo Application with Scheduled Interview for Aman
    console.log('Creating demo application & scheduled interview...');
    const application = await Application.create({
      job: job1._id,
      applicant: student._id,
      status: 'accepted',
      interview: {
        date: '2026-11-05',
        time: '11:00 AM IST',
        mode: 'Online (Google Meet)',
        venue: 'https://meet.google.com/abc-defg-hij',
        notes: 'Technical round 1 focusing on React hooks, state management, and JavaScript coding.'
      }
    });

    job1.applications.push(application._id);
    await job1.save();

    console.log('\n===========================================');
    console.log('🎉 REALISTIC DATABASE SEEDING COMPLETED!');
    console.log('===========================================');
    console.log('Demo Login Credentials:');
    console.log('1. Recruiter: email: recruiter@google.com | password: password123');
    console.log('2. Student:   email: student@gmail.com   | password: password123');
    console.log('Companies created: Google, Microsoft, Amazon, Flipkart, Swiggy');
    console.log('Jobs created: 6 diverse jobs across Bangalore, Hyderabad & Pune');
    console.log('===========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();

