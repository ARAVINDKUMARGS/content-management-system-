const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const User = require('./models/User');
const Article = require('./models/Article');
const Quiz = require('./models/Quiz');
const Notification = require('./models/Notification');
const { seededArticles } = require('./models/articleStore');

const seedFullDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoURI) {
      console.log('[Seed Script] No MONGODB_URI provided in environment. Skipping database seed run.');
      process.exit(0);
    }

    console.log('[Seed Script] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, { dbName: 'content_management_system' });
    console.log('[Seed Script] Connected to database: content_management_system');

    console.log('[Seed Script] Cleaning existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Article.deleteMany({}),
      Quiz.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Seed Users
    const users = await User.insertMany([
      {
        _id: new mongoose.Types.ObjectId('66c9f1a00000000000000001'),
        name: 'Amara Silva',
        email: 'admin@lumen.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Lead Editorial Director & Platform Administrator at Lumen.',
      },
      {
        _id: new mongoose.Types.ObjectId('66c9f1a00000000000000002'),
        name: 'Thomas Okeke',
        email: 'author@lumen.com',
        password: hashedPassword,
        role: 'author',
        bio: 'Historian of technology. Former editor at Nature. Coffee enthusiast.',
      },
      {
        _id: new mongoose.Types.ObjectId('66c9f1a00000000000000003'),
        name: 'Priya Mehta',
        email: 'priya.mehta@lumen.com',
        password: hashedPassword,
        role: 'author',
        bio: 'Molecular biologist & science communicator covering genetic engineering.',
      },
      {
        _id: new mongoose.Types.ObjectId('66c9f1a00000000000000004'),
        name: 'Lena Kaufmann',
        email: 'reader@lumen.com',
        password: hashedPassword,
        role: 'reader',
        bio: 'Avid reader and tech quiz enthusiast exploring modern science.',
      },
    ]);

    const admin = users.find((u) => u.role === 'admin');
    const thomas = users.find((u) => u.email === 'author@lumen.com');
    const priya = users.find((u) => u.email === 'priya.mehta@lumen.com');
    const reader = users.find((u) => u.role === 'reader');

    console.log(`[Seed Script] Created ${users.length} Users.`);

    // 2. Seed Articles matching articleStore
    const articleDocs = seededArticles.map((art) => ({
      _id: new mongoose.Types.ObjectId(art._id),
      title: art.title,
      description: art.description,
      content: art.content,
      category: art.category,
      tags: art.tags || [],
      status: art.status === 'pending_review' ? 'pending' : art.status,
      reviewFeedback: art.reviewFeedback || '',
      heroImage: art.heroImage,
      views: art.views || 0,
      likes: art.likes || 0,
      readingTime: art.readingTime || 5,
      author: art.author?.email === 'priya.mehta@lumen.com' ? priya._id : thomas._id,
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
    }));

    const insertedArticles = await Article.insertMany(articleDocs);
    console.log(`[Seed Script] Created ${insertedArticles.length} Articles.`);

    // 3. Seed Quizzes for published articles
    const crisprArticle = insertedArticles[0];
    const internetArticle = insertedArticles[1];

    const quizzes = await Quiz.insertMany([
      {
        _id: new mongoose.Types.ObjectId('66c9f3b00000000000000001'),
        title: 'Genetics & Biotechnology Knowledge Checkpoint',
        description: 'Test your understanding of CRISPR Cas9 and molecular gene editing.',
        articleId: crisprArticle._id,
        createdBy: priya._id,
        status: 'approved',
        questions: [
          {
            question: 'What does CRISPR stand for?',
            options: [
              'Clustered Regularly Interspaced Short Palindromic Repeats',
              'Coded Recombinant Integrated Short Protein Repeats',
              'Clustered RNA Integrated Sequence Protein Replication',
              'Cellular Recombination in Short Palindromic Regions',
            ],
            correctAnswer: 'Clustered Regularly Interspaced Short Palindromic Repeats',
            explanation: 'CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats.',
          },
          {
            question: 'Which protein is most commonly paired with CRISPR as a gene-editing tool?',
            options: ['Cas9', 'Insulin', 'Hemoglobin', 'Collagen'],
            correctAnswer: 'Cas9',
            explanation: 'Cas9 is an endonuclease enzyme that acts as molecular scissors.',
          },
          {
            question: 'Who were awarded the 2020 Nobel Prize in Chemistry for developing CRISPR?',
            options: [
              'Jennifer Doudna and Emmanuelle Charpentier',
              'Marie Curie and Irène Joliot-Curie',
              'Dorothy Hodgkin and Rosalind Franklin',
              'Ada Yonath and Frances Arnold',
            ],
            correctAnswer: 'Jennifer Doudna and Emmanuelle Charpentier',
            explanation: 'Jennifer Doudna and Emmanuelle Charpentier won the Nobel Prize.',
          },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId('66c9f3b00000000000000002'),
        title: 'History of ARPANET & Early Internet Checkpoint',
        description: 'Test your knowledge of the earliest electronic network transmissions.',
        articleId: internetArticle._id,
        createdBy: thomas._id,
        status: 'approved',
        questions: [
          {
            question: 'What were the first two letters transmitted over ARPANET before the system crashed?',
            options: ['LO', 'IN', 'HI', 'GO'],
            correctAnswer: 'LO',
            explanation: 'The system crashed after receiving the first two letters "LO".',
          },
          {
            question: 'Which university hosted the first host terminal in October 1969?',
            options: ['UCLA', 'MIT', 'Harvard', 'Stanford'],
            correctAnswer: 'UCLA',
            explanation: 'The transmission was sent from UCLA to Stanford Research Institute.',
          },
          {
            question: 'What precursor network laid the groundwork for today\'s global internet?',
            options: ['ARPANET', 'ENIAC', 'ETHERNET', 'BITNET'],
            correctAnswer: 'ARPANET',
            explanation: 'ARPANET established packet switching standards.',
          },
        ],
      },
    ]);

    console.log(`[Seed Script] Created ${quizzes.length} Quizzes.`);

    // 4. Seed Notifications
    const notifications = await Notification.insertMany([
      {
        recipient: thomas._id,
        user: thomas._id,
        title: 'Changes Requested',
        message: 'Admin Amara Silva requested changes on "The Forgotten History of the Mechanical Computer". Feedback: Please expand section on ENIAC programmers.',
        type: 'article_status',
        link: '/profile',
        isRead: false,
      },
      {
        recipient: priya._id,
        user: priya._id,
        title: 'Article Published',
        message: 'Your article "How CRISPR Is Rewriting the Story of Human Disease" has been approved and published live!',
        type: 'article_status',
        link: `/browse/${crisprArticle._id}`,
        isRead: true,
      },
      {
        recipient: priya._id,
        user: priya._id,
        title: '284 Article Likes',
        message: '284 readers have liked your CRISPR article this week.',
        type: 'system',
        link: `/browse/${crisprArticle._id}`,
        isRead: false,
      },
    ]);

    console.log(`[Seed Script] Created ${notifications.length} Notifications.`);

    console.log('\n======================================================');
    console.log('  🌿 Full MongoDB Atlas Database Seed Successful!');
    console.log('======================================================');
    console.log('  Database: content_management_system');
    console.log('  Seed Accounts (Password: password123):');
    console.log('    1. Admin:  Amara Silva   <admin@lumen.com>');
    console.log('    2. Author: Thomas Okeke  <author@lumen.com>');
    console.log('    3. Author: Priya Mehta   <priya.mehta@lumen.com>');
    console.log('    4. Reader: Lena Kaufmann <reader@lumen.com>');
    console.log('======================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedFullDatabase();
}

module.exports = seedFullDatabase;
