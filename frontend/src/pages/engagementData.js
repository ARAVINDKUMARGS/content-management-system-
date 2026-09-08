export const demoArticles = [
  {
    id: 'crispr-human-disease',
    title: 'How CRISPR Is Rewriting the Story of Human Disease',
    excerpt: 'A quiet revolution in molecular biology has produced a tool precise enough to correct a single letter in DNA.',
    category: 'Science',
    authorName: 'Dr. Priya Mehta',
    readTime: '7 min read',
    content: 'CRISPR has changed how researchers think about editing genetic information. From basic research to carefully controlled clinical studies, the technology continues to open new questions about how medicine may address inherited disease. This article explores the science, opportunities, and responsibility surrounding that progress.',
  },
  {
    id: 'internet-was-born',
    title: "The Night the Internet Was Born — and Almost Wasn't",
    excerpt: 'On October 29, 1969, a student typed two letters into a terminal at UCLA. The system crashed. The internet arrived.',
    category: 'Technology',
    authorName: 'Thomas Okeke',
    readTime: '6 min read',
    content: 'The first ARPANET connection was humble compared with today’s internet. Yet a short experiment between computers at UCLA and the Stanford Research Institute became a milestone in networking history. This story follows the people, ideas, and engineering decisions behind that early connection.',
  },
  {
    id: 'future-brain-computers',
    title: 'The Future of Brain-Computer Interfaces',
    excerpt: 'Researchers are exploring new ways for people and computers to communicate through neural signals.',
    category: 'Medicine',
    authorName: 'Lena Rao',
    readTime: '5 min read',
    content: 'Brain-computer interfaces combine neuroscience, signal processing, and machine learning. Current research focuses on restoring communication and movement while improving safety, reliability, and accessibility.',
  },
  {
    id: 'climate-cities',
    title: 'How Cities Can Prepare for a Warmer Climate',
    excerpt: 'Urban planning, shade, water management, and resilient infrastructure can reduce climate risks.',
    category: 'Environment',
    authorName: 'Maya Singh',
    readTime: '8 min read',
    content: 'Cities concentrate people, buildings, roads, and economic activity. That makes them especially sensitive to heat and extreme weather. Practical adaptation includes better public spaces, greener streets, efficient water systems, and infrastructure designed for changing conditions.',
  },
];

export const getArticleById = (id) => demoArticles.find((article) => article.id === id);
