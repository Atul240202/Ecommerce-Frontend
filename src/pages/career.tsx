"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "../layouts/MainLayout";
import { JobCard } from "../components/careers/JobCard";
import { JobApplicationModal } from "../components/careers/JobApplicationModal";
import type { JobListing } from "../services/api";
import { Briefcase } from "lucide-react";

const CareerPage: NextPage = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/tempData/job-listings.json");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching job listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Careers - Industrywaala</title>
        <meta
          name="description"
          content="Join our team at Industrywaala and be part of our mission to provide industrial solutions."
        />
      </Head>

      <MainLayout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Team
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                At Industrywaala, we're building the future of industrial
                procurement. Join us in our mission to simplify the industrial
                buying experience.
              </p>
            </div>
          </div>
        </div>

        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Why Join Industrywaala?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Innovative Environment
                </h3>
                <p className="text-gray-600">
                  Work on challenging problems and contribute to innovative
                  solutions in the industrial sector.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600">
                  Develop your skills and advance your career with our
                  continuous learning and development programs.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Collaborative Culture
                </h3>
                <p className="text-gray-600">
                  Join a team that values collaboration, diversity, and creating
                  a positive impact.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-8">
              <Briefcase className="h-6 w-6 mr-2 text-yellow-500" />
              <h2 className="text-2xl md:text-3xl font-bold">
                Current Openings
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No open positions at the moment. Please check back later!
                </p>
              </div>
            )}
          </div>
        </div>

        <JobApplicationModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </MainLayout>
    </>
  );
};

export default CareerPage;
