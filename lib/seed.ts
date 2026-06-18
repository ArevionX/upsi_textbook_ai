import { createClient } from '@/lib/supabase/server'

// Sample topics to seed
const topics = [
  {
    name: 'Indian History',
    description: 'Ancient, Medieval, and Modern Indian History',
    category: 'History',
    level: 'intermediate',
  },
  {
    name: 'Indian Geography',
    description: 'Physical and Human Geography of India',
    category: 'Geography',
    level: 'intermediate',
  },
  {
    name: 'Indian Polity',
    description: 'Constitution, Government Structure, and Governance',
    category: 'Polity',
    level: 'intermediate',
  },
  {
    name: 'Economics',
    description: 'Indian and World Economy, Monetary Policy, Fiscal Policy',
    category: 'Economics',
    level: 'intermediate',
  },
  {
    name: 'Science and Technology',
    description: 'Basic Science, Space, Technology, and Innovation',
    category: 'Science',
    level: 'intermediate',
  },
]

// Sample questions
const sampleQuestions = [
  {
    question_text: 'Which of the following rulers is credited with founding the Mauryan Empire?',
    question_type: 'mcq',
    difficulty: 'easy',
    options: ['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Brihadratha'],
    correct_answer: 'Chandragupta Maurya',
    explanation: 'Chandragupta Maurya founded the Mauryan Empire around 322 BCE after overthrowing the Nanda dynasty.',
    tags: ['Indian History', 'Mauryan Empire'],
  },
  {
    question_text: 'Who was the first Prime Minister of India?',
    question_type: 'mcq',
    difficulty: 'easy',
    options: ['Sardar Vallabhbhai Patel', 'Jawaharlal Nehru', 'Rajendra Prasad', 'Dr. B.R. Ambedkar'],
    correct_answer: 'Jawaharlal Nehru',
    explanation: 'Jawaharlal Nehru served as the first Prime Minister of India from 1947 to 1964.',
    tags: ['Indian History', 'Independent India'],
  },
  {
    question_text: 'The Deccan Plateau is located in which part of India?',
    question_type: 'mcq',
    difficulty: 'easy',
    options: ['Northern India', 'Southern India', 'Western India', 'Eastern India'],
    correct_answer: 'Southern India',
    explanation: 'The Deccan Plateau is located in Southern India and covers major parts of Maharashtra, Karnataka, and Andhra Pradesh.',
    tags: ['Indian Geography', 'Plateaus'],
  },
  {
    question_text: 'Which article of the Indian Constitution deals with the fundamental rights?',
    question_type: 'mcq',
    difficulty: 'medium',
    options: ['Articles 12-35', 'Articles 36-51', 'Articles 52-62', 'Articles 63-73'],
    correct_answer: 'Articles 12-35',
    explanation: 'Part III of the Indian Constitution (Articles 12-35) deals with Fundamental Rights.',
    tags: ['Indian Polity', 'Constitution'],
  },
  {
    question_text: 'Describe the role of the Election Commission of India.',
    question_type: 'descriptive',
    difficulty: 'medium',
    correct_answer: 'The Election Commission is responsible for conducting elections to the Lok Sabha, Rajya Sabha, State Assemblies, and offices of President and Vice President.',
    explanation: 'The Election Commission of India, established on 26 January 1950, is an autonomous constitutional authority responsible for superintending electoral processes in the country.',
    tags: ['Indian Polity', 'Elections'],
  },
]

export async function seedDatabase() {
  const supabase = await createClient()

  try {
    // Check if topics already exist
    const { data: existingTopics } = await supabase.from('topics').select('id').limit(1)

    if (existingTopics && existingTopics.length > 0) {
      console.log('Database already seeded')
      return
    }

    // Insert topics
    const { data: insertedTopics, error: topicError } = await supabase
      .from('topics')
      .insert(
        topics.map((t) => ({
          ...t,
          id: crypto.randomUUID?.() || Date.now().toString(),
        }))
      )
      .select()

    if (topicError) {
      console.error('Error inserting topics:', topicError)
      return
    }

    console.log('Inserted topics:', insertedTopics?.length)

    // Insert questions for each topic
    if (insertedTopics && insertedTopics.length > 0) {
      const topicId = insertedTopics[0].id
      const questionsToInsert = sampleQuestions.map((q) => ({
        ...q,
        topic_id: topicId,
      }))

      const { data: insertedQuestions, error: questionError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select()

      if (questionError) {
        console.error('Error inserting questions:', questionError)
        return
      }

      console.log('Inserted questions:', insertedQuestions?.length)
    }

    console.log('Database seeding completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
