import { useState, useEffect, useRef } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { getProjectResponse } from './MainProjects';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatHistory = {
  messages: Message[];
  input: string;
};

// Customize these placeholder messages for the input field
const PLACEHOLDER_MESSAGES = [
  'Type your question...',
  'How old are you?',
  'What are your skills?',
  'Where are you located?',
  'What projects have you worked on?',
  'What is your email?',
  'Can I go to your GitHub?',
];

export default function MacTerminal() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    input: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = PLACEHOLDER_MESSAGES[currentPlaceholderIndex];

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length
          );
          timeout = setTimeout(animatePlaceholder, 400);
        } else {
          setPlaceholder((prev) => prev.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, 80);
        }
      } else {
        if (placeholder.length === currentMessage.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setPlaceholder(currentMessage.slice(0, placeholder.length + 1));
          timeout = setTimeout(animatePlaceholder, 120);
        }
      }
    };

    timeout = setTimeout(animatePlaceholder, 100);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, currentPlaceholderIndex]);

  // Customize this welcome message with your information
  const welcomeMessage = `Welcome to My Interactive Portfolio !

Name: Gabriel Luthun
Role: Full Stack Developer
Location: Lille, France

Contact: Click on the Mail icon into the Dock to contact me!
GitHub: https://github.com/gabrielluthun

Ask me anything related to my work or portfolio!

Type /help to know more !
`;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Customize the system prompt with your personal information
  const systemPrompt = `IMPORTANT: You ARE Gabriel himself. You must always speak in first-person ("I", "my", "me"). Never refer to "Gabriel" in third-person.
CURRENT DATE: ${formattedDate} - Always use this exact date when discussing the current date/year.

Example responses:
Q: "Where do you live?"
A: "I live in Lille, France"

Q: "What's your background?"
A: "I'm a Full Stack Developer with experience in Angular, Nest.js, and Node.js"

Q: "How old are you?"
A: "I'm 26 years old"

Q: "What's your email?"
A: "My email is gabriel.luthun@gmail.com"

Core details about me:
- I'm 26 years old
- I live in Lille, France
- I'm a Full Stack Developer
- My email is gabriel.luthun@gmail.com
- I was born in 1999
- I was born in Lille, France

My technical expertise:
- Concepting : MERISE, UML, Lucidchart
- Project Management : Jira, ClickUp
- Frontend Development : Angular, Nest.js, TypeScript
- Backend Development : Fastify, Node
- Testing : Jest, Vitest
- Database : PostgreSQL, MySQL
- DevOps : Docker, GitHub Actions

For questions about my projects, I will use the information from MainProjects.tsx to provide accurate and detailed responses.

Hint : don't hesitate to take informations also from my GitHub to answer the question about projects, skills, etc.

Response rules:
1. ALWAYS use first-person (I, me, my)
2. Never say "Gabriel" or refer to myself in third-person
3. Keep responses concise and professional
4. Don't use Markdown formatting because you're in a terminal : Markdown don't work in a terminal
5. Maintain a friendly, conversational tone
6. Don't use AI language, you're a human. You can use emojis, and you can use some slangs. 
7. Prefer respond in French. But if ANOTHER language is used, respond in that language. 
8. 

If a QUESTION is unrelated to my work or portfolio, say: "That's outside of my portfolio. Feel free to email me at gabriel.luthun@gmail.com and we can discuss further!"

If a question is too personal (like my political opinions, my religion, my sex life, etc.), say: "That's too personal. But if you want to know more about me, feel free to email me at gabriel.luthun@gmail.com and I will be happy to answer your (pertinent) questions!

After each answer, include a separator line.

If the prompt is '/help', display the help message.
"`;

  useEffect(() => {
    setChatHistory((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: 'assistant', content: welcomeMessage },
      ],
    }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatHistory((prev) => ({ ...prev, input: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = chatHistory.input.trim();

    if (!userInput) return;

    setChatHistory((prev) => ({
      messages: [...prev.messages, { role: 'user', content: userInput }],
      input: '',
    }));

    setIsTyping(true);

    try {
      // Check if the question is about projects
      if (userInput.toLowerCase().includes('projet') || 
          userInput.toLowerCase().includes('project')) {
        const projectResponse = getProjectResponse(userInput);
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setChatHistory((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            { role: 'assistant', content: projectResponse },
          ],
        }));
        setIsTyping(false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.messages,
            { role: 'user', content: userInput },
          ],
          projectsInfo: getProjectResponse(userInput)
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: data.message },
        ],
      }));
    } catch (error) {
      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content:
              "I'm having trouble processing that. Try again, or email me on clicking on the Mail icon into the Dock.",
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className='bg-black/75 w-[800px] h-[400px] rounded-lg overflow-hidden shadow-lg mx-4 sm:mx-0'>
      <div className='bg-gray-800 h-6 flex items-center space-x-2 px-4'>
        <div className='w-3 h-3 rounded-full bg-red-500'></div>
        <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
        <div className='w-3 h-3 rounded-full bg-green-500'></div>
        <span className='text-sm text-gray-300 flex-grow text-center font-semibold flex items-center justify-center gap-2'>
          <FaRegFolderClosed size={14} className='text-gray-300' />
          Gabriel Luthun⸺ zsh
        </span>
      </div>
      <div className='p-4 text-gray-200 font-mono text-xs h-[calc(400px-1.5rem)] flex flex-col'>
        <div className='flex-1 overflow-y-auto'>
          {chatHistory.messages.map((msg, index) => (
            <div key={index} className='mb-2'>
              {msg.role === 'user' ? (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400'>{'>'}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              ) : (
                <pre className='whitespace-pre-wrap'>{msg.content}</pre>
              )}
            </div>
          ))}
          {isTyping && <div className='animate-pulse'>...</div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='mt-2'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 border-t border-gray-700 pt-2'>
            {/* Customize the terminal title with your domain */}
            <span className='whitespace-nowrap'>Talk to me :</span>
            <input
              type='text'
              value={chatHistory.input}
              onChange={handleInputChange}
              className='w-full sm:flex-1 bg-transparent outline-none text-white placeholder-gray-400'
              placeholder={placeholder}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
