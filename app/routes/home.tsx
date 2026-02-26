import { resumes } from "../constants/index";
import type { Route } from "./+types/home";
import NavBar from "~/components/NavBar";
import { usePuterStore } from "../lib/puter";
import { Link, useNavigate } from "react-router";
import ResumeCard from "../components/ResumeCard";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback on Your dream job!" },
  ];
}

export default function Home() {
  const { isLoading, auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);
  return (
    <main className="bg-[url(/images/bg-main.svg)] bg-cover">
      <NavBar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>Review Your Sumbissions $ Chack AI Powered Feedback</h2>
        </div>
        <div className="resumes-section">
          {resumes.map((resume) => {
            return <ResumeCard key={resume.id} resume={resume} />;
          })}
        </div>
      </section>
    </main>
  );
}
