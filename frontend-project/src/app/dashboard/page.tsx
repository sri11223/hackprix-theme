"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Question {
  name: string;
  label: string;
  type: string;
  min?: number;
  options?: string[];
}

const userTypeQuestions: Record<string, Question[]> = {
  INDIVIDUAL: [
    { name: "profilePicture", label: "Profile Picture URL", type: "text" },
    { name: "age", label: "Age", type: "number", min: 18 },
    { name: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE", "OTHER"] },
    { name: "skills", label: "Skills (comma separated)", type: "text" },
    { name: "bio", label: "Bio", type: "textarea" },
  ],
  STARTUP: [
    { name: "companyName", label: "Company Name", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "domains", label: "Domains", type: "text" },
    { name: "stage", label: "Stage", type: "select", options: ["IDEA", "PROTOTYPE", "MVP", "EARLY_REVENUE", "GROWTH"] },
    { name: "teamSize", label: "Team Size", type: "number", min: 1 },
  ],
  INVESTOR: [
    { name: "investorType", label: "Investor Type", type: "select", options: ["ANGEL", "VC_FIRM", "CORPORATE", "FAMILY_OFFICE", "INDIVIDUAL"] },
  ],
};

export default function DashboardQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<any>({});
  const [userType, setUserType] = useState<string>("");
  const questions = userType ? userTypeQuestions[userType as keyof typeof userTypeQuestions] || [] : [];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Check authentication on component mount
  

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
        console.log("Submitting data:", {
  userType,
  ...answers,
  skills: answers.skills?.split(',').map((s: string) => s.trim()) || [],
  domains: answers.domains?.split(',').map((d: string) => d.trim()) || [],
});

        const res = await fetch("http://localhost:5000/api/profile/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },          credentials: 'include', // Include cookies in the request
          body: JSON.stringify({ 
            userType, 
            ...answers,
            // Format fields based on user type
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
            // Clear invalid token and redirect to login
            Cookies.remove("token");
            router.push("/login");
            return;
          }
          throw new Error(data.message || data.msg || "Failed to complete profile");
        }

        const data = await res.json();
        if (data.success) {
          router.push("/dashboard/main");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <form onSubmit={handleNext} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Complete Your Profile</h2>
        {step === -1 ? (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Select User Type</label>
            <select 
              required 
              className="w-full border rounded-lg px-3 py-2" 
              onChange={handleChange} 
              value={userType}
            >
              <option value="">Select Type</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="STARTUP">Startup</option>
              <option value="INVESTOR">Investor</option>
            </select>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">{questions[step].label}</label>
            {questions[step].type === "select" ? (
              <select 
                name={questions[step].name} 
                required 
                className="w-full border rounded-lg px-3 py-2" 
                onChange={handleChange} 
                value={answers[questions[step].name] || ""}
              >
                <option value="">Select</option>
                {questions[step].options?.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : questions[step].type === "textarea" ? (
              <textarea 
                name={questions[step].name} 
                required 
                rows={3} 
                className="w-full border rounded-lg px-3 py-2" 
                onChange={handleChange} 
                value={answers[questions[step].name] || ""} 
              />
            ) : (
              <input 
                name={questions[step].name} 
                required 
                type={questions[step].type} 
                min={questions[step].min} 
                className="w-full border rounded-lg px-3 py-2" 
                onChange={handleChange} 
                value={answers[questions[step].name] || ""} 
              />
            )}
          </div>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg w-full" 
          disabled={submitting || (step === -1 && !userType)}
        >
          {submitting ? "Submitting..." : step === -1 ? "Start" : step < questions.length - 1 ? "Next" : "Finish"}
        </button>
        {step >= 0 && (
          <div className="mt-4 text-gray-500 text-sm text-center">
            Step {step + 1} of {questions.length}
          </div>
        )}
      </form>
    </div>
  );
}
