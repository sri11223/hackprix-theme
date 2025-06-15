"use client";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiUser, FiBriefcase, FiDollarSign } from "react-icons/fi";

interface Question {
  name: string;
  label: string;
  type: string;
  min?: number;
  options?: string[];
  placeholder?: string;
}

const userTypeQuestions: Record<string, Question[]> = {
  INDIVIDUAL: [
    { 
      name: "profilePicture", 
      label: "Profile Picture URL", 
      type: "text",
      placeholder: "https://example.com/your-photo.jpg" 
    },
    { 
      name: "age", 
      label: "How old are you?", 
      type: "number", 
      min: 18,
      placeholder: "Enter your age" 
    },
    { 
      name: "gender", 
      label: "How do you identify?", 
      type: "select", 
      options: ["MALE", "FEMALE", "OTHER", "Prefer not to say"] 
    },
    { 
      name: "skills", 
      label: "Your top skills (comma separated)", 
      type: "text",
      placeholder: "e.g. Design, Marketing, Programming" 
    },
    { 
      name: "bio", 
      label: "Tell us about yourself", 
      type: "textarea",
      placeholder: "A short bio that showcases your personality..." 
    },
  ],
  STARTUP: [
    { 
      name: "companyName", 
      label: "Company Name", 
      type: "text",
      placeholder: "Your awesome startup name" 
    },
    { 
      name: "description", 
      label: "What problem are you solving?", 
      type: "textarea",
      placeholder: "Describe your startup's mission and vision" 
    },
    { 
      name: "domains", 
      label: "Industry domains (comma separated)", 
      type: "text",
      placeholder: "e.g. Fintech, Healthcare, AI" 
    },
    { 
      name: "stage", 
      label: "Current stage", 
      type: "select", 
      options: ["IDEANTATION", "PROTOTYPE", "MVP", "EARLY REVENUE", "GROWTH", "SCALE"] 
    },
    { 
      name: "teamSize", 
      label: "Team size", 
      type: "number", 
      min: 1,
      placeholder: "How many people in your team?" 
    },
  ],
  INVESTOR: [
    { 
      name: "investorType", 
      label: "Investor Type", 
      type: "select", 
      options: ["Angel Investor", "VC Firm", "Corporate Investor", "Family Office", "Individual Investor"] 
    },
    {
      name: "investmentFocus",
      label: "Investment Focus Areas",
      type: "text",
      placeholder: "e.g. SaaS, Biotech, Clean Energy"
    },
    {
      name: "typicalCheckSize",
      label: "Typical Check Size ($)",
      type: "number",
      placeholder: "e.g. 50000"
    }
  ],
};

const userTypeCards = [
  {
    value: "INDIVIDUAL",
    title: "Individual",
    icon: <FiUser className="w-8 h-8" />,
    description: "Looking for opportunities or to showcase skills"
  },
  {
    value: "STARTUP",
    title: "Startup",
    icon: <FiBriefcase className="w-8 h-8" />,
    description: "Building something new and seeking resources"
  },
  {
    value: "INVESTOR",
    title: "Investor",
    icon: <FiDollarSign className="w-8 h-8" />,
    description: "Looking to discover and fund promising ventures"
  }
];

