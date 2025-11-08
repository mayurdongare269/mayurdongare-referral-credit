export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  students: number;
  rating: number;
  instructor: string;
}

export const courses: Course[] = [
  // Web Development
  {
    id: "1",
    title: "Full Stack Web Development Bootcamp",
    description: "Master React, Node.js, Express, and MongoDB. Build real-world applications from scratch with modern best practices.",
    price: 99,
    image: "💻",
    category: "Web Development",
    level: "Intermediate",
    duration: "40 hours",
    students: 12453,
    rating: 4.8,
    instructor: "Sarah Johnson"
  },
  {
    id: "2",
    title: "Advanced JavaScript & TypeScript",
    description: "Deep dive into JavaScript ES6+, TypeScript, async programming, and modern development patterns.",
    price: 79,
    image: "⚡",
    category: "Web Development",
    level: "Advanced",
    duration: "30 hours",
    students: 8932,
    rating: 4.9,
    instructor: "Michael Chen"
  },
  {
    id: "3",
    title: "React & Next.js Masterclass",
    description: "Build production-ready React applications with Next.js 14, Server Components, and modern tooling.",
    price: 89,
    image: "⚛️",
    category: "Web Development",
    level: "Intermediate",
    duration: "35 hours",
    students: 15678,
    rating: 4.7,
    instructor: "Emily Rodriguez"
  },

  // Design
  {
    id: "4",
    title: "UI/UX Design Complete Course",
    description: "Learn design principles, Figma, user research, prototyping, and create stunning user interfaces.",
    price: 79,
    image: "🎨",
    category: "Design",
    level: "Beginner",
    duration: "25 hours",
    students: 9876,
    rating: 4.6,
    instructor: "David Kim"
  },
  {
    id: "5",
    title: "Advanced Figma for Professionals",
    description: "Master Figma's advanced features, design systems, auto-layout, and collaborative workflows.",
    price: 69,
    image: "🎭",
    category: "Design",
    level: "Advanced",
    duration: "20 hours",
    students: 5432,
    rating: 4.8,
    instructor: "Lisa Anderson"
  },

  // Data Science
  {
    id: "6",
    title: "Data Science with Python",
    description: "Complete data science course covering pandas, NumPy, visualization, machine learning, and real projects.",
    price: 89,
    image: "📊",
    category: "Data Science",
    level: "Intermediate",
    duration: "45 hours",
    students: 11234,
    rating: 4.7,
    instructor: "Dr. James Wilson"
  },
  {
    id: "7",
    title: "Machine Learning A-Z",
    description: "Comprehensive ML course with Python, scikit-learn, TensorFlow, and hands-on projects.",
    price: 99,
    image: "🤖",
    category: "Data Science",
    level: "Advanced",
    duration: "50 hours",
    students: 8765,
    rating: 4.9,
    instructor: "Dr. Priya Sharma"
  },

  // Mobile Development
  {
    id: "8",
    title: "React Native Mobile Development",
    description: "Build cross-platform mobile apps for iOS and Android with React Native and Expo.",
    price: 95,
    image: "📱",
    category: "Mobile Development",
    level: "Intermediate",
    duration: "38 hours",
    students: 7654,
    rating: 4.6,
    instructor: "Alex Martinez"
  },
  {
    id: "9",
    title: "Flutter & Dart Complete Guide",
    description: "Create beautiful native apps for mobile, web, and desktop from a single codebase with Flutter.",
    price: 89,
    image: "🚀",
    category: "Mobile Development",
    level: "Beginner",
    duration: "42 hours",
    students: 9123,
    rating: 4.7,
    instructor: "Sophie Taylor"
  },

  // Business & Marketing
  {
    id: "10",
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course: SEO, social media, email marketing, analytics, and growth strategies.",
    price: 75,
    image: "📈",
    category: "Business",
    level: "Beginner",
    duration: "28 hours",
    students: 13456,
    rating: 4.5,
    instructor: "Mark Thompson"
  },
  {
    id: "11",
    title: "Product Management Essentials",
    description: "Learn product strategy, roadmapping, user stories, agile methodologies, and stakeholder management.",
    price: 85,
    image: "💼",
    category: "Business",
    level: "Intermediate",
    duration: "32 hours",
    students: 6789,
    rating: 4.8,
    instructor: "Rachel Green"
  },

  // DevOps & Cloud
  {
    id: "12",
    title: "AWS Cloud Practitioner Complete",
    description: "Master AWS services, cloud architecture, deployment, security, and get certified as AWS Cloud Practitioner.",
    price: 79,
    image: "☁️",
    category: "DevOps",
    level: "Beginner",
    duration: "30 hours",
    students: 10234,
    rating: 4.7,
    instructor: "Chris Anderson"
  }
];

export const categories = [
  "All Courses",
  "Web Development",
  "Design",
  "Data Science",
  "Mobile Development",
  "Business",
  "DevOps"
];
