export interface CareerRole {
    id: string;
    slug: string;
    title: string;
    type: string;
    location: string;
    commitment: string;
    shortDescription: string;
    about: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    culture: string[];
    formFields: FormField[];
}

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'radio' | 'file';
    options?: string[];
    required?: boolean;
}

export const ROLES: CareerRole[] = [
    {
        id: 'fullstack',
        slug: 'full-stack-developer-intern',
        title: 'Full Stack Developer',
        type: 'Unpaid Internship',
        location: 'Remote',
        commitment: 'Flexible',
        shortDescription: 'Build frontend systems and backend logic. Fix bugs and optimize performance.',
        about: 'You will work on real production features, building both the frontend and backend of our core platform. This is a hands-on role where you will be expected to contribute code daily, learn modern frameworks, and understand the full lifecycle of a web application.',
        responsibilities: [
            'Contribute to the development of our Next.js frontend.',
            'Assist in building and maintaining backend API routes.',
            'Debug and fix issues across the stack.',
            'Write clean, reusable, and documented code.',
            'Participate in code reviews and team discussions.',
            'Optimize application performance and responsiveness.'
        ],
        requirements: [
            'Basic JavaScript, HTML, CSS knowledge.',
            'Familiarity with Node.js and backend concepts.',
            'Strong willingness to learn and experiment.',
            'Understanding of Git and version control.',
            'Ability to work independently and ask questions when stuck.'
        ],
        benefits: [
            'Real startup exposure.',
            'Mentorship from senior developers.',
            'Experience certificate upon completion.',
            'Portfolio-worthy work on a live product.'
        ],
        culture: [
            'Stress-free environment.',
            'Learning-first approach.',
            'No micromanagement.',
            'Respectful and inclusive communication.'
        ],
        formFields: [
            { id: 'languages', label: 'Programming languages known', type: 'text', required: true },
            { id: 'frameworks', label: 'Frameworks/tools familiarity', type: 'text', required: true },
            { id: 'projects', label: 'Previous projects (links)', type: 'textarea', required: true },
            { id: 'backend_exp', label: 'Do you have backend experience? Explain briefly.', type: 'textarea', required: true }
        ]
    },
    {
        id: 'hr',
        slug: 'hr-intern',
        title: 'HR Internship',
        type: 'Unpaid Internship',
        location: 'Remote',
        commitment: 'Flexible',
        shortDescription: 'Assist in managing applications, coordinating interviews, and building early HR processes.',
        about: 'Join our People Operations team to help us find and nurture talent. You will be instrumental in setting up the foundational HR processes for a growing startup, from recruitment to onboarding.',
        responsibilities: [
            'Screen resumes and shortlist candidates.',
            'Coordinate interview schedules with the technical team.',
            'Help in drafting job descriptions and policy documents.',
            'Assist in virtual onboarding of new interns.',
            'Maintain candidate databases and application records.'
        ],
        requirements: [
            'Strong written and verbal communication skills.',
            'Interest in people operations and recruitment.',
            'Organized and structured approach to tasks.',
            'Proficiency with Google Workspace or similar tools.',
            'Empathetic and professional demeanor.'
        ],
        benefits: [
            'Real-world HR experience.',
            'Networking opportunities.',
            'Experience certificate upon completion.',
            'Insight into startup culture building.'
        ],
        culture: [
            'People-first mindset.',
            'Collaborative atmosphere.',
            'Zero pressure environment.',
            'Focus on long-term relationships.'
        ],
        formFields: [
            { id: 'comm_exp', label: 'Communication experience', type: 'textarea', required: true },
            { id: 'people_mgmt', label: 'People management exposure', type: 'textarea', required: true },
            { id: 'org_tools', label: 'Organizational tools used', type: 'text', required: true },
            { id: 'why_hr', label: 'Why does HR interest you?', type: 'textarea', required: true }
        ]
    },
    {
        id: 'content',
        slug: 'content-management-intern',
        title: 'Content Management Internship',
        type: 'Unpaid Internship',
        location: 'Remote',
        commitment: 'Flexible',
        shortDescription: 'Manage website content, write product descriptions, and ensure consistency across platforms.',
        about: 'You will be the voice of Kridavista across our digital channels. Creating engaging content, writing clear documentation, and ensuring our messaging is consistent and compelling.',
        responsibilities: [
            'Write and edit blog posts, newsletters, and social media content.',
            'Proofread website copy for clarity and accuracy.',
            'Assist in creating product documentation and guides.',
            'Collaborate with the design team on visual content.',
            'Monitor content performance and user engagement.'
        ],
        requirements: [
            'Excellent written communication skills.',
            'Basic understanding of digital marketing and SEO.',
            'Strong attention to detail and grammar.',
            'Creativity and ability to tell stories.',
            'Ability to meet content deadlines.'
        ],
        benefits: [
            'Published portfolio pieces.',
            'SEO and content strategy skills.',
            'Experience certificate upon completion.',
            'Creative freedom.'
        ],
        culture: [
            'Creative and expressive.',
            'Open to new ideas.',
            'Supportive feedback process.',
            'Values quality over quantity.'
        ],
        formFields: [
            { id: 'writing_exp', label: 'Writing experience', type: 'textarea', required: true },
            { id: 'platforms', label: 'Platforms worked on', type: 'text', required: true },
            { id: 'samples', label: 'Sample work links', type: 'textarea', required: true },
            { id: 'interests', label: 'Content areas of interest', type: 'text', required: true }
        ]
    }
];

export function getRoleBySlug(slug: string): CareerRole | undefined {
    return ROLES.find(role => role.slug === slug);
}
