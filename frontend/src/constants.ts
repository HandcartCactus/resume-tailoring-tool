const jobBulletPrompts: string[] = [
    'Describe a significant accomplishment or milestone you achieved in a specific role.',
    'Highlight any awards, recognitions, or positive feedback you received.',
    'Outline the core responsibilities you handled in a particular job or project.',
    'Detail how you managed tasks, deadlines, and collaborated with team members.',
    'List the skills you developed or enhanced during a specific experience.',
    'Include both technical and soft skills that are relevant to the role.',
    'Showcase any innovative solutions or improvements you introduced.',
    'Highlight how your contributions positively impacted processes or outcomes.',
    'Describe challenges you faced and the strategies you used to overcome them.',
    'Emphasize your problem-solving skills and adaptability.',
    'Detail instances where you collaborated with team members or cross-functional teams.',
    'Highlight your communication and teamwork skills.',
    'Specify any projects or initiatives you took the lead on.',
    'Discuss how you planned, executed, and delivered successful outcomes.',
    'If applicable, mention any training programs you conducted or individuals you mentored.',
    "Discuss the impact of your guidance on team members' development.",
    'If you have a background in data analysis, highlight specific analyses you performed.',
    'Mention any actionable insights you derived from data.',
    'If relevant, discuss interactions with clients or customers.',
    'Emphasize customer satisfaction, relationship-building, or problem resolution.',
    'Detail how you ensured compliance with industry standards or regulations.',
    'Highlight any quality control measures you implemented.',
    'Discuss your role in managing projects, including planning, execution, and monitoring.',
    'Mention any project management tools or methodologies you utilized.',
];

const requirementPrompt = [
    'Position descriptions at the top of the job listing can go here as well.',
    'Consider adding the subject areas for the education requirements, without the degree.',
    'Longer requirements get better matches, usually.',
    'Consider breaking out lists of skills into individual requirements.',
    "Feel free to add things that aren't on the job listing that you'd like the reviewer to think, such as 'Ten years of experience in managing diverse teams'. If the resume bullet points that get matched aren't the ones you were thinking of, consider rewriting some bullet points for better clarity.",
    'Any listed job duties (not in the requirements) can go here as well.',
    'Use the import/export buttons to save your work, in case you ever need to redo a section, or want to revisit your analysis.',
  ];

  
export function randomJobBulletPrompt(seed: number) {
    return jobBulletPrompts[seed % jobBulletPrompts.length];
}

export function randomRequirementPrompt(seed: number) {
    return requirementPrompt[seed % requirementPrompt.length];
}
