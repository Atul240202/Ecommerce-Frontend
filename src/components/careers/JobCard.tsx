"use client";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CalendarDays, MapPin, Briefcase, Clock } from "lucide-react";
import type { JobListing } from "../../services/api";

interface JobCardProps {
  job: JobListing;
  onApply: (job: JobListing) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
          <Badge variant="outline" className="w-fit">
            {job.type}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-1" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Posted: {formatDate(job.postedDate)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {job.responsibilities.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Requirements:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {job.requirements.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onApply(job)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