export default function DashboardQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<any>({});
  const [userType, setUserType] = useState<string>("");
  const questions = userType ? userTypeQuestions[userType as keyof typeof userTypeQuestions] || [] : [];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Check authentication and profile completion
  useEffect(() => {
    const token = Cookies.get("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    const checkProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { "Authorization": `Bearer ${token}` },
          credentials: 'include',
        });

        const data = await res.json();
        
        if (data.success && data.data.profileCompleted) {
          const userType = data.data.userType.toLowerCase();
          router.push(`/dashboard/${userType}/main`);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    };

    checkProfile();
  }, [router]);

  const handleChange = (e: any) => {
    if (step === -1) {
      setUserType(e.target.value);
      Cookies.set("userType", e.target.value);
    } else {
      setAnswers({ ...answers, [e.target.name]: e.target.value });
    }
  };

  const handleNext = async (e: any) => {
    e.preventDefault();
    
    // Scroll to top on each step change
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (step === -1) {
      setStep(0);
      return;
    }
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      setError("");
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("Not authenticated. Please login again.");
        }

        const res = await fetch("http://localhost:5000/api/profile/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ 
            userType, 
            ...answers,
            ...(userType === 'INDIVIDUAL' ? {
              skills: answers.skills?.split(',').map((s: string) => s.trim()) || []
            } : userType === 'STARTUP' ? {
              domains: answers.domains?.split(',').map((d: string) => d.trim()) || [],
              teamSize: parseInt(answers.teamSize) || 0
            } : {})
          })
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.msg === "Invalid token") {
            Cookies.remove("token");
            router.push("/login");
            return;
          }
          throw new Error(data.message || data.msg || "Failed to complete profile");
        }
        
        const data = await res.json();
        if (data.success) {
          router.push(`/dashboard/${userType.toLowerCase()}/main`);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 0) {
      setStep(-1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div 
          ref={containerRef}
          className="bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                key={`title-${step}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-indigo-800"
              >
                {step === -1 ? "Welcome!" : "Complete Your Profile"}
              </motion.h2>
              
              {step >= 0 && (
                <div className="flex items-center space-x-2">
                  {Array.from({ length: questions.length }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-3 rounded-full ${i <= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={step}
                initial={{ opacity: 0, x: step > -1 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step > -1 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                {step === -1 ? (
                  <div className="space-y-6">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 mb-8"
                    >
                      Let's get to know you better. First, tell us who you are:
                    </motion.p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userTypeCards.map((card) => (
                        <motion.div
                          key={card.value}
                          whileHover={{ y: -5, scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-colors ${userType === card.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                          onClick={() => {
                            setUserType(card.value);
                            Cookies.set("userType", card.value);
                          }}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className={`p-3 rounded-full mb-3 ${userType === card.value ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                              {card.icon}
                            </div>
                            <h3 className="font-semibold text-lg">{card.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="mb-6"
                    >
                      <label className="block text-gray-700 font-medium mb-3 text-lg">
                        {questions[step].label}
                      </label>
                      
                      {questions[step].type === "select" ? (
                        <select 
                          name={questions[step].name} 
                          required 
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          onChange={handleChange} 
                          value={answers[questions[step].name] || ""}
                        >
                          <option value="">Select an option</option>
                          {questions[step].options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : questions[step].type === "textarea" ? (
                        <textarea 
                          name={questions[step].name} 
                          required 
                          rows={4} 
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          onChange={handleChange} 
                          value={answers[questions[step].name] || ""}
                          placeholder={questions[step].placeholder}
                        />
                      ) : (
                        <input 
                          name={questions[step].name} 
                          required 
                          type={questions[step].type} 
                          min={questions[step].min} 
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          onChange={handleChange} 
                          value={answers[questions[step].name] || ""}
                          placeholder={questions[step].placeholder}
                        />
                      )}
                    </motion.div>
                  </div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 p-3 bg-red-50 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex justify-between pt-4">
                  {step > -1 ? (
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </motion.button>
                  ) : (
                    <div></div> // Empty div to maintain space
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting || (step === -1 && !userType)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${(submitting || (step === -1 && !userType)) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors`}
                  >
                    <span>
                      {submitting ? "Submitting..." : 
                       step === -1 ? "Get Started" : 
                       step < questions.length - 1 ? "Continue" : "Finish Setup"}
                    </span>
                    {!submitting && (
                      step === questions.length - 1 ? <FiCheck className="inline" /> : <FiArrowRight className="inline" />
                    )}
                  </motion.button>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          {step === -1 ? "You can change this later in settings" : `Step ${step + 1} of ${questions.length}`}
        </motion.div>
      </motion.div>
    </div>
  );
}