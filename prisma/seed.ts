import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password,
    },
  });
  console.log('Default admin user created: admin / admin123');

  const products = [
    {
      title: 'KSW Hospitality',
      slug: 'ksw-hospitality',
      tagline: 'Complete hotel and restaurant management system',
      description: 'Complete hotel and restaurant management system with POS, booking, and inventory tracking.',
      icon: 'Building2',
      features: ['Property Management', 'Restaurant POS', 'Online Booking', 'Inventory Control'],
      status: 'active',
      url: '/products#hospitality',
      order: 0,
    },
    {
      title: 'Ghantaghar.com',
      slug: 'ghantaghar',
      tagline: 'Nepal\'s premier event listing and ticketing platform',
      description: 'Nepal\'s premier event listing and ticketing platform for concerts, festivals, and cultural events.',
      icon: 'Clock',
      features: ['Event Discovery', 'Online Ticketing', 'Artist Management', 'Analytics Dashboard'],
      status: 'active',
      url: '/products#ghantaghar',
      order: 1,
    },
    {
      title: 'Hourly Place',
      slug: 'hourly-place',
      tagline: 'On-demand space booking platform',
      description: 'On-demand space booking platform for meeting rooms, workspaces, and venues by the hour.',
      icon: 'MapPin',
      features: ['Real-time Availability', 'Instant Booking', 'Secure Payments', 'Space Management'],
      status: 'development',
      url: '/products#hourlyplace',
      order: 2,
    },
    {
      title: 'KSW Marketing',
      slug: 'ksw-marketing',
      tagline: 'All-in-one digital marketing platform',
      description: 'All-in-one digital marketing platform with SEO tools, campaign management, and analytics.',
      icon: 'BarChart3',
      features: ['SEO Optimization', 'Campaign Manager', 'Social Media Scheduling', 'Performance Analytics'],
      status: 'active',
      url: '/products#marketing',
      order: 3,
    },
    {
      title: 'KIRA',
      slug: 'kira',
      tagline: 'AI-powered virtual assistant and chatbot platform',
      description: 'AI-powered virtual assistant and chatbot platform for customer service automation.',
      icon: 'Bot',
      features: ['Natural Language Processing', 'Multi-channel Support', 'Custom Workflows', 'Analytics & Insights'],
      status: 'development',
      url: '/products#kira',
      order: 4,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log('Default products seeded');

  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Kathmandu, Nepal',
      type: 'Full-time',
      description: 'Build and maintain enterprise-grade web applications using React, Next.js, and Node.js.',
      status: 'active',
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design beautiful, intuitive interfaces for our SaaS platforms.',
      status: 'active',
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Kathmandu, Nepal',
      type: 'Full-time',
      description: 'Manage cloud infrastructure, CI/CD pipelines, and container orchestration.',
      status: 'active',
    },
    {
      title: 'Mobile App Developer',
      department: 'Engineering',
      location: 'Kathmandu, Nepal',
      type: 'Full-time',
      description: 'Develop cross-platform mobile applications using React Native or Flutter.',
      status: 'active',
    },
    {
      title: 'Digital Marketing Intern',
      department: 'Marketing',
      location: 'Kathmandu, Nepal',
      type: 'Internship',
      description: 'Assist with SEO, social media management, and content marketing.',
      status: 'active',
    },
    {
      title: 'AI/ML Intern',
      department: 'Engineering',
      location: 'Remote',
      type: 'Internship',
      description: 'Work on machine learning models and AI-powered solutions.',
      status: 'active',
    },
  ];

  for (const job of jobs) {
    const existing = await prisma.job.findFirst({ where: { title: job.title } });
    if (!existing) {
      await prisma.job.create({ data: job });
    }
  }
  console.log('Default jobs seeded');

  const services = [
    {
      title: 'Software Development',
      slug: 'software',
      icon: 'Code2',
      description: 'Custom software solutions tailored to your business needs using modern architectures and best practices.',
      features: ['Custom Application Development', 'API Design & Integration', 'Legacy System Modernization', 'Microservices Architecture', 'Quality Assurance & Testing', 'DevOps & CI/CD'],
      content: '<p>We build robust, scalable software solutions that drive business growth. Our team of experienced developers uses modern frameworks and proven methodologies to deliver high-quality applications on time and within budget.</p><p>From initial concept to deployment and maintenance, we partner with you throughout the entire software development lifecycle, ensuring your vision becomes reality.</p>',
      order: 0,
      published: true,
    },
    {
      title: 'Web Development',
      slug: 'web',
      icon: 'Globe',
      description: 'High-performance websites and web applications built with cutting-edge technologies for an exceptional user experience.',
      features: ['Responsive Web Design', 'Progressive Web Apps', 'E-commerce Solutions', 'Content Management Systems', 'Single Page Applications', 'Performance Optimization'],
      content: '<p>Our web development team crafts beautiful, fast, and accessible websites and web applications. We leverage modern frameworks like React, Next.js, and Node.js to deliver seamless experiences across all devices.</p><p>Whether you need a simple landing page or a complex enterprise application, we have the expertise to bring your vision to life.</p>',
      order: 1,
      published: true,
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile',
      icon: 'Smartphone',
      description: 'Native and cross-platform mobile applications that engage users and deliver results for iOS and Android.',
      features: ['iOS App Development', 'Android App Development', 'Cross-Platform Development', 'UI/UX Design for Mobile', 'App Store Optimization', 'Maintenance & Support'],
      content: '<p>We design and develop mobile applications that users love. Using React Native, Flutter, and native technologies, we create apps that are fast, reliable, and delightful to use.</p><p>From concept to App Store launch, our mobile team handles everything — including UI/UX design, development, testing, and deployment.</p>',
      order: 2,
      published: true,
    },
    {
      title: 'Digital Marketing',
      slug: 'marketing',
      icon: 'Megaphone',
      description: 'Data-driven digital marketing strategies that increase visibility, engage audiences, and drive measurable growth.',
      features: ['Search Engine Optimization', 'Social Media Management', 'Content Marketing', 'PPC Advertising', 'Email Marketing Campaigns', 'Analytics & Reporting'],
      content: '<p>Our digital marketing team helps you reach the right audience at the right time. We create comprehensive marketing strategies that combine SEO, social media, content, and paid advertising to maximize your ROI.</p><p>We track every metric that matters and continuously optimize campaigns to ensure your marketing budget delivers real results.</p>',
      order: 3,
      published: true,
    },
    {
      title: 'Cloud Solutions',
      slug: 'cloud',
      icon: 'Cloud',
      description: 'Enterprise cloud infrastructure, migration, and management services for scalability, security, and cost efficiency.',
      features: ['Cloud Migration Strategy', 'AWS / Azure / GCP Architecture', 'Kubernetes & Containerization', 'Cloud Security & Compliance', 'Monitoring & Optimization', 'Disaster Recovery'],
      content: '<p>Unlock the full potential of cloud computing with our expert guidance. We help businesses migrate, manage, and optimize their cloud infrastructure on AWS, Azure, and Google Cloud.</p><p>Our cloud architects design solutions that scale with your business while maintaining security, reliability, and cost-effectiveness.</p>',
      order: 4,
      published: true,
    },
    {
      title: 'AI Solutions',
      slug: 'ai',
      icon: 'Brain',
      description: 'Artificial intelligence and machine learning solutions that automate processes, generate insights, and create competitive advantage.',
      features: ['Machine Learning Models', 'Natural Language Processing', 'Computer Vision', 'Predictive Analytics', 'Chatbots & Virtual Assistants', 'Data Pipeline Engineering'],
      content: '<p>We harness the power of AI to solve real business problems. From intelligent chatbots to predictive analytics, our AI solutions help you automate processes, uncover insights, and make better decisions.</p><p>Our team stays at the forefront of AI research and applies proven techniques to deliver practical, measurable results for your business.</p>',
      order: 5,
      published: true,
    },
    {
      title: 'IT Consulting',
      slug: 'consulting',
      icon: 'HeadphonesIcon',
      description: 'Strategic technology consulting to help you make informed decisions, optimize operations, and accelerate digital transformation.',
      features: ['Technology Strategy', 'Digital Transformation', 'IT Infrastructure Audit', 'Vendor Evaluation', 'Roadmap Planning', 'Change Management'],
      content: '<p>Our IT consulting services help businesses navigate the complex technology landscape. We provide expert guidance on technology strategy, architecture, and implementation to ensure your IT investments deliver maximum value.</p><p>From startups to enterprises, we work with organizations of all sizes to assess their current technology stack, identify opportunities for improvement, and develop actionable roadmaps for growth.</p>',
      order: 6,
      published: true,
    },
    {
      title: 'Cybersecurity',
      slug: 'security',
      icon: 'Shield',
      description: 'Comprehensive cybersecurity services to protect your business from evolving threats, ensure compliance, and safeguard sensitive data.',
      features: ['Security Audits & Assessments', 'Penetration Testing', 'Incident Response', 'Compliance & Regulations', 'Security Training', 'Managed Security Services'],
      content: '<p>Protect your business from cyber threats with our comprehensive security services. Our team of certified security professionals conducts thorough assessments, implements robust defenses, and provides ongoing monitoring to keep your systems safe.</p><p>We help you meet industry compliance standards, respond to incidents effectively, and build a security-aware culture within your organization.</p>',
      order: 7,
      published: true,
    },
    {
      title: 'Data Analytics',
      slug: 'analytics',
      icon: 'BarChart3',
      description: 'Transform raw data into actionable insights with our analytics services, enabling data-driven decision making across your organization.',
      features: ['Business Intelligence Dashboards', 'Data Warehousing', 'ETL Pipeline Development', 'Predictive Modeling', 'Real-time Analytics', 'Data Visualization'],
      content: '<p>Unlock the power of your data with our analytics services. We help you collect, process, and visualize data to uncover patterns, trends, and opportunities that drive business growth.</p><p>Our team builds custom analytics solutions, from interactive dashboards to advanced machine learning models, that put actionable insights at your fingertips.</p>',
      order: 8,
      published: true,
    },
    {
      title: 'SEO Services',
      slug: 'seo',
      icon: 'Search',
      description: 'Data-driven search engine optimization strategies to improve your online visibility, drive organic traffic, and outperform competitors.',
      features: ['Technical SEO Audit', 'On-Page Optimization', 'Keyword Research & Strategy', 'Link Building', 'Local SEO', 'SEO Analytics & Reporting'],
      content: '<p>Our SEO services help your business rank higher in search engine results, attract qualified traffic, and grow your online presence. We use proven, white-hat techniques that deliver sustainable results.</p><p>From comprehensive technical audits to content strategy and link building, our SEO experts cover every aspect of search optimization to ensure your website reaches its full potential.</p>',
      order: 9,
      published: true,
    },
    {
      title: 'Social Media Management',
      slug: 'social-media',
      icon: 'Share2',
      description: 'Strategic social media management services to build your brand, engage your audience, and drive measurable results across all platforms.',
      features: ['Content Strategy & Creation', 'Community Management', 'Paid Social Advertising', 'Influencer Partnerships', 'Analytics & Reporting', 'Brand Voice Development'],
      content: '<p>Our social media management team helps you build a strong presence across all major platforms. We create engaging content, manage your community, and run targeted ad campaigns that deliver real ROI.</p><p>From strategy development to daily management and reporting, we handle every aspect of your social media presence so you can focus on running your business.</p>',
      order: 10,
      published: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('Default services seeded');

  const portfolios = [
    {
      title: 'Hotel Everest View',
      slug: 'hotel-everest-view',
      category: 'Web Development',
      description: 'A premium booking website for a luxury hotel with stunning mountain views, featuring online reservations and virtual tours.',
      tags: ['React', 'Next.js', 'Tailwind CSS', 'Stripe'],
      client: 'Hotel Everest View',
      url: 'https://example.com/hotel-everest',
      featured: true,
      published: true,
    },
    {
      title: 'SastoBazar E-Commerce',
      slug: 'sasto-bazar',
      category: 'Mobile App',
      description: 'A full-featured mobile e-commerce platform with real-time inventory, secure payments, and order tracking.',
      tags: ['React Native', 'Node.js', 'PostgreSQL', 'Redis'],
      client: 'SastoBazar Pvt. Ltd.',
      featured: true,
      published: true,
    },
    {
      title: 'Nepal Health Records',
      slug: 'nepal-health-records',
      category: 'Web Development',
      description: 'A centralized digital health records system connecting hospitals, clinics, and patients across Nepal.',
      tags: ['Next.js', 'TypeScript', 'Prisma', 'AWS'],
      client: 'Ministry of Health',
      featured: true,
      published: true,
    },
    {
      title: 'Khalti Payment Gateway',
      slug: 'khalti-redesign',
      category: 'UI/UX Design',
      description: 'Complete UI/UX redesign of Nepal\'s leading payment gateway, improving user flow and conversion rates.',
      tags: ['Figma', 'User Research', 'Prototyping', 'Design System'],
      client: 'Khalti Pvt. Ltd.',
      featured: false,
      published: true,
    },
    {
      title: 'Travel Nepal Platform',
      slug: 'travel-nepal',
      category: 'Web Development',
      description: 'A comprehensive travel planning platform with itinerary builder, package booking, and local guide integration.',
      tags: ['Next.js', 'GraphQL', 'MongoDB', 'Google Maps'],
      client: 'Travel Nepal',
      featured: true,
      published: true,
    },
    {
      title: 'Smart Inventory System',
      slug: 'smart-inventory',
      category: 'Software Development',
      description: 'An AI-powered inventory management system with demand forecasting, automated reordering, and real-time analytics.',
      tags: ['Python', 'TensorFlow', 'React', 'Docker'],
      client: 'KSW Internal',
      featured: false,
      published: true,
    },
  ];

  for (const portfolio of portfolios) {
    await prisma.portfolio.upsert({
      where: { slug: portfolio.slug },
      update: {},
      create: portfolio,
    });
  }
  console.log('Default portfolios seeded');

  const timelineEvents = [
    { year: '2019', title: 'Company Founded', icon: 'Building2', description: 'KSW TechZone was established in Kathmandu, Nepal with a vision to deliver world-class software solutions.', order: 0, published: true },
    { year: '2020', title: 'First Major Client', icon: 'Users', description: 'Secured our first enterprise client and grew the team to 10 members.', order: 1, published: true },
    { year: '2021', title: 'KSW Hospitality Launch', icon: 'Globe', description: 'Released our first SaaS product — a complete hotel and restaurant management system.', order: 2, published: true },
    { year: '2022', title: 'Mobile & Cloud Expansion', icon: 'Smartphone', description: 'Expanded into mobile app development and cloud solutions.', order: 3, published: true },
    { year: '2023', title: 'AI & Digital Marketing', icon: 'Brain', description: 'Launched our AI Solutions division and KIRA chatbot platform.', order: 4, published: true },
    { year: '2024', title: 'Team of 50+', icon: 'Code2', description: 'Scaled to over 50 professionals across engineering, design, and marketing.', order: 5, published: true },
    { year: '2025', title: 'Global Reach', icon: 'Globe', description: 'Started serving international clients from US, Europe, and Australia.', order: 6, published: true },
  ];

  for (const event of timelineEvents) {
    const existing = await prisma.timelineEvent.findFirst({ where: { title: event.title } });
    if (!existing) {
      await prisma.timelineEvent.create({ data: event });
    }
  }
  console.log('Default timeline events seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
