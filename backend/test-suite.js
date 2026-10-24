import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

const runTests = async () => {
  console.log('🚀 STARTING FULL SYSTEM AUDIT & VERIFICATION...');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // ---------------------------------------------------------
    // TEST GROUP 1: AUTH VALIDATIONS & REGISTRATION
    // ---------------------------------------------------------
    console.log('\n--- 1. AUTH & VALIDATION TESTS ---');

    // 1.1 Invalid email rejection
    try {
      await axios.post(`${BASE_URL}/user/register`, {
        fullName: 'Test User',
        email: 'invalid@email',
        phoneNumber: '9876543210',
        password: 'password123',
        role: 'student'
      });
      assert(false, 'Reject email without domain extension');
    } catch (err) {
      assert(err.response?.status === 400, 'Reject email without domain extension', err.response?.data?.message);
    }

    // 1.2 Invalid phone number rejection
    try {
      await axios.post(`${BASE_URL}/user/register`, {
        fullName: 'Test User',
        email: 'valid.user@gmail.com',
        phoneNumber: '12345',
        password: 'password123',
        role: 'student'
      });
      assert(false, 'Reject phone number not 10 digits');
    } catch (err) {
      assert(err.response?.status === 400, 'Reject phone number not 10 digits', err.response?.data?.message);
    }

    // 1.3 Short password rejection
    try {
      await axios.post(`${BASE_URL}/user/register`, {
        fullName: 'Test User',
        email: 'valid.user@gmail.com',
        phoneNumber: '9876543210',
        password: '123',
        role: 'student'
      });
      assert(false, 'Reject password shorter than 6 chars');
    } catch (err) {
      assert(err.response?.status === 400, 'Reject password shorter than 6 chars', err.response?.data?.message);
    }

    // 1.4 Register Student
    const studentEmail = `audit.student.${Date.now()}@gmail.com`;
    const regStudentRes = await axios.post(`${BASE_URL}/user/register`, {
      fullName: 'Audit Student',
      email: studentEmail,
      phoneNumber: '9876543210',
      password: 'password123',
      role: 'student'
    });
    assert(regStudentRes.data.success, 'Register valid student');

    // 1.5 Register Recruiter 1
    const recruiter1Email = `audit.recruiter1.${Date.now()}@gmail.com`;
    const regRec1Res = await axios.post(`${BASE_URL}/user/register`, {
      fullName: 'Audit Recruiter One',
      email: recruiter1Email,
      phoneNumber: '9876543211',
      password: 'password123',
      role: 'recruiter'
    });
    assert(regRec1Res.data.success, 'Register valid Recruiter 1');

    // 1.6 Register Recruiter 2
    const recruiter2Email = `audit.recruiter2.${Date.now()}@gmail.com`;
    const regRec2Res = await axios.post(`${BASE_URL}/user/register`, {
      fullName: 'Audit Recruiter Two',
      email: recruiter2Email,
      phoneNumber: '9876543212',
      password: 'password123',
      role: 'recruiter'
    });
    assert(regRec2Res.data.success, 'Register valid Recruiter 2');

    // 1.7 Login Student
    const studentLogin = await axios.post(`${BASE_URL}/user/login`, {
      email: studentEmail,
      password: 'password123',
      role: 'student'
    });
    assert(studentLogin.data.success, 'Login Student');
    const studentCookie = studentLogin.headers['set-cookie'];

    // 1.8 Login Recruiter 1
    const rec1Login = await axios.post(`${BASE_URL}/user/login`, {
      email: recruiter1Email,
      password: 'password123',
      role: 'recruiter'
    });
    assert(rec1Login.data.success, 'Login Recruiter 1');
    const rec1Cookie = rec1Login.headers['set-cookie'];

    // 1.9 Login Recruiter 2
    const rec2Login = await axios.post(`${BASE_URL}/user/login`, {
      email: recruiter2Email,
      password: 'password123',
      role: 'recruiter'
    });
    assert(rec2Login.data.success, 'Login Recruiter 2');
    const rec2Cookie = rec2Login.headers['set-cookie'];

    // 1.10 Reject Role Mismatch on Login (Student trying to login as recruiter)
    try {
      await axios.post(`${BASE_URL}/user/login`, {
        email: studentEmail,
        password: 'password123',
        role: 'recruiter'
      });
      assert(false, 'Reject role mismatch on login');
    } catch (err) {
      assert(err.response?.status === 400, 'Reject role mismatch on login', err.response?.data?.message);
    }

    // ---------------------------------------------------------
    // TEST GROUP 2: RECRUITER DATA ISOLATION (COMPANIES)
    // ---------------------------------------------------------
    console.log('\n--- 2. RECRUITER PRIVACY & COMPANY ISOLATION ---');

    // 2.1 Recruiter 1 registers Company A
    const comp1Name = `Audit Corp A ${Date.now()}`;
    const comp1Res = await axios.post(
      `${BASE_URL}/company/register`,
      { name: comp1Name },
      { headers: { Cookie: rec1Cookie } }
    );
    assert(comp1Res.data.success, 'Recruiter 1 registers Company A');
    const comp1Id = comp1Res.data.company._id;

    // 2.2 Recruiter 2 registers Company B
    const comp2Name = `Audit Corp B ${Date.now()}`;
    const comp2Res = await axios.post(
      `${BASE_URL}/company/register`,
      { name: comp2Name },
      { headers: { Cookie: rec2Cookie } }
    );
    assert(comp2Res.data.success, 'Recruiter 2 registers Company B');
    const comp2Id = comp2Res.data.company._id;

    // 2.3 Recruiter 1 fetches admin companies -> MUST ONLY GET Company A
    const rec1Companies = await axios.get(`${BASE_URL}/company/getadmincompanies`, {
      headers: { Cookie: rec1Cookie }
    });
    const rec1CompIds = rec1Companies.data.companies.map((c) => c._id);
    assert(
      rec1CompIds.includes(comp1Id) && !rec1CompIds.includes(comp2Id),
      'Recruiter 1 sees ONLY Company A in admin companies'
    );

    // 2.4 Recruiter 2 fetches admin companies -> MUST ONLY GET Company B
    const rec2Companies = await axios.get(`${BASE_URL}/company/getadmincompanies`, {
      headers: { Cookie: rec2Cookie }
    });
    const rec2CompIds = rec2Companies.data.companies.map((c) => c._id);
    assert(
      rec2CompIds.includes(comp2Id) && !rec2CompIds.includes(comp1Id),
      'Recruiter 2 sees ONLY Company B in admin companies'
    );

    // 2.5 Recruiter 2 tries to update Recruiter 1's Company A -> MUST BE 403 FORBIDDEN
    try {
      await axios.put(
        `${BASE_URL}/company/update/${comp1Id}`,
        { name: 'Hacked Name' },
        { headers: { Cookie: rec2Cookie } }
      );
      assert(false, 'Block Recruiter 2 from updating Recruiter 1 company');
    } catch (err) {
      assert(
        err.response?.status === 403,
        'Block Recruiter 2 from updating Recruiter 1 company (403 Forbidden)',
        err.response?.data?.message
      );
    }

    // ---------------------------------------------------------
    // TEST GROUP 3: JOB POSTING & OWNERSHIP ISOLATION
    // ---------------------------------------------------------
    console.log('\n--- 3. JOB POSTING & OWNERSHIP ISOLATION ---');

    // 3.1 Recruiter 1 posts Job 1 under Company A
    const job1Res = await axios.post(
      `${BASE_URL}/job/post`,
      {
        title: 'Full Stack Engineer',
        description: 'React, Node, Mongo, Express developer',
        requirements: 'React, Node.js, MongoDB',
        salary: 12,
        location: 'Bangalore',
        jobType: 'Full-time',
        experience: 2,
        position: 3,
        companyId: comp1Id
      },
      { headers: { Cookie: rec1Cookie } }
    );
    assert(job1Res.data.success, 'Recruiter 1 posts Job 1 under Company A');
    const job1Id = job1Res.data.job._id;

    // 3.2 Recruiter 2 tries to post job under Recruiter 1's Company A -> MUST BE 403 FORBIDDEN
    try {
      await axios.post(
        `${BASE_URL}/job/post`,
        {
          title: 'Fake Job',
          description: 'Malicious post',
          requirements: 'None',
          salary: 50,
          location: 'Remote',
          jobType: 'Full-time',
          experience: 1,
          position: 1,
          companyId: comp1Id
        },
        { headers: { Cookie: rec2Cookie } }
      );
      assert(false, 'Block Recruiter 2 from posting under Recruiter 1 company');
    } catch (err) {
      assert(
        err.response?.status === 403,
        'Block Recruiter 2 from posting under Recruiter 1 company (403 Forbidden)',
        err.response?.data?.message
      );
    }

    // 3.3 Recruiter 2 posts Job 2 under Company B
    const job2Res = await axios.post(
      `${BASE_URL}/job/post`,
      {
        title: 'DevOps Specialist',
        description: 'Docker, Kubernetes, AWS specialist',
        requirements: 'Docker, AWS, CI/CD',
        salary: 18,
        location: 'Hyderabad',
        jobType: 'Full-time',
        experience: 4,
        position: 2,
        companyId: comp2Id
      },
      { headers: { Cookie: rec2Cookie } }
    );
    assert(job2Res.data.success, 'Recruiter 2 posts Job 2 under Company B');
    const job2Id = job2Res.data.job._id;

    // 3.4 Recruiter 1 admin jobs -> MUST ONLY GET Job 1
    const rec1Jobs = await axios.get(`${BASE_URL}/job/getadminjobs`, {
      headers: { Cookie: rec1Cookie }
    });
    const rec1JobIds = rec1Jobs.data.jobs.map((j) => j._id);
    assert(rec1JobIds.includes(job1Id) && !rec1JobIds.includes(job2Id), 'Recruiter 1 sees ONLY Job 1');

    // 3.5 Recruiter 2 admin jobs -> MUST ONLY GET Job 2
    const rec2Jobs = await axios.get(`${BASE_URL}/job/getadminjobs`, {
      headers: { Cookie: rec2Cookie }
    });
    const rec2JobIds = rec2Jobs.data.jobs.map((j) => j._id);
    assert(rec2JobIds.includes(job2Id) && !rec2JobIds.includes(job1Id), 'Recruiter 2 sees ONLY Job 2');

    // ---------------------------------------------------------
    // TEST GROUP 4: APPLICANT WORKFLOW & DATA ISOLATION
    // ---------------------------------------------------------
    console.log('\n--- 4. APPLICANT WORKFLOW & PRIVACY ---');

    // 4.1 Student applies to Job 1
    const applyRes = await axios.get(`${BASE_URL}/application/apply/${job1Id}`, {
      headers: { Cookie: studentCookie }
    });
    assert(applyRes.data.success, 'Student applies to Job 1');

    // 4.2 Duplicate application rejection
    try {
      await axios.get(`${BASE_URL}/application/apply/${job1Id}`, {
        headers: { Cookie: studentCookie }
      });
      assert(false, 'Block duplicate application by same student');
    } catch (err) {
      assert(err.response?.status === 400, 'Block duplicate application (400 Bad Request)', err.response?.data?.message);
    }

    // 4.3 Student views applied jobs
    const studentApplied = await axios.get(`${BASE_URL}/application/get`, {
      headers: { Cookie: studentCookie }
    });
    const appliedJobIds = studentApplied.data.application.map((a) => a.job?._id);
    assert(appliedJobIds.includes(job1Id), 'Student sees Job 1 in their applied jobs list');
    const applicationId = studentApplied.data.application.find((a) => a.job?._id === job1Id)._id;

    // 4.4 Recruiter 1 views applicants for Job 1 -> MUST SUCCEED
    const rec1Applicants = await axios.get(`${BASE_URL}/application/${job1Id}/applicants`, {
      headers: { Cookie: rec1Cookie }
    });
    assert(rec1Applicants.data.success, 'Recruiter 1 views applicants for Job 1');
    assert(rec1Applicants.data.job.applications.length > 0, 'Recruiter 1 sees the student applicant');

    // 4.5 Recruiter 2 tries to view applicants for Job 1 -> MUST BE 403 FORBIDDEN
    try {
      await axios.get(`${BASE_URL}/application/${job1Id}/applicants`, {
        headers: { Cookie: rec2Cookie }
      });
      assert(false, 'Block Recruiter 2 from viewing Job 1 applicants');
    } catch (err) {
      assert(
        err.response?.status === 403,
        'Block Recruiter 2 from viewing Job 1 applicants (403 Forbidden)',
        err.response?.data?.message
      );
    }

    // 4.6 Recruiter 1 updates status of application to "accepted" + interview details
    const updateStatusRes = await axios.post(
      `${BASE_URL}/application/status/${applicationId}/update`,
      {
        status: 'accepted',
        interview: {
          date: '2026-10-30',
          time: '11:00 AM',
          venue: 'Google Meet',
          mode: 'Online',
          notes: 'Technical Interview round 1'
        }
      },
      { headers: { Cookie: rec1Cookie } }
    );
    assert(updateStatusRes.data.success, 'Recruiter 1 updates application status & schedules interview');

    // 4.7 Recruiter 2 tries to update status of Job 1 application -> MUST BE 403 FORBIDDEN
    try {
      await axios.post(
        `${BASE_URL}/application/status/${applicationId}/update`,
        { status: 'rejected' },
        { headers: { Cookie: rec2Cookie } }
      );
      assert(false, 'Block Recruiter 2 from updating Job 1 application');
    } catch (err) {
      assert(
        err.response?.status === 403,
        'Block Recruiter 2 from updating Job 1 application (403 Forbidden)',
        err.response?.data?.message
      );
    }

    // ---------------------------------------------------------
    // CLEANUP TEST DATA
    // ---------------------------------------------------------
    console.log('\n--- CLEANING UP AUDIT TEST DATA ---');
    const mongoose = (await import('mongoose')).default;
    await mongoose.connect('mongodb://127.0.0.1:27017/jobs');
    const { User } = await import('./models/user.model.js');
    const { Company } = await import('./models/company.model.js');
    const { Job } = await import('./models/job.model.js');
    const { Application } = await import('./models/application.model.js');

    await Application.deleteMany({ _id: applicationId });
    await Job.deleteMany({ _id: { $in: [job1Id, job2Id] } });
    await Company.deleteMany({ _id: { $in: [comp1Id, comp2Id] } });
    await User.deleteMany({ email: { $in: [studentEmail, recruiter1Email, recruiter2Email] } });
    await mongoose.disconnect();
    console.log('✅ Audit test data cleaned up cleanly from database.');

    // ---------------------------------------------------------
    // SUMMARY
    // ---------------------------------------------------------
    console.log('\n=============================================');
    console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('=============================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Audit crashed with error:', error);
    process.exit(1);
  }
};

runTests();

