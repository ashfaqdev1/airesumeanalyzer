import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import Ats from "~/components/Ats";
import { usePuterStore } from "~/lib/puter";
export const meta = () => [
  { title: "Resumind | Resume" },
  { name: "description", content: "Detailed overview of resume" },
];
const resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/resume.tsx");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) return;

        const data = JSON.parse(resume);

        const cleanFeedback =
          typeof data.feedback === "string"
            ? JSON.parse(JSON.parse(JSON.parse(data.feedback)))
            : data.feedback;

        // Load PDF
        const resumeBlob = await fs.read(data.resumePath);
        const pdfUrl = URL.createObjectURL(
          new Blob([resumeBlob], { type: "application/pdf" }),
        );
        setResumeUrl(pdfUrl);

        // Load Image
        const imageBlob = await fs.read(data.imagePath);
        const imgUrl = URL.createObjectURL(new Blob([imageBlob]));
        setImageUrl(imgUrl);

        setFeedback(cleanFeedback);
        // console.log(JSON.parse(JSON.parse(data.feedback)));
      } catch (error) {
        console.error("Failed to load resume:", error);
      }
    };

    loadResume();

    // CLEANUP: This prevents memory leaks by revoking the URLs when
    // the component unmounts or the ID changes.
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]); // Only re-run if id changes
  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-grey-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section vg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="blank">
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <Ats score={feedback.ATS.score} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" alt="" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
