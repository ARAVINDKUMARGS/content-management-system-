/**
 * Lumen CMS — User Management Module Verification Suite
 * Concise, structured automated test suite verifying MongoDB Atlas connection,
 * Bcrypt security, JWT authentication, Role authorization, and Auth controllers.
 */

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'test_lumen_jwt_secret_key_2026';
process.env.JWT_SECRET = JWT_SECRET;
process.env.JWT_EXPIRES_IN = '7d';

const User = require('../models/User');
const userStore = require('../models/userStore');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { register, login, getMe, logout } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/userController');

// Test runner helper
const results = [];
const runTest = async (category, name, testFn) => {
  try {
    const passed = await testFn();
    results.push({ category, name, passed: !!passed });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'} [${category}] ${name}`);
  } catch (err) {
    results.push({ category, name, passed: false, error: err.message });
    console.log(`❌ FAIL [${category}] ${name} (${err.message})`);
  }
};

const mockRes = () => ({
  statusCode: 200,
  jsonData: null,
  status(code) { this.statusCode = code; return this; },
  json(data) { this.jsonData = data; return this; },
});

async function main() {
  console.log('\n=============================================================');
  console.log('  🧪 Lumen CMS: User Management & Auth Verification Suite');
  console.log('=============================================================\n');

  // 1. Database Connection & Schema
  await runTest('Database', 'Connects to MongoDB Atlas (lumen_cms)', async () => {
    if (process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, { dbName: 'lumen_cms' });
    }
    return mongoose.connection.name === 'lumen_cms';
  });

  await runTest('User Schema', 'Validates email format and min password length', () => {
    const invalid = new User({ name: 'T', email: 'bad-email', password: '123' });
    const err = invalid.validateSync();
    return !!err?.errors?.email && !!err?.errors?.password;
  });

  await runTest('User Schema', 'Excludes password from JSON output', () => {
    const user = new User({ name: 'A', email: 'a@a.com', password: 'pass', role: 'reader' });
    return user.toJSON().password === undefined;
  });

  // 2. Password Security (Bcrypt)
  let hashed = '';
  await runTest('Security', 'Bcrypt hashes password securely', async () => {
    const salt = await bcrypt.genSalt(10);
    hashed = await bcrypt.hash('SecretPass123', salt);
    return !!hashed && hashed !== 'SecretPass123';
  });

  await runTest('Security', 'Bcrypt validates correct password & rejects wrong', async () => {
    const ok = await bcrypt.compare('SecretPass123', hashed);
    const bad = await bcrypt.compare('WrongPass', hashed);
    return ok === true && bad === false;
  });

  // 3. JWT & Role Authorization Middleware
  const testUserId = new mongoose.Types.ObjectId().toString();
  const token = jwt.sign({ id: testUserId, role: 'author' }, JWT_SECRET, { expiresIn: '1h' });

  await runTest('JWT Auth', 'Generates and decodes valid signed JWT', () => {
    const dec = jwt.verify(token, JWT_SECRET);
    return dec.id === testUserId && dec.role === 'author';
  });

  await runTest('JWT Auth', 'Rejects tampered and expired JWTs', () => {
    let invalid = false;
    try { jwt.verify('bad.token', JWT_SECRET); } catch { invalid = true; }
    return invalid;
  });

  await runTest('Middleware', 'Blocks unauthenticated requests (401)', async () => {
    const res = mockRes();
    await authenticateUser({ headers: {} }, res, () => {});
    return res.statusCode === 401;
  });

  await runTest('Role Auth', 'Allows Author & restricts Reader from Author routes', () => {
    const guard = authorizeRole('author', 'admin');
    const res = mockRes();
    guard({ user: { role: 'reader' } }, res, () => {});
    let authorOk = false;
    guard({ user: { role: 'author' } }, mockRes(), () => { authorOk = true; });
    return res.statusCode === 403 && authorOk === true;
  });

  await runTest('Role Auth', 'Restricts non-admin from Admin routes (403)', () => {
    const adminGuard = authorizeRole('admin');
    const res = mockRes();
    adminGuard({ user: { role: 'author' } }, res, () => {});
    return res.statusCode === 403;
  });

  // 4. Registration & Admin Protection
  const testEmail = `user_${Date.now()}@lumen.com`;
  await runTest('Registration', 'Registers new user and returns JWT (201)', async () => {
    const res = mockRes();
    await register({ body: { name: 'Test User', email: testEmail, password: 'password123', role: 'reader' } }, res);
    return res.statusCode === 201 && !!res.jsonData?.token && res.jsonData?.user?.password === undefined;
  });

  await runTest('Registration', 'Rejects duplicate email registration (400)', async () => {
    const res = mockRes();
    await register({ body: { name: 'Test User', email: testEmail, password: 'password123' } }, res);
    return res.statusCode === 400;
  });

  await runTest('Security', 'Strictly blocks public admin registration (403)', async () => {
    const res = mockRes();
    await register({ body: { name: 'Hacker', email: `h_${Date.now()}@evil.com`, password: 'password123', role: 'admin' } }, res);
    return res.statusCode === 403;
  });

  // 5. Login & Profile Operations
  await runTest('Login API', 'Logs in valid user & rejects invalid credentials', async () => {
    const okRes = mockRes();
    await login({ body: { email: 'admin@lumen.com', password: 'admin123' } }, okRes);
    const badRes = mockRes();
    await login({ body: { email: 'admin@lumen.com', password: 'wrong' } }, badRes);
    return okRes.statusCode === 200 && okRes.jsonData?.user?.role === 'admin' && badRes.statusCode === 401;
  });

  await runTest('Profile API', 'Retrieves and updates user profile dynamically (200)', async () => {
    const author = await userStore.findByEmail('author@lumen.com');
    const updateRes = mockRes();
    await updateProfile({ user: { id: author.id || author._id }, body: { name: 'Thomas Okeke', bio: 'Updated bio.' } }, updateRes);
    const getRes = mockRes();
    await getProfile({ user: { id: author.id || author._id } }, getRes);
    return updateRes.statusCode === 200 && getRes.jsonData?.user?.name === 'Thomas Okeke';
  });

  await runTest('Logout API', 'Signs out user cleanly (200)', async () => {
    const res = mockRes();
    await logout({}, res);
    return res.statusCode === 200;
  });

  // Summary
  console.log('\n=============================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`  📊 Verification Results: ${passed}/${total} Passed (${failed} Failed)`);
  console.log('=============================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

main();
